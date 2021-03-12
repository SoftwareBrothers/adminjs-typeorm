/* eslint-disable no-param-reassign */
import { BaseRecord, BaseResource, Filter, flat, ValidationError } from 'admin-bro'
import { BaseEntity } from 'typeorm'
import { Property } from './Property'
import { convertFilter } from './utils/convertFilter'
import { reconstructPostArrays } from './utils/reconstructPostArrays'

type ParamsType = Record<string, any>;

export class Resource extends BaseResource {
  public static validate: any;

  private model: typeof BaseEntity;

  private propsObject: Record<string, Property> = {};

  constructor(model: typeof BaseEntity) {
    super(model)

    this.model = model
    this.propsObject = this.prepareProps()
  }

  public databaseName(): string {
    return this.model.getRepository().metadata.connection.options.database as string || 'typeorm'
  }

  public databaseType(): string {
    return this.model.getRepository().metadata.connection.options.type || 'typeorm'
  }

  public name(): string {
    return this.model.name
  }

  public id(): string {
    return this.model.name
  }

  public properties(): Array<Property> {
    return [...Object.values(this.propsObject)]
  }

  public property(path: string): Property {
    return this.propsObject[path]
  }

  public async count(filter: Filter): Promise<number> {
    return this.model.count(({
      where: convertFilter(filter),
    }))
  }

  public async find(
    filter: Filter,
    params,
  ): Promise<Array<BaseRecord>> {
    const { limit = 10, offset = 0, sort = {} } = params
    const { direction, sortBy } = sort as any
    const instances = await this.model.find({
      where: convertFilter(filter),
      take: limit,
      skip: offset,
      order: {
        [sortBy]: (direction || 'asc').toUpperCase(),
      },
    })
    return instances.map((instance) => new BaseRecord(instance, this))
  }

  public async findOne(id: string | number): Promise<BaseRecord | null> {
    const instance = await this.model.findOne(id)
    if (!instance) {
      return null
    }
    return new BaseRecord(instance, this)
  }

  public async findMany(ids: Array<string | number>): Promise<Array<BaseRecord>> {
    const instances = await this.model.findByIds(ids)
    return instances.map((instance) => new BaseRecord(instance, this))
  }

  public async create(params: Record<string, any>): Promise<ParamsType> {
    const instance = await this.model.create(this.prepareParams(params))

    await this.validateAndSave(instance)

    return instance
  }

  public async update(pk: string | number, params: any = {}): Promise<ParamsType> {
    const instance = await this.model.findOne(pk)
    if (instance) {
      const preparedParams = this.prepareParams(params)
      Object.keys(preparedParams).forEach((paramName) => {
        instance[paramName] = preparedParams[paramName]
      })
      await this.validateAndSave(instance)
      return instance
    }
    throw new Error('Instance not found.')
  }

  public async delete(pk: string | number): Promise<any> {
    try {
      await this.model.delete(pk)
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new ValidationError({}, {
          type: 'QueryFailedError',
          message: error.message,
        })
      }
      throw error
    }
  }

  private prepareProps() {
    const { columns } = this.model.getRepository().metadata
    return columns.reduce((memo, col, index) => {
      const property = new Property(col, index)
      return {
        ...memo,
        [property.path()]: property,
      }
    }, {})
  }

  /** Converts params from string to final type */
  private prepareParams(params: Record<string, any>): Record<string, any> {
    const preparedParams = reconstructPostArrays(params)
    this.properties().forEach((property) => {
      const key = property.path()

      let param
      let applyTransformation
      if (property.column.isArray) {
        applyTransformation = <T>(transformation: (v: T) => any) => (array: T[]) => {
          if (array === null || array === undefined) {
            return array
          }
          if (!Array.isArray(array)) {
            throw Error(`Expected params["${key}"] to be an array. Received ${String(array)}`)
          }
          return array.map(transformation)
        }
        param = preparedParams[key]
      } else {
        applyTransformation = <T>(transformation: (v: T) => any) => (val: T) => transformation(val)
        param = flat.get(preparedParams, key)
      }

      // eslint-disable-next-line no-continue
      if (param === undefined) { return }

      const type = property.type()

      if (type === 'mixed') {
        preparedParams[key] = param
      }

      if (type === 'number') {
        preparedParams[key] = applyTransformation(Number)(param)
      }

      if (type === 'string') {
        preparedParams[key] = applyTransformation(String)(param)
      }

      if (type === 'reference') {
        let paramValue
        const transformation = (p: any) => ({
          // references cannot be stored as an IDs in typeorm, so in order to mimic this) and
          // not fetching reference resource) change this:
          // { postId: "1" }
          // to that:
          // { post: { id: 1 } }
          id: (property.column.type === Number) ? Number(p) : p,
        })
        if (property.column.isArray) {
          paramValue = param
            .map((val: any) => transformation(val))
            .filter((val: any) => val !== null)
        } else if (param === null) {
          paramValue = null
        } else {
          paramValue = transformation(param)
        }
        preparedParams[property.column.propertyName] = paramValue
      }
    })
    return preparedParams
  }

  // eslint-disable-next-line class-methods-use-this
  async validateAndSave(instance: BaseEntity): Promise<any> {
    if (Resource.validate) {
      const errors = await Resource.validate(instance)
      if (errors && errors.length) {
        const validationErrors = errors.reduce((memo, error) => ({
          ...memo,
          [error.property]: {
            type: Object.keys(error.constraints)[0],
            message: Object.values(error.constraints)[0],
          },
        }), {})
        throw new ValidationError(validationErrors)
      }
    }
    try {
      await instance.save()
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new ValidationError({
          [error.column]: {
            type: 'QueryFailedError',
            message: error.message,
          },
        })
      }
    }
  }

  public static isAdapterFor(rawResource: any): boolean {
    try {
      return !!rawResource.getRepository().metadata
    } catch (e) {
      return false
    }
  }
}

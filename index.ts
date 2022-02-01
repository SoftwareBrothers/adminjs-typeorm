/**
 * @module @adminjs/typeorm
 * @subcategory Adapters
 * @section modules
 *
 * @description
 * ### This is an official [AdminJS](https://github.com/SoftwareBrothers/adminjs) adapter which integrates [TypeORM](https://typeorm.io/) into AdminJS. (originally forked from [Arteha/admin-bro-typeorm](https://github.com/Arteha/admin-bro-typeorm))
 *
 * #### Installation
 *
 * ```bash
 * $ yarn add @adminjs/typeorm
 * ```
 *
 * ## Usage
 *
 * The plugin can be registered using standard `AdminJS.registerAdapter` method.
 * 
 * ```typescript
 * import { Database, Resource } from '@adminjs/typeorm'
 * import AdminJS from 'adminjs'
 * 
 * AdminJS.registerAdapter({ Database, Resource });
 * 
 * // Optional: if you use class-validator you have to inject this to resource.
 * import { validate } from 'class-validator'
 * Resource.validate = validate
 * ```
 * 
 * ## Example
 * 
 * ```typescript
 * import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, createConnection, ManyToOne, RelationId } from 'typeorm'
 * import * as express from 'express'
 * import { Database, Resource } from '@adminjs/typeorm'
 * import { validate } from 'class-validator'
 * 
 * import AdminJS from 'adminjs'
 * import * as AdminJSExpress from '@adminjs/express'
 * 
 * Resource.validate = validate
 * AdminJS.registerAdapter({ Database, Resource })
 * 
 * @Entity()
 * export class Person extends BaseEntity
 * {
 *   @PrimaryGeneratedColumn()
 *   public id: number;
 * 
 *   @Column({type: 'varchar'})
 *   public firstName: string;
 * 
 *   @Column({type: 'varchar'})
 *   public lastName: string;
 * 
 *   @ManyToOne(type => CarDealer, carDealer => carDealer.cars)
 *   organization: Organization;
 * 
 *   // in order be able to fetch resources in adminjs - we have to have id available
 *   @RelationId((person: Person) => person.organization)
 *   organizationId: number;
 * 
 *   // For fancy clickable relation links:
 *   public toString(): string
 *   {
 *     return `${firstName} ${lastName}`;
 *   }
 * }
 * 
 * ( async () =>
 * {
 *   const connection = await createConnection({...})
 * 
 *   // Applying connection to model
 *   Person.useConnection(connection)
 * 
 *   const adminJs = new AdminJS({
 *     // databases: [connection],
 *     resources: [
 *       { resource: Person, options: { parent: { name: 'foobar' } } }
 *       ],
 *     rootPath: '/admin',
 *   })
 * 
 *   const app = express()
 *   const router = AdminJSExpress.buildRouter(adminJs)
 *   app.use(adminJs.options.rootPath, router)
 *   app.listen(3000)
 * })()
 * ```
 * 
 * ## ManyToOne
 * 
 * Admin supports ManyToOne relationship but you also have to define @RealationId as stated in the example above.
 *
 */

/**
 * Implementation of {@link BaseDatabase} for TypeORM Adapter
 *
 * @memberof module:@adminjs/typeorm
 * @type {typeof BaseDatabase}
 * @static
 */
 import { Database } from "./src/Database";

 /**
  * Implementation of {@link BaseResource} for TypeORM Adapter
  *
  * @memberof module:@adminjs/typeorm
  * @type {typeof BaseResource}
  * @static
  */
 import { Resource } from "./src/Resource";
 
 export { Resource } from "./src/Resource";
 export { Database } from "./src/Database";
 
 module.exports = { Database, Resource };
 
 export default { Database, Resource };
 
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'detail_ventes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('id_vente').notNullable().unsigned().references('id').inTable('ventes').onDelete('CASCADE')
      table.bigInteger('id_user').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.bigInteger('id_produit').notNullable().unsigned().references('id').inTable('produits').onDelete('CASCADE')
      table.integer('qte', 11).notNullable()
      table.integer('prix_total', 11).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ParamVente extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_produit: number

  @column()
  public prix_vente_unique: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

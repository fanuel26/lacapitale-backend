import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DetailVente extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_vente: number

  @column()
  public id_user: number

  @column()
  public id_produit: number

  @column()
  public qte: number

  @column()
  public prix_total: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

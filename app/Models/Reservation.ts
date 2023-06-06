import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_user: number

  @column()
  public prix_total: number

  @column()
  public date: string

  @column()
  public heure: string

  @column()
  public etat: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

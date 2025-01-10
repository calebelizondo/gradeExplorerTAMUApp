import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dept: string;

  @column()
  public number: string;

  @column()
  public section: string;

  @column()
  public a: number;

  @column()
  public b: number;

  @column()
  public c: number;

  @column()
  public d: number;

  @column()
  public f: number;

  @column()
  public i: number;

  @column()
  public s: number;

  @column()
  public u: number;

  @column()
  public q: number;

  @column()
  public x: number;

  @column()
  public prof: string;

  @column()
  public year: string;

  @column()
  public semester: string;

  @column()
  public gpa: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}

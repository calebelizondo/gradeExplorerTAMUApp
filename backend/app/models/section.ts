import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  public id: number = 0;

  @column()
  public dept: string = '';

  @column()
  public number: string = '';

  @column()
  public section: string = '';

  @column()
  public a: number = -1;

  @column()
  public b: number = -1;

  @column()
  public c: number = -1;

  @column()
  public d: number = -1;

  @column()
  public f: number = -1;

  @column()
  public i: number = -1;

  @column()
  public s: number = -1;

  @column()
  public u: number = -1;

  @column()
  public q: number = -1;

  @column()
  public x: number = -1;

  @column()
  public prof: string = '';

  @column()
  public year: string = '';

  @column()
  public semester: string = '';

  @column()
  public gpa: string = '';

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime | null = null;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime | null = null;
}

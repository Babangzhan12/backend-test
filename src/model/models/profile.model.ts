import {
  Table, Column, Model, DataType,
  ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { User } from './users.model';

@Table({
  tableName: 'profiles',
  timestamps: true,
  paranoid: true,
})
export class Profile extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  profileId!: string;

  @ForeignKey(() => User)
  @Column({type:DataType.UUID, allowNull:true})
  userId!: string;

  @BelongsTo(() => User)
  user?: User;

  @Column({type:DataType.STRING, allowNull:true}) 
  fullName?: string;
  
  @Column({type:DataType.STRING, allowNull:true}) 
  address?: string;

  @Column({type:DataType.STRING, allowNull:true}) 
  phoneNumber?: string;

  @Column({type:DataType.STRING, allowNull:true}) 
  ktpNumber?: string;
}

import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript'
import { User } from './users.model';


@Table({
  tableName: 'roles',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'idx_name',
      unique: true, 
      fields: ['name'], 
    },
  ],
})
export class Role extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  roleId!: string

  @Column({
    type: DataType.ENUM('superadmin', 'admin', 'customer'),
    allowNull: false,
  })
  name!: string

  @HasMany(() => User, { foreignKey: 'roleId' })  
  users?: User[];
}

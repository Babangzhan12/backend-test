import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { Role } from './roles.model';
import { Profile } from './profile.model';
import { Account } from './accounts.model';

export interface UserAttributes {
  userId?: string;
  username: string;
  password: string;
  pin?: string;
  roleId: string;
}


@Table({
  tableName: "users", 
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'idx_username',
      unique: true, 
      fields: ['username'], 
    }
  ],
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  userId?: string;

  @Column({type: DataType.STRING, allowNull: false })
  username!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

 @Column({ type: DataType.STRING, allowNull: true })
  pin?: string;

  @ForeignKey(() => Role)
  @Column({type:DataType.UUID, allowNull: false})
  roleId!: string

  @BelongsTo(() => Role, { foreignKey: 'roleId' })
  role?: Role;

  @HasOne(() => Profile, { foreignKey: 'userId' })
  profile?: Profile;

  @HasMany(() => Account, { foreignKey: 'userId' })
  accounts?: Account[];

}
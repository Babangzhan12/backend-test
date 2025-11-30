import {
  Table, Column, Model, DataType, HasMany
} from 'sequelize-typescript';
import { Account } from './accounts.model';

@Table({
  tableName: 'deposito_types',
  timestamps: true,
  paranoid: true,
})
export class DepositoType extends Model {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  depositoTypeId!: string;

  @Column({type:DataType.STRING, allowNull:false})
  name!: string;

  @Column({type:DataType.DECIMAL(5,4), allowNull:false})
  yearlyReturn!: number; 

    @Column({
    type: DataType.DECIMAL(18,2),
    allowNull: false,
    defaultValue: 0
    })
  initialDeposit!: number;

  @Column({type:DataType.STRING, allowNull:true})
  description?: string;

  @HasMany(() => Account, { foreignKey: 'depositoTypeId' })
  accounts?: Account[];
}

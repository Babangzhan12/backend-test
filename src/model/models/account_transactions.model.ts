import {
  Table, Column, Model, DataType,
  ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Account } from './accounts.model';

@Table({
  tableName: 'account_transactions',
  timestamps: true,
  paranoid: true,
})
export class AccountTransaction extends Model {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  transactionId!: string;

  @ForeignKey(() => Account)
  @Column(DataType.UUID)
  accountId!: string;

  @BelongsTo(() => Account)
  account?: Account;

  @Column({
    type: DataType.ENUM('deposit','withdraw'),
    allowNull: false
  })
  type!: 'deposit' | 'withdraw';

  @Column(DataType.DECIMAL(18,2))
  amount!: number;

  @Column(DataType.DATE)
  transactionDate!: Date;

  @Column({type:DataType.DECIMAL(18,2), allowNull:true})
  startingBalance?: number;

  @Column({type:DataType.DECIMAL(18,2), allowNull:true})
  endingBalance?: number;

  @Column(DataType.STRING)
  note?: string;
}

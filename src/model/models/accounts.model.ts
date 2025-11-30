import {
  Table, Column, Model, DataType,
  ForeignKey, BelongsTo, HasMany
} from 'sequelize-typescript';
import { User } from './users.model';
import { DepositoType } from './deposito_types.model';
import { AccountTransaction } from './account_transactions.model';

@Table({
  tableName: 'accounts',
  timestamps: true,
   paranoid: true,
})
export class Account extends Model {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  accountId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user?: User;

  @ForeignKey(() => DepositoType)
  @Column(DataType.UUID)
  depositoTypeId!: string;

  @BelongsTo(() => DepositoType)
  depositoType?: DepositoType;

  @Column({
    type: DataType.DECIMAL(18,2),
    defaultValue: 0
  })
  balance!: number;

  @HasMany(() => AccountTransaction, { foreignKey: 'accountId' })
  transactions?: AccountTransaction[];
}

import { BaseController, RequestWithUser } from '../base/base.controller';
import { Account, DepositoType } from '../model/index.model';

export class AccountController extends BaseController<Account> {
  constructor() {
    super(Account, {
      searchableFields: [''],
    });
  }

  protected getByIdOptions() {
    return {
      include: [
        {
          model: DepositoType,
          as: "depositoType",
        },
      ],
      paranoid: true,
    };
  }

   protected getAllOptions() {
    return {
      include: [
        {
          model: DepositoType,
          as: "depositoType",
        },
      ],
      paranoid: true,
    };
  }

  protected async beforeCreate(data: any, req: RequestWithUser): Promise<any> {

  const deposito = await DepositoType.findByPk(data.depositoTypeId);
  if (!deposito) {
    throw new Error("Invalid depositoTypeId");
  }

  if (data.topup === undefined || data.topup === null) {
    throw new Error("Topup is required when opening an account");
  }

  const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(v); 

  if (data.topup < deposito.initialDeposit) {
     throw new Error(
      `Minimum deposit for ${deposito.name} is ${formatRupiah(
        deposito.initialDeposit
      )}. You entered ${formatRupiah(data.topup)}.`
    );
  }

  data.balance = data.topup;

  delete data.topup;

  return data;
}

}

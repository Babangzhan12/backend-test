import { BaseController, RequestWithUser } from '../base/base.controller';
import { AccountTransaction, Account, DepositoType } from '../model/index.model';
import sequelize from '../database/database';
import { NextFunction, Response } from 'express';
import { jsonBadRequest, jsonSuccess } from '../utils/responses';

export class AccountTransactionsController extends BaseController<AccountTransaction> {
  constructor() {
    super(AccountTransaction, {
      searchableFields: [''],
    });
  }

protected async applyClientFilter(req: RequestWithUser) {
  const { role, userId } = req.user || {};

  if (!userId) return {};

  switch (role) {
    case 'superadmin':
    case 'admin':
      return {};
    case 'customer':
      const accounts = await Account.findAll({
        where: { userId }
      });

      const accountIds = accounts.map(acc => acc.accountId);

      return { accountId: accountIds };

    default:
      return {};
  }
}


  protected getAllOptions() {
    return {
      include: [
        {
            model: Account,
            include: [
            {
                model: DepositoType,
                as: "depositoType"
            }
            ]
        }
    ],
    paranoid: true,
    };
  }

  private monthsBetween(start: Date, end: Date) {
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }

  private async validateAccountAccess(req: RequestWithUser, t: any) {
    const { role, userId } = req.user || {};
    const { amount } = req.body;
    const accountId = req.params.id;

    if (!accountId) return { error: "accountId is required" };
    if (!amount || isNaN(Number(amount))) return { error: "amount is required and must be a number" };

    const account = await Account.findByPk(accountId, { include: [DepositoType], transaction: t });
    if (!account) return { error: "Invalid accountId" };

    if (role === "customer" && account.getDataValue("userId") !== userId) {
      return { error: "You do not have permission to operate this account" };
    }

    return { account };
  }

  deposit = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();
    try {
        const parsedDate = req.body.transactionDate
        ? new Date(req.body.transactionDate)
        : new Date();
        
        const { amount } = req.body;
        const accountId = req.params.id;

      const { error, account } = await this.validateAccountAccess(req, t);
      if (error) {
        await t.rollback();
        return void jsonBadRequest(res, error);
      }

      const startingBalance = Number(account!.getDataValue("balance"));
      const endingBalance = startingBalance + Number(amount);

      const data = {
        ...req.body,
        accountId,
        type: "deposit",
        startingBalance,
        endingBalance,
        transactionDate: parsedDate,
      };

      const createdTx = await AccountTransaction.create(data, { transaction: t });

      account!.setDataValue("balance", endingBalance);
      await account!.save({ transaction: t });

      await t.commit();

      jsonSuccess(res, createdTx, "Deposit created successfully", 201);
    } catch (err) {
      await t.rollback();
      next(err);
    }
  };

  withdraw = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const t = await sequelize.transaction();

  try {
    const accountId = req.params.id;

    const parsedDate = req.body.transactionDate
      ? new Date(req.body.transactionDate)
      : new Date();

    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      await t.rollback();
      return jsonBadRequest(res, "Invalid withdrawal amount");
    }

    const account = await Account.findOne({
      where: { accountId },
      include: [{ model: DepositoType, as: "depositoType" }],
      transaction: t,
    });

    if (!account) {
      await t.rollback();
      return jsonBadRequest(res, "Account not found");
    }

    const startingBalance = Number(account.getDataValue("balance"));

    const deposito = account.depositoType;
    if (!deposito) {
      await t.rollback();
      return jsonBadRequest(res, "Deposito type not found");
    }

    const lastDeposit = await AccountTransaction.findOne({
      where: { accountId, type: "deposit" },
      order: [["transactionDate", "DESC"]],
      transaction: t,
    });

    let months = 0;

    if (lastDeposit) {
      months = this.monthsBetween(
        new Date(lastDeposit.transactionDate as any),
        parsedDate
      );
      if (months < 0) months = 0;
    }

    const yearlyReturn = Number(deposito.yearlyReturn);
    const monthlyReturn = yearlyReturn / 12;
    const interest = startingBalance * monthlyReturn * months;

    let endingBalance = startingBalance + interest;
    const minLeft = Number(deposito.initialDeposit);
    const endingAfterWithdraw = endingBalance - Number(amount);
      if (endingAfterWithdraw < minLeft) {
      await t.rollback();
      return void jsonBadRequest(
        res,
        `Minimum remaining balance for ${deposito.name} is Rp ${minLeft.toLocaleString("id-ID")}`
      );
    }

    endingBalance = endingAfterWithdraw;

    const createdTx = await AccountTransaction.create(
      {
        accountId,
        type: "withdraw",
        amount,
        startingBalance,
        interestEarned: interest,
        months,
        endingBalance,
        transactionDate: parsedDate,
      },
      { transaction: t }
    );

    await account.update({ balance: endingBalance }, { transaction: t });

    await t.commit();

    return jsonSuccess(res, createdTx, "Withdraw successful", 201);

  } catch (err) {
    await t.rollback();
    next(err);
  }
};

}

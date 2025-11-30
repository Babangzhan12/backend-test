import { Sequelize } from "sequelize-typescript";
import { User } from "./models/users.model";
import { Role } from "./models/roles.model";
import { Profile } from "./models/profile.model";
import { DepositoType } from "./models/deposito_types.model";
import { Account } from "./models/accounts.model";
import { AccountTransaction } from "./models/account_transactions.model";

export const config = async(sequelize:Sequelize)=>{
    sequelize.addModels([
       User,
       Role,
       Profile,
       DepositoType,
       Account,
       AccountTransaction
    ]);
    try {
        await sequelize.sync({ alter: true }); 
        console.log('Database synced!');
    } catch (error) {
        console.error('Database sync error:', error);
    }
} 

export { 
    User,
    Role,
    Profile,
    DepositoType,
    Account,
    AccountTransaction
};
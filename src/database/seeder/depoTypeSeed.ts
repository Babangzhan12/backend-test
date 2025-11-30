import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid';

export default {
  up: async (queryInterface: QueryInterface) => {
    const [depoType] = await queryInterface.sequelize.query(
      `SELECT name FROM deposito_types`
    );

    await queryInterface.sequelize.query(`
      ALTER TABLE "deposito_types"
      ALTER COLUMN "depositoTypeId"
      SET DEFAULT gen_random_uuid();
    `);

    const existingNames = depoType.map((r: any) => r.name);

    const now = new Date();
    const data = [];

    if (!existingNames.includes('Deposito Bronze')) {
      data.push({
        name: "Deposito Bronze",
        yearlyReturn: 0.0300, 
        description: "Basic deposito with 3% yearly return",
        initialDeposit: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (!existingNames.includes('Deposito Silver')) {
      data.push({
         name: "Deposito Silver",
        yearlyReturn: 0.0500, 
        initialDeposit: 100000,
        description: "Mid-level deposito with 5% yearly return",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (!existingNames.includes('Deposito Gold')) {
      data.push({
        name: "Deposito Gold",
        yearlyReturn: 0.0700,
        initialDeposit: 5000000,
        description: "Premium deposito with 7% yearly return",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (data.length > 0) {
      await queryInterface.bulkInsert('deposito_types', data);
      console.log('deposito_types inserted');
    } else {
      console.log('deposito_types already exist');
    }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "deposito_types"
      ALTER COLUMN "depositoTypeId"
      DROP DEFAULT;
    `);
   await queryInterface.bulkDelete('deposito_types', {}, {});
  },
};


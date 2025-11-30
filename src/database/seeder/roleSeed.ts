import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid';

export default {
  up: async (queryInterface: QueryInterface) => {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT name FROM roles`
    );

    await queryInterface.sequelize.query(`
      ALTER TABLE "roles"
      ALTER COLUMN "roleId"
      SET DEFAULT gen_random_uuid();
    `);

    const existingNames = roles.map((r: any) => r.name);

    const now = new Date();
    const data = [];

    if (!existingNames.includes('superadmin')) {
      data.push({
        name: 'superadmin',
        createdAt: now,
        updatedAt: now,
      });
    }

    if (!existingNames.includes('admin')) {
      data.push({
        name: 'admin',
        createdAt: now,
        updatedAt: now,
      });
    }

    if (!existingNames.includes('customer')) {
      data.push({
        name: 'customer',
        createdAt: now,
        updatedAt: now,
      });
    }

    if (data.length > 0) {
      await queryInterface.bulkInsert('roles', data);
      console.log('roles inserted');
    } else {
      console.log('roles already exist');
    }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "roles"
      ALTER COLUMN "roleId"
      DROP DEFAULT;
    `);
   await queryInterface.bulkDelete('roles', {}, {});
  },
};


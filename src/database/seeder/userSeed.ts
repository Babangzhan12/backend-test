import { QueryInterface } from 'sequelize'
import bcrypt from 'bcrypt';

export default {
  up: async (queryInterface: QueryInterface) => {
    const [users] = await queryInterface.sequelize.query(
      `SELECT username FROM users`
    );

    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "userId"
      SET DEFAULT gen_random_uuid();
    `);

    const existingNames = users.map((r: any) => r.name);

    const now = new Date();
    const data = [];
    
    if (!existingNames.includes('superadmin')) {
    const hashedPassword = await bcrypt.hash("superadmin123", 10);
      data.push({
        username: 'superadmin',
        password: hashedPassword,
        roleId: "8c61151c-441c-4e16-a5f6-2bf97a0b104b",
        createdAt: now,
        updatedAt: now,
      });
    }

    if (data.length > 0) {
      await queryInterface.bulkInsert('users', data);
      console.log('users inserted');
    } else {
      console.log('users already exist');
    }
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "userId"
      DROP DEFAULT;
    `);
   await queryInterface.bulkDelete('roles', {}, {});
  },
};


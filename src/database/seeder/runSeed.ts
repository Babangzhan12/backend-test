import sequelize from '../database'
import depoTypeSeed from './depoTypeSeed'
import roleSeed from './roleSeed'

async function run() {
  try {
    await sequelize.authenticate()
    console.log('DB connected')
    // await roleSeed.down(sequelize.getQueryInterface())
    // await roleSeed.up(sequelize.getQueryInterface())
    await depoTypeSeed.up(sequelize.getQueryInterface())
    // await depoTypeSeed.down(sequelize.getQueryInterface())
    console.log('Feature seeding done')
  } catch (err) {
    console.error('Seeding failed:', err)
  } finally {
    await sequelize.close()
  }
}

run()

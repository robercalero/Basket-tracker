const { initDB } = require('../config/db');

initDB()
  .then(() => {
    console.log('Migrations complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });

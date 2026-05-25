const mysql = require('mysql2');
const { execSync } = require('child_process');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function fix() {
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';

  console.log('Trying to fix MySQL auth for user:', user);
  console.log('');

  // Try mysql_native_password first via TCP
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user,
      password,
      authPlugins: {
        auth_gssapi_client: () => () => Buffer.from([]),
      },
    });
    await conn.execute(
      `ALTER USER '${user}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${password}'`
    );
    console.log('✓ Changed to mysql_native_password');
    await conn.end();
    process.exit(0);
  } catch (e) {
    console.log('TCP connection failed:', e.message);
  }

  // Try via named pipe (Windows)
  try {
    const conn = await mysql.createConnection({
      socketPath: '\\\\.\\pipe\\MySQL',
      user,
      password,
    });
    await conn.execute(
      `ALTER USER '${user}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${password}'`
    );
    console.log('✓ Changed via named pipe');
    await conn.end();
    process.exit(0);
  } catch (e) {
    console.log('Named pipe failed:', e.message);
  }

  console.log('');
  console.log('Could not connect automatically. Please run this SQL manually:');
  console.log(`  ALTER USER '${user}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${password}';`);
  console.log('  FLUSH PRIVILEGES;');
  console.log('');
  console.log('You can use MySQL Workbench, the MySQL CLI (mysql -u root -p),');
  console.log('or any other MySQL client to run these commands.');
}

fix().catch(() => process.exit(1));

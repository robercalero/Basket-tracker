const mysql = require('mysql2/promise');
require('dotenv').config();

const baseConfig = () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
});

const pool = mysql.createPool({
  ...baseConfig(),
  database: process.env.DB_NAME || 'basket_tracker',
  authPlugins: {
    auth_gssapi_client: () => () => Buffer.from([]),
  },
});

async function initDB() {
  let conn;
  try {
    conn = await mysql.createConnection({
      ...baseConfig(),
      // TiDB Cloud needs an initial database; use 'sys' which always exists
      database: 'sys',
      authPlugins: {
        auth_gssapi_client: () => () => Buffer.from([]),
      },
    });
  } catch (err) {
    if (err.code === 'AUTH_SWITCH_PLUGIN_ERROR' && err.message.includes('auth_gssapi_client')) {
      console.error('\n❌ MySQL auth error: Your MySQL user uses the "auth_gssapi_client" plugin.');
      console.error('   Fix: Run "node scripts/fix-mysql-auth.cjs" or execute this SQL:');
      console.error(`   ALTER USER '${process.env.DB_USER || 'root'}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${process.env.DB_PASSWORD || ''}';`);
      console.error('   FLUSH PRIVILEGES;\n');
    }
    throw err;
  }
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'basket_tracker'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } catch { /* TiDB Cloud might restrict CREATE DATABASE; using 'sys' as fallback */ }
  await conn.end();

  const sql = `
    CREATE TABLE IF NOT EXISTS profile (
      id INT PRIMARY KEY DEFAULT 1,
      name VARCHAR(100) NOT NULL DEFAULT '',
      gender VARCHAR(10) NOT NULL DEFAULT 'male',
      dob DATE NULL,
      height DECIMAL(5,1) NOT NULL DEFAULT 175,
      plan_idx INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    INSERT IGNORE INTO profile (id) VALUES (1);

    CREATE TABLE IF NOT EXISTS weight_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      weight DECIMAL(5,1) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_date (date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS workouts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      plan_idx INT NOT NULL DEFAULT 0,
      duration_secs INT NOT NULL DEFAULT 0,
      exercises_completed INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_date (date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS exercise_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      workout_id INT NOT NULL,
      exercise_name VARCHAR(200) NOT NULL,
      sets_completed INT NOT NULL DEFAULT 0,
      max_weight DECIMAL(5,1) NOT NULL DEFAULT 0,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
      INDEX idx_workout (workout_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS exercise_sets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      exercise_log_id INT NOT NULL,
      set_index INT NOT NULL,
      weight DECIMAL(5,1) NOT NULL DEFAULT 0,
      reps VARCHAR(20) NOT NULL DEFAULT '',
      rir INT NOT NULL DEFAULT 0,
      is_warmup TINYINT(1) NOT NULL DEFAULT 0,
      logged_at BIGINT NOT NULL DEFAULT 0,
      FOREIGN KEY (exercise_log_id) REFERENCES exercise_logs(id) ON DELETE CASCADE,
      INDEX idx_exercise (exercise_log_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const statements = sql.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log('Database initialized');
}

module.exports = { pool, initDB };

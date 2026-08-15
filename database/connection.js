const mysql = require('mysql2/promise');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let pool = null;

const initializePool = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ Database pool initialized successfully');
    return pool;
  } catch (err) {
    console.error('❌ Error initializing database pool:', err);
    throw err;
  }
};

const getConnection = async () => {
  if (!pool) {
    await initializePool();
  }
  return pool.getConnection();
};

const executeQuery = async (query, params = []) => {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    connection.release();
  }
};

module.exports = {
  initializePool,
  getConnection,
  executeQuery,
  getPool: () => pool
};

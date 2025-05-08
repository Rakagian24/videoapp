import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'mysql.railway.internal',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'FEotrNqzkTnGmPrvgeOhmJnvHeaLecHE',
  database: process.env.MYSQL_DATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

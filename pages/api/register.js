import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { username, password } = req.body;

  if (!username || !password || username.trim() === '' || password.trim() === '') {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      conn.release();
      return res.status(400).json({ error: 'Username already taken' });
    }

    await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    conn.release();

    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
}

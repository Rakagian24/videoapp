import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;
  if (method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  const { userId } = req.query;

  try {
    let query = 'SELECT v.id, v.filename, v.description, v.created_at, u.username, ' +
      '(SELECT COUNT(*) FROM likes l WHERE l.video_id = v.id) AS likes_count, ' +
      '(SELECT COUNT(*) FROM comments c WHERE c.video_id = v.id) AS comments_count ' +
      'FROM videos v JOIN users u ON v.user_id = u.id ';
    let params = [];
    if (userId) {
      query += 'WHERE v.user_id = ? ';
      params.push(userId);
    }
    query += 'ORDER BY v.created_at DESC LIMIT 100';

    const conn = await pool.getConnection();
    const [rows] = await conn.query(query, params);
    conn.release();

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
}

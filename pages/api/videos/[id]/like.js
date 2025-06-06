import pool from '../../../../lib/db';
import { getSession } from 'next-auth/react';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  // const session = await getSession({ req });
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const videoId = req.query.id;
  const userId = session.user.id;

  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query('SELECT * FROM likes WHERE video_id = ? AND user_id = ?', [videoId, userId]);
    if (rows.length > 0) {
      await conn.query('DELETE FROM likes WHERE video_id = ? AND user_id = ?', [videoId, userId]);
      conn.release();
      return res.status(200).json({ liked: false });
    } else {
      await conn.query('INSERT INTO likes (video_id, user_id) VALUES (?, ?)', [videoId, userId]);
      conn.release();
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
}

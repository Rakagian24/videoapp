import pool from '../../../../lib/db';
import { getSession } from 'next-auth/react';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(req, res) {
  const videoId = req.query.id;
  const session = await getServerSession(req, res, authOptions);
  console.log('Session:', session);

  if (req.method === 'GET') {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        'SELECT c.id, c.comment, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.video_id = ? ORDER BY c.created_at DESC',
        [videoId]
      );
      conn.release();

      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'POST') {
    if (!session) {
      console.log('Unauthorized access attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { comment } = req.body;
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: 'Comment required' });
    }
    try {
      const conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO comments (video_id, user_id, comment, created_at) VALUES (?, ?, ?, ?)',
        [videoId, session.user.id, comment, new Date()]
      );
      conn.release();

      res.status(201).json({ message: 'Comment added' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}

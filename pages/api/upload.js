import formidable from 'formidable-serverless';
import fs from 'fs';
import path from 'path';
import pool from '../../lib/db';
import cloudinary from '../../lib/cloudinary';
import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'File upload error' });
    }

    const file = files.video;
    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        resource_type: 'video',
        folder: 'uploads', 
      });

      const conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO videos (user_id, filename, description, created_at) VALUES (?, ?, ?, ?)',
        [session.user.id, result.secure_url, fields.description || '', new Date()]
      );
      conn.release();

      return res.status(200).json({ message: 'Video uploaded to Cloudinary', filename: result.secure_url });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Upload or database error' });
    }
  });
}

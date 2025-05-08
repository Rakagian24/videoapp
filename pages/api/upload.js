import formidable from 'formidable-serverless';
import fs from 'fs';
import path from 'path';
import pool from '../../lib/db';
import { getSession } from 'next-auth/react';
import { getServerSession } from "next-auth/next"

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  // const session = await getSession({ req });
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = './public/uploads';
  form.keepExtensions = true;

  // Create folder if not exist
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true });
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'File upload error' });
    }

    console.log('Fields:', fields);
    console.log('Files:', files);

    const file = files.video;
    if (!file || !file.name) {
      return res.status(400).json({ error: 'No video file uploaded or filename is missing' });
    }

    console.log('File path:', file.path);

    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `${timestamp}-${file.name}`;
    const newPath = path.join(form.uploadDir, filename);

    try {
      await fs.promises.rename(file.path, newPath); 
    } catch (e) {
      console.error('Error moving file:', e);
      return res.status(500).json({ error: 'Failed to save file' });
    }

    try {
      const conn = await pool.getConnection();
      const videoData = {
        user_id: session.user.id,
        filename,
        description: fields.description || '',
        created_at: new Date(),
      };
      await conn.query(
        'INSERT INTO videos (user_id, filename, description, created_at) VALUES (?, ?, ?, ?)',
        [videoData.user_id, videoData.filename, videoData.description, videoData.created_at]
      );
      conn.release();

      return res.status(200).json({ message: 'Video uploaded successfully', filename });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Database error' });
    }
  });
}

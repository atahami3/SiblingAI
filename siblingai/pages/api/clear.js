// pages/api/clear.js
import fs from 'fs';
import path from 'path';

const brainFilePath = path.join(process.cwd(), 'data', 'brain.json');

export default function handler(req, res)
{
    fs.writeFileSync(brainFilePath, JSON.stringify({ questions: [] }, null, 2), 'utf8');
    res.status(200).json({ message: 'My brain cleared successfully as freshly clean' });
};

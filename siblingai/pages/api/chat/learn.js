// pages/api/chat/learn.js

// learn.js is for importing data into brain.json when the question doesnt exist from the user's response
// otherwise the existing response will be returning to chat.js from brain.js
import fs from 'fs';
import path from 'path';

const brainFilePath = path.join(process.cwd(), 'data', 'brain.json');

// returns the response from brain.js to chat.js in order to reply back
const loadBrain = () =>
{
  const data = fs.readFileSync(brainFilePath, 'utf8');
  return JSON.parse(data).questions;
};

// saves the new response into brain.js after learning new things from the user
const saveBrain = (brain) =>
{
  fs.writeFileSync(brainFilePath, JSON.stringify({ questions: brain }, null, 2), 'utf8');
};

export default function handler(req, res)
{
  const { question, answer } = req.body;
  const questions = loadBrain();

  questions.push({ question, answer });
  saveBrain(questions);
  res.status(200).json({ message: 'Thanks for teaching me.' });
}

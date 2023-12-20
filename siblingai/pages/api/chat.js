// pages/api/chat.js

// chat.js is for having a conversation between the real user and the SiblingAI, this is where it can only reads brain.json
// otherwise, it can import the data into brain.json in learn.js when the question doesnt exist in the brain.json
import fs from 'fs';
import path from 'path';
import stringSimilarity from 'string-similarity'; // API library

const brainFilePath = path.join(process.cwd(), 'data', 'brain.json');

// returns the response from brain.js to chat.js in order to reply back by the manager in learn.js
const loadBrain = () =>
{
  try
  {
    const data = fs.readFileSync(brainFilePath, 'utf8');
    const parsedData = JSON.parse(data);

    // check if parsedData has the 'questions' property and it's an array
    if (parsedData && Array.isArray(parsedData.questions))
    {
      return parsedData.questions;
    } else
    {
      // otherwise, initialize with an empty questions array
      saveBrain([]);
      return [];
    }
  } catch (error) // this is for setting up the format in brain.json when the data is empty bc it will cause the error otherwise
  {
    // file not found or JSON parsing error, initialize with an empty questions array
    saveBrain([]);
    return [];
  }
};

// saves the new response into brain.js after learning new things from the user by the manager in learn.js
const saveBrain = (brain) =>
{
  fs.writeFileSync(brainFilePath, JSON.stringify({ questions: brain }, null, 2), 'utf8');
};

export default function handler(req, res)
{
  const { message } = req.body;
  const questions = loadBrain();

  let bestMatch = { bestMatch: { rating: 0 } }; // this is for how accurate response is since it has to be more than 60% accuracy

  if (questions.length > 0)
  {
    // setting up the best match for the user's message
    bestMatch = stringSimilarity.findBestMatch(message.toLowerCase(), questions.map(q => q.question.toLowerCase()));
  }

  if (bestMatch.bestMatch.rating > 0.6) // 60% accuracy question (response) (can change any accuracy anytime)
  {
    const response = questions[bestMatch.bestMatchIndex];
    res.status(200).json({ answer: response.answer });
  } else
  {
    // otherwise, if the response doesnt match or have similarity string in brain.json
    res.status(200).json({ answer: "I don’t know that. Can you teach me?", learn: true });
  }
}

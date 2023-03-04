const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createQuestionTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      title TEXT,
      content TEXT,
      status TEXT
    )`;
  return pool.query(queryText);
};

const createAnswerTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS answers (
      id SERIAL PRIMARY KEY,
      content TEXT,
      question_id INTEGER REFERENCES questions(id)
    )`;
  return pool.query(queryText);
};

module.exports = {
  createQuestionTable,
  createAnswerTable
};
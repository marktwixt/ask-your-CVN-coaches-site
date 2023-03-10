// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: false,
//   user: 'waltostrander@gmail.com',
//   password: 'v2_3zyee_aAmffVPfUdAPtqsXjvZdsza'
// });
// const createUserTable = () => {
//     const queryText =
//       `CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         username TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL
//       )`;
//     return pool.query(queryText);
//   };


// const createQuestionTable = () => {
//   const queryText =
//     `CREATE TABLE IF NOT EXISTS questions (
//       id SERIAL PRIMARY KEY,
//       title TEXT,
//       content TEXT,
//       status TEXT
//     )`;
//   return pool.query(queryText);
// };

// const createAnswerTable = () => {
//   const queryText =
//     `CREATE TABLE IF NOT EXISTS answers (
//       id SERIAL PRIMARY KEY,
//       content TEXT,
//       question_id INTEGER REFERENCES questions(id)
//     )`;
//   return pool.query(queryText);
// };

// module.exports = {
//   createQuestionTable,
//   createAnswerTable,
//   createUserTable
// };
const express = require('express');
const Joi = require('joi');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const Sequelize = require('sequelize');
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const { questionSchema, answerSchema, userSchema } = require('./validationSchema');

const app = express();
const port = process.env.SERVER_PORT || 4004;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport.js configuration
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await models.User.findOne({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await models.User.findOne({ where: { username } });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Load environment variables from .env file
dotenv.config();

// Connect to the database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  ssl: false
});

// Define the Question model
const Question = sequelize.define("question", {
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  question: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  answered: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  answer: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// Define the User model
const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set(value) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(value, salt);
      this.setDataValue('password', hashedPassword);
    },
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Define the relationship between Questions and Users
Question.belongsTo(User);
User.hasMany(Question);

// Create some sample questions
const seed = async () => {
  await Question.sync({ force: true });
  await Question.bulkCreate([
    {
      name: "John",
      question: "What is the best technique for climbing hills?",
      category: "technique",
    },
    {
      name: "Jane",
      question: "What is the best wax for cold temperatures?",
      category: "wax",
    },
    {
      name: "Jim",
      question: "What should I do if I fall during a race?",
      category: "misc",
    },
  ]);
};

// Sync the database and start the server
sequelize.sync()
  .then(() => {
    seed();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
  const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect();

(async () => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`
    );
    await pool.query(
      `CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        title TEXT,
        content TEXT,
        status TEXT,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )`
    );
    await pool.query(
      `CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        content TEXT,
        question_id INTEGER REFERENCES questions(id),
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )`
    );
    console.log("Tables created successfully");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
})();
// Regular user routes
app.get("/api/questions", async (req, res) => {
  try {
  const questions = await Question.findAll({
  include: { model: User, attributes: ["username"] },
  });
  res.json(questions);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error getting questions." });
  }
  });
  
  app.get("/api/user/questions", passport.authenticate("local"), async (req, res) => {
  try {
  const questions = await Question.findAll({
  where: { userId: req.user.id },
  include: { model: User, attributes: ["username"] },
  });
  res.json(questions);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error getting questions." });
  }
  });
  
  app.post("/api/user/questions", passport.authenticate("local"), async (req, res) => {
  try {
  const { question, category } = req.body;
  const newQuestion = await req.user.createQuestion({
  question,
  category,
  });
  res.json(newQuestion);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error creating question." });
  }
  });
  
  app.put("/api/user/questions/:id", passport.authenticate("local"), async (req, res) => {
  try {
  const { id } = req.params;
  const { answer } = req.body;
  const question = await Question.findOne({
  where: { id, userId: req.user.id }
  });
  if (!question) {
  return res.status(404).json({ error: "Question not found." });
  }
  question.answered = true;
  question.answer = answer;
  await question.save();
  res.json(question);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Error updating question." });
  }
  });

// Admin routes
app.get("/admin/questions", async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: { model: User, attributes: ["username"] },
    });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error getting questions." });
  }
});

app.put("/admin/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }
    question.answered = true;
    question.answer = answer;
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating question." });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error logging in." });
      }
      res.json({ username: newUser.username });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering user." });
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error logging in." });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error logging in." });
      }
      res.json({ username: user.username });
    });
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.json({ success: true });
});
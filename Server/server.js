const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const Sequelize = require('sequelize');
const models = require('./models');
const dotenv = require("dotenv");

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
    const isValidPassword = await user.checkPassword(password);
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

// Routes
app.get("/questions", async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { answered: false },
      include: { model: User, attributes: ["username"] },
    });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error getting questions." });
  }
});

app.post("/questions", passport.authenticate("local"), async (req, res) => {
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

app.put("/questions/:id", passport.authenticate("local"), async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const question = await Question.findByPk(id);
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

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ username: req.user.username });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.json({ success: true });
});
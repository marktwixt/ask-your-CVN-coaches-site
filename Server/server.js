const express = require("express");
const app = express();
const dotenv = require("dotenv");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const port = process.env.SERVER_PORT || 4004;

app.use(bodyParser.json());

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

app.get("/questions", (req, res) => {
  Question.findAll().then((questions) => {
    res.json(questions);
  });
});

app.post("/questions", (req, res) => {
  const { name, question, category } = req.body;
  Question.create({ name, question, category }).then((question) => {
    res.json(question);
  });
});

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

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

seed().catch((error) => {
  console.error(error);
});
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/submit_question', (req, res) => {
  let question = req.body.question
  let name = req.body.name
  if(name){
    question = name + ' asked: ' + question
  }
  // Save the question to a database or file
  fs.appendFile('questions.txt', question + '\n', (err) => {
    if (err) throw err;
    console.log('The question was saved!');
  });
  res.status(200).send('Thank you for your question! Your question is: ' + question)
})

app.get('/faq', (req, res) => {
  // Read the questions from a database or file
fs.readFile('questions.txt', 'utf8', (err, data) => {
    if (err) throw err;
    let faq = data.split("\n")
    let ski_technique_questions = faq.filter(question => question.includes("technique"))
    let waxing_questions = faq.filter(question => question.includes("wax"))
    let misc_questions = faq.filter(question => !question.includes("technique") && !question.includes("wax"))
    res.status(200).json({
    ski_technique_questions,
    waxing_questions,
    misc_questions
    })
    });
    })
    
    app.listen(5500, () => {
    console.log('Server is listening on port 5500')
    })

    
    
    
    
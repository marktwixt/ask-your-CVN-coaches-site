const Joi = require('joi');

// Define Joi schema for Question
const questionSchema = Joi.object({
    id: Joi.number().integer().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    status: Joi.string().valid('open', 'closed').required(),
  });
  
  // Define Joi schema for Answer
  const answerSchema = Joi.object({
    id: Joi.number().integer().required(),
    content: Joi.string().required(),
    questionId: Joi.number().integer().required(),
  });
  
  const userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports = { 
    questionSchema, 
    answerSchema, 
    userSchema 
};
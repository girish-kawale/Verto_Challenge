const Joi = require('joi');

const quizValidation = {
  createQuiz: {
    body: Joi.object({
      title: Joi.string().min(1).max(200).required().messages({
        'string.empty': 'Quiz title is required',
        'string.max': 'Quiz title cannot exceed 200 characters'
      })
    })
  },

  addQuestion: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    }),
    body: Joi.object({
      text: Joi.string().min(1).max(1000).required().messages({
        'string.empty': 'Question text is required',
        'string.max': 'Question text cannot exceed 1000 characters'
      }),
      type: Joi.string().valid('single-choice', 'multiple-choice', 'text').required(),
      options: Joi.when('type', {
        is: Joi.string().valid('single-choice', 'multiple-choice'),
        then: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            text: Joi.string().min(1).max(500).required()
          })
        ).min(2).required(),
        otherwise: Joi.array().max(0).optional()
      }),
      correctAnswers: Joi.when('type', {
        is: 'single-choice',
        then: Joi.array().items(Joi.string()).length(1).required(),
        otherwise: Joi.when('type', {
          is: 'multiple-choice',
          then: Joi.array().items(Joi.string()).min(1).required(),
          otherwise: Joi.array().items(Joi.string().max(300)).min(1).required() // text type
        })
      }),
      wordLimit: Joi.when('type', {
        is: 'text',
        then: Joi.number().integer().min(1).max(300).optional(),
        otherwise: Joi.forbidden()
      })
    })
  },

  submitAnswers: {
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    }),
    body: Joi.object({
      answers: Joi.array().items(
        Joi.object({
          questionId: Joi.number().integer().positive().required(),
          answer: Joi.alternatives().try(
            Joi.string().max(300), // For text answers
            Joi.array().items(Joi.string()), // For multiple choice
            Joi.string() // For single choice
          ).required()
        })
      ).min(1).required()
    })
  }
};

module.exports = quizValidation;
const express = require('express');
const quizController = require('../controllers/quizController');
const validate = require('../validators/validate');
const quizValidation = require('../validators/quizValidation');

const router = express.Router();

// Quiz management routes
router.post('/quizzes', validate(quizValidation.createQuiz), quizController.createQuiz);
router.get('/quizzes', quizController.getAllQuizzes);
router.get('/quizzes/:id', quizController.getQuiz);
router.post('/quizzes/:id/questions', validate(quizValidation.addQuestion), quizController.addQuestion);

// Quiz taking routes
router.get('/quizzes/:id/questions', quizController.getQuestionsForTaking);
router.post('/quizzes/:id/submit', validate(quizValidation.submitAnswers), quizController.submitAnswers);

module.exports = router;
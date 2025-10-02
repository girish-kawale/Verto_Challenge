const quizService = require('../services/quizService');

class QuizController {
  async createQuiz(req, res, next) {
    try {
      const { title } = req.body;
      const quiz = quizService.createQuiz(title);
      
      res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: {
          id: quiz.id,
          title: quiz.title,
          createdAt: quiz.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllQuizzes(req, res, next) {
    try {
      const quizzes = quizService.getAllQuizzes();
      
      res.status(200).json({
        success: true,
        message: 'Quizzes retrieved successfully',
        data: quizzes
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuiz(req, res, next) {
    try {
      const { id } = req.params;
      const quiz = quizService.getQuiz(id);
      
      res.status(200).json({
        success: true,
        message: 'Quiz retrieved successfully',
        data: quiz
      });
    } catch (error) {
      if (error.message === 'Quiz not found') {
        return res.status(404).json({
          success: false,
          error: 'Quiz not found'
        });
      }
      next(error);
    }
  }

  async addQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const questionData = req.body;
      
      const question = quizService.addQuestion(id, questionData);
      
      res.status(201).json({
        success: true,
        message: 'Question added successfully',
        data: {
          id: question.id,
          quizId: question.quizId,
          text: question.text,
          type: question.type,
          options: question.options,
          wordLimit: question.wordLimit,
          createdAt: question.createdAt
        }
      });
    } catch (error) {
      if (error.message === 'Quiz not found') {
        return res.status(404).json({
          success: false,
          error: 'Quiz not found'
        });
      }
      next(error);
    }
  }

  async getQuestionsForTaking(req, res, next) {
    try {
      const { id } = req.params;
      const questions = quizService.getQuestionsForTaking(id);
      
      res.status(200).json({
        success: true,
        message: 'Questions retrieved successfully',
        data: questions
      });
    } catch (error) {
      if (error.message === 'Quiz not found') {
        return res.status(404).json({
          success: false,
          error: 'Quiz not found'
        });
      }
      next(error);
    }
  }

  async submitAnswers(req, res, next) {
    try {
      const { id } = req.params;
      const { answers } = req.body;
      
      const result = quizService.submitAnswers(id, answers);
      
      res.status(200).json({
        success: true,
        message: 'Quiz submitted successfully',
        data: {
          score: result.score,
          total: result.total,
          percentage: result.percentage,
          passed: result.percentage >= 60, // 60% passing grade
          results: result.results
        }
      });
    } catch (error) {
      if (error.message === 'Quiz not found') {
        return res.status(404).json({
          success: false,
          error: 'Quiz not found'
        });
      }
      next(error);
    }
  }
}

module.exports = new QuizController();
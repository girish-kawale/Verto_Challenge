const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const dataStore = require('../models/DataStore');

class QuizService {
  createQuiz(title) {
    try {
      const quizId = dataStore.getNextQuizId();
      const quiz = new Quiz(quizId, title);
      return dataStore.createQuiz(quiz);
    } catch (error) {
      throw new Error(`Failed to create quiz: ${error.message}`);
    }
  }

  getAllQuizzes() {
    try {
      return dataStore.getAllQuizzes();
    } catch (error) {
      throw new Error(`Failed to retrieve quizzes: ${error.message}`);
    }
  }

  getQuiz(quizId) {
    try {
      const quiz = dataStore.getQuiz(parseInt(quizId));
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      return {
        id: quiz.id,
        title: quiz.title,
        createdAt: quiz.createdAt,
        questionCount: quiz.questions.length
      };
    } catch (error) {
      throw error;
    }
  }

  addQuestion(quizId, questionData) {
    try {
      const parsedQuizId = parseInt(quizId);
      const quiz = dataStore.getQuiz(parsedQuizId);
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const questionId = dataStore.getNextQuestionId();
      const question = new Question(
        questionId,
        parsedQuizId,
        questionData.text,
        questionData.type,
        questionData.options || [],
        questionData.correctAnswers,
        questionData.wordLimit
      );

      return dataStore.addQuestionToQuiz(parsedQuizId, question);
    } catch (error) {
      throw error;
    }
  }

  getQuestionsForTaking(quizId) {
    try {
      const parsedQuizId = parseInt(quizId);
      const questions = dataStore.getQuestionsForQuiz(parsedQuizId);
      return questions;
    } catch (error) {
      throw error;
    }
  }

  submitAnswers(quizId, answers) {
    try {
      const parsedQuizId = parseInt(quizId);
      const quiz = dataStore.getQuizWithQuestions(parsedQuizId);
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      let correctAnswers = 0;
      const totalQuestions = quiz.questions.length;
      const results = [];

      // Process each submitted answer
      for (const submission of answers) {
        const question = quiz.getQuestion(submission.questionId);
        
        if (!question) {
          results.push({
            questionId: submission.questionId,
            correct: false,
            message: 'Question not found'
          });
          continue;
        }

        const isCorrect = question.isCorrectAnswer(submission.answer);
        if (isCorrect) {
          correctAnswers++;
        }

        results.push({
          questionId: submission.questionId,
          correct: isCorrect,
          userAnswer: submission.answer,
          correctAnswer: question.correctAnswers
        });
      }

      return {
        score: correctAnswers,
        total: totalQuestions,
        percentage: Math.round((correctAnswers / totalQuestions) * 100),
        results: results
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new QuizService();
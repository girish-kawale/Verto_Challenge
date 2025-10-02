// In-memory data store for quizzes
// In a real application, this would be replaced with a database

class DataStore {
  constructor() {
    this.quizzes = new Map();
    this.currentQuizId = 1;
    this.currentQuestionId = 1;
  }

  // Quiz operations
  createQuiz(quiz) {
    this.quizzes.set(quiz.id, quiz);
    return quiz;
  }

  getQuiz(quizId) {
    return this.quizzes.get(quizId);
  }

  getAllQuizzes() {
    return Array.from(this.quizzes.values()).map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      questionCount: quiz.questions.length
    }));
  }

  getNextQuizId() {
    return this.currentQuizId++;
  }

  getNextQuestionId() {
    return this.currentQuestionId++;
  }

  // Question operations
  addQuestionToQuiz(quizId, question) {
    const quiz = this.getQuiz(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    quiz.addQuestion(question);
    return question;
  }

  getQuestionsForQuiz(quizId) {
    const quiz = this.getQuiz(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz.getQuestionsForTaking();
  }

  getQuizWithQuestions(quizId) {
    const quiz = this.getQuiz(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  }

  // Reset data (useful for testing)
  reset() {
    this.quizzes.clear();
    this.currentQuizId = 1;
    this.currentQuestionId = 1;
  }
}

// Singleton instance
const dataStore = new DataStore();
module.exports = dataStore;
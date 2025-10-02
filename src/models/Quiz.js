class Quiz {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.createdAt = new Date();
    this.questions = [];
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  getQuestion(questionId) {
    return this.questions.find(q => q.id === questionId);
  }

  getAllQuestions() {
    return this.questions;
  }

  getQuestionsForTaking() {
    // Return questions without correct answers for quiz taking
    return this.questions.map(question => ({
      id: question.id,
      text: question.text,
      type: question.type,
      options: question.options,
      wordLimit: question.wordLimit
    }));
  }
}

module.exports = Quiz;
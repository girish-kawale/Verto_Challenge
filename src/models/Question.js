class Question {
  constructor(id, quizId, text, type, options = [], correctAnswers = [], wordLimit = null) {
    this.id = id;
    this.quizId = quizId;
    this.text = text;
    this.type = type; // 'single-choice', 'multiple-choice', 'text'
    this.options = options; // Array of option objects with id and text
    this.correctAnswers = correctAnswers; // Array of correct option IDs or text answers
    this.wordLimit = wordLimit; // For text questions (max 300 characters)
    this.createdAt = new Date();

    this.validate();
  }

  validate() {
    if (!this.text || this.text.trim().length === 0) {
      throw new Error('Question text is required');
    }

    if (!['single-choice', 'multiple-choice', 'text'].includes(this.type)) {
      throw new Error('Invalid question type. Must be single-choice, multiple-choice, or text');
    }

    if (this.type === 'text') {
      if (this.wordLimit && this.wordLimit > 300) {
        throw new Error('Word limit for text questions cannot exceed 300 characters');
      }
      if (!this.correctAnswers || this.correctAnswers.length === 0) {
        throw new Error('Text questions must have at least one correct answer');
      }
    } else {
      // Choice questions
      if (!this.options || this.options.length < 2) {
        throw new Error('Choice questions must have at least 2 options');
      }

      if (!this.correctAnswers || this.correctAnswers.length === 0) {
        throw new Error('Questions must have at least one correct answer');
      }

      if (this.type === 'single-choice' && this.correctAnswers.length > 1) {
        throw new Error('Single-choice questions can only have one correct answer');
      }

      // Validate that correct answers exist in options
      const optionIds = this.options.map(opt => opt.id);
      const invalidAnswers = this.correctAnswers.filter(answerId => !optionIds.includes(answerId));
      if (invalidAnswers.length > 0) {
        throw new Error(`Invalid correct answer IDs: ${invalidAnswers.join(', ')}`);
      }
    }
  }

  isCorrectAnswer(userAnswer) {
    if (this.type === 'text') {
      // For text questions, check if user answer matches any correct answer (case-insensitive)
      return this.correctAnswers.some(correctAnswer => 
        correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim()
      );
    } else {
      // For choice questions, check if selected options match correct answers
      if (this.type === 'single-choice') {
        return this.correctAnswers.includes(userAnswer);
      } else {
        // Multiple choice - user answer should be an array
        if (!Array.isArray(userAnswer)) return false;
        return userAnswer.length === this.correctAnswers.length &&
               userAnswer.every(answer => this.correctAnswers.includes(answer)) &&
               this.correctAnswers.every(correct => userAnswer.includes(correct));
      }
    }
  }
}

module.exports = Question;
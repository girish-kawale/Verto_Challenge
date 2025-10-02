const request = require('supertest');
const app = require('../src/app');
const dataStore = require('../src/models/DataStore');

describe('Quiz API', () => {
  beforeEach(() => {
    // Reset data store before each test
    dataStore.reset();
  });

  describe('Health Check', () => {
    test('GET /health should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Quiz API is running'
      });
    });
  });

  describe('Quiz Management', () => {
    describe('POST /api/quizzes', () => {
      test('should create a new quiz successfully', async () => {
        const quizData = {
          title: 'JavaScript Basics'
        };

        const response = await request(app)
          .post('/api/quizzes')
          .send(quizData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject({
          id: 1,
          title: 'JavaScript Basics'
        });
        expect(response.body.data.createdAt).toBeDefined();
      });

      test('should return 400 for missing title', async () => {
        const response = await request(app)
          .post('/api/quizzes')
          .send({})
          .expect(400);

        expect(response.body.error).toBe('Validation Error');
        expect(response.body.details.body).toContain('"title" is required');
      });

      test('should return 400 for empty title', async () => {
        const response = await request(app)
          .post('/api/quizzes')
          .send({ title: '' })
          .expect(400);

        expect(response.body.error).toBe('Validation Error');
      });

      test('should return 400 for title exceeding 200 characters', async () => {
        const longTitle = 'a'.repeat(201);
        const response = await request(app)
          .post('/api/quizzes')
          .send({ title: longTitle })
          .expect(400);

        expect(response.body.error).toBe('Validation Error');
      });
    });

    describe('GET /api/quizzes', () => {
      test('should return empty array when no quizzes exist', async () => {
        const response = await request(app)
          .get('/api/quizzes')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
      });

      test('should return all quizzes', async () => {
        // Create test quizzes
        await request(app)
          .post('/api/quizzes')
          .send({ title: 'Quiz 1' });
        
        await request(app)
          .post('/api/quizzes')
          .send({ title: 'Quiz 2' });

        const response = await request(app)
          .get('/api/quizzes')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0]).toMatchObject({
          id: 1,
          title: 'Quiz 1',
          questionCount: 0
        });
        expect(response.body.data[1]).toMatchObject({
          id: 2,
          title: 'Quiz 2',
          questionCount: 0
        });
      });
    });

    describe('POST /api/quizzes/:id/questions', () => {
      let quizId;

      beforeEach(async () => {
        const quizResponse = await request(app)
          .post('/api/quizzes')
          .send({ title: 'Test Quiz' });
        quizId = quizResponse.body.data.id;
      });

      test('should add single-choice question successfully', async () => {
        const questionData = {
          text: 'What is 2 + 2?',
          type: 'single-choice',
          options: [
            { id: 'a', text: '3' },
            { id: 'b', text: '4' },
            { id: 'c', text: '5' }
          ],
          correctAnswers: ['b']
        };

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/questions`)
          .send(questionData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject({
          id: 1,
          quizId: quizId,
          text: 'What is 2 + 2?',
          type: 'single-choice',
          options: questionData.options
        });
      });

      test('should add multiple-choice question successfully', async () => {
        const questionData = {
          text: 'Which are programming languages?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'JavaScript' },
            { id: 'b', text: 'Python' },
            { id: 'c', text: 'HTML' },
            { id: 'd', text: 'Java' }
          ],
          correctAnswers: ['a', 'b', 'd']
        };

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/questions`)
          .send(questionData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.type).toBe('multiple-choice');
        expect(response.body.data.options).toEqual(questionData.options);
      });

      test('should add text question successfully', async () => {
        const questionData = {
          text: 'Explain the concept of closures in JavaScript',
          type: 'text',
          correctAnswers: ['A closure is a function that has access to variables in its outer scope'],
          wordLimit: 200
        };

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/questions`)
          .send(questionData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.type).toBe('text');
        expect(response.body.data.wordLimit).toBe(200);
      });

      test('should return 400 for single-choice with multiple correct answers', async () => {
        const questionData = {
          text: 'What is 2 + 2?',
          type: 'single-choice',
          options: [
            { id: 'a', text: '3' },
            { id: 'b', text: '4' }
          ],
          correctAnswers: ['a', 'b'] // Multiple answers for single-choice
        };

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/questions`)
          .send(questionData)
          .expect(400); // Should trigger validation error
        
        expect(response.body.error).toBe('Validation Error');
      });

      test('should return 400 for text question with word limit > 300', async () => {
        const questionData = {
          text: 'Explain something',
          type: 'text',
          correctAnswers: ['Answer'],
          wordLimit: 301
        };

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/questions`)
          .send(questionData)
          .expect(400);

        expect(response.body.error).toBe('Validation Error');
      });

      test('should return 404 for non-existent quiz', async () => {
        const questionData = {
          text: 'Test question',
          type: 'single-choice',
          options: [{ id: 'a', text: 'Option 1' }, { id: 'b', text: 'Option 2' }],
          correctAnswers: ['a']
        };

        const response = await request(app)
          .post('/api/quizzes/999/questions')
          .send(questionData)
          .expect(404);

        expect(response.body.error).toBe('Quiz not found');
      });
    });
  });

  describe('Quiz Taking', () => {
    let quizId;

    beforeEach(async () => {
      // Create a quiz with questions
      const quizResponse = await request(app)
        .post('/api/quizzes')
        .send({ title: 'Test Quiz' });
      quizId = quizResponse.body.data.id;

      // Add questions
      await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'What is 2 + 2?',
          type: 'single-choice',
          options: [
            { id: 'a', text: '3' },
            { id: 'b', text: '4' },
            { id: 'c', text: '5' }
          ],
          correctAnswers: ['b']
        });

      await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'Which are fruits?',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Apple' },
            { id: 'b', text: 'Car' },
            { id: 'c', text: 'Orange' },
            { id: 'd', text: 'Banana' }
          ],
          correctAnswers: ['a', 'c', 'd']
        });

      await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'What is the capital of France?',
          type: 'text',
          correctAnswers: ['Paris', 'paris'],
          wordLimit: 50
        });
    });

    describe('GET /api/quizzes/:id/questions', () => {
      test('should return questions without correct answers', async () => {
        const response = await request(app)
          .get(`/api/quizzes/${quizId}/questions`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(3);
        
        // Check that correct answers are not included
        response.body.data.forEach(question => {
          expect(question.correctAnswers).toBeUndefined();
          expect(question.id).toBeDefined();
          expect(question.text).toBeDefined();
          expect(question.type).toBeDefined();
        });
      });

      test('should return 404 for non-existent quiz', async () => {
        const response = await request(app)
          .get('/api/quizzes/999/questions')
          .expect(404);

        expect(response.body.error).toBe('Quiz not found');
      });
    });

    describe('POST /api/quizzes/:id/submit', () => {
      test('should calculate score correctly for all correct answers', async () => {
        const answers = [
          { questionId: 1, answer: 'b' },
          { questionId: 2, answer: ['a', 'c', 'd'] },
          { questionId: 3, answer: 'Paris' }
        ];

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/submit`)
          .send({ answers })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.score).toBe(3);
        expect(response.body.data.total).toBe(3);
        expect(response.body.data.percentage).toBe(100);
        expect(response.body.data.passed).toBe(true);
      });

      test('should calculate score correctly for mixed answers', async () => {
        const answers = [
          { questionId: 1, answer: 'a' }, // Wrong
          { questionId: 2, answer: ['a', 'c', 'd'] }, // Correct
          { questionId: 3, answer: 'London' } // Wrong
        ];

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/submit`)
          .send({ answers })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.score).toBe(1);
        expect(response.body.data.total).toBe(3);
        expect(response.body.data.percentage).toBe(33);
        expect(response.body.data.passed).toBe(false);
        expect(response.body.data.results).toHaveLength(3);
      });

      test('should handle case-insensitive text answers', async () => {
        const answers = [
          { questionId: 1, answer: 'b' },
          { questionId: 2, answer: ['a', 'c', 'd'] },
          { questionId: 3, answer: 'PARIS' } // Different case
        ];

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/submit`)
          .send({ answers })
          .expect(200);

        expect(response.body.data.score).toBe(3);
        expect(response.body.data.results[2].correct).toBe(true);
      });

      test('should return 400 for invalid answer format', async () => {
        const answers = [
          { questionId: 1 } // Missing answer
        ];

        const response = await request(app)
          .post(`/api/quizzes/${quizId}/submit`)
          .send({ answers })
          .expect(400);

        expect(response.body.error).toBe('Validation Error');
      });

      test('should return 404 for non-existent quiz', async () => {
        const answers = [
          { questionId: 1, answer: 'b' }
        ];

        const response = await request(app)
          .post('/api/quizzes/999/submit')
          .send({ answers })
          .expect(404);

        expect(response.body.error).toBe('Quiz not found');
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle partial multiple-choice answers correctly', async () => {
      // Create quiz
      const quizResponse = await request(app)
        .post('/api/quizzes')
        .send({ title: 'Edge Case Quiz' });
      const quizId = quizResponse.body.data.id;

      // Add multiple-choice question
      await request(app)
        .post(`/api/quizzes/${quizId}/questions`)
        .send({
          text: 'Select all even numbers',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '1' },
            { id: 'b', text: '2' },
            { id: 'c', text: '3' },
            { id: 'd', text: '4' }
          ],
          correctAnswers: ['b', 'd']
        });

      // Submit partial answer
      const answers = [
        { questionId: 1, answer: ['b'] } // Only one correct answer out of two
      ];

      const response = await request(app)
        .post(`/api/quizzes/${quizId}/submit`)
        .send({ answers })
        .expect(200);

      expect(response.body.data.score).toBe(0); // Should be incorrect for partial answers
      expect(response.body.data.results[0].correct).toBe(false);
    });
  });
});
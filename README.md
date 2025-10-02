# Quiz Application API

A RESTful backend API for an online quiz application built with Node.js and Express.js. This API supports quiz creation, question management, quiz taking, and automatic scoring with comprehensive validation.

## 🚀 Features

### Core Features
- **Quiz Management**: Create quizzes with titles and manage quiz metadata
- **Question Management**: Add different types of questions to quizzes
- **Quiz Taking**: Fetch questions (without answers) for quiz participants
- **Answer Submission**: Submit answers and receive automated scoring
- **Question Types Support**:
  - Single-choice questions (one correct answer)
  - Multiple-choice questions (multiple correct answers)
  - Text-based questions with word limits (max 300 characters)

### Bonus Features ✨
- **Comprehensive Validation**: Input validation with detailed error messages
- **Quiz Listing**: Endpoint to retrieve all available quizzes
- **Test Coverage**: Extensive unit test suite for all functionality
- **Scoring Analytics**: Detailed scoring with percentage and pass/fail status
- **Case-insensitive Text Matching**: Flexible text answer validation

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Security**: Helmet.js
- **CORS**: Enabled for cross-origin requests
- **Data Storage**: In-memory (easily replaceable with database)

## 📁 Project Structure

```
quiz-api/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── controllers/           # Request handlers
│   │   └── quizController.js
│   ├── models/                # Data models and business logic
│   │   ├── Quiz.js
│   │   ├── Question.js
│   │   └── DataStore.js
│   ├── routes/                # API routes definition
│   │   └── quizRoutes.js
│   ├── services/              # Business logic layer
│   │   └── quizService.js
│   └── validators/            # Input validation schemas
│       ├── quizValidation.js
│       └── validate.js
├── tests/                     # Test suites
│   └── quiz.test.js
├── server.js                  # Application entry point
├── package.json              # Project configuration
└── README.md                 # Documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-reload)
   npm run dev
   ```

4. **Verify installation**
   The server will start on port 3000. Visit http://localhost:3000/health to confirm it's running.

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Health Check
- **GET** `/health`
- **Description**: Check if the API is running
- **Response**: 
  ```json
  {
    "status": "OK",
    "message": "Quiz API is running"
  }
  ```

#### 2. Create Quiz
- **POST** `/api/quizzes`
- **Description**: Create a new quiz
- **Request Body**:
  ```json
  {
    "title": "JavaScript Fundamentals"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Quiz created successfully",
    "data": {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "createdAt": "2025-10-02T10:30:00.000Z"
    }
  }
  ```

#### 3. Get All Quizzes
- **GET** `/api/quizzes`
- **Description**: Retrieve all available quizzes
- **Response**:
  ```json
  {
    "success": true,
    "message": "Quizzes retrieved successfully",
    "data": [
      {
        "id": 1,
        "title": "JavaScript Fundamentals",
        "createdAt": "2025-10-02T10:30:00.000Z",
        "questionCount": 5
      }
    ]
  }
  ```

#### 4. Add Question to Quiz
- **POST** `/api/quizzes/:id/questions`
- **Description**: Add a question to an existing quiz
- **Request Body Examples**:

  **Single-choice question:**
  ```json
  {
    "text": "What is the capital of France?",
    "type": "single-choice",
    "options": [
      {"id": "a", "text": "London"},
      {"id": "b", "text": "Paris"},
      {"id": "c", "text": "Berlin"}
    ],
    "correctAnswers": ["b"]
  }
  ```

  **Multiple-choice question:**
  ```json
  {
    "text": "Which are programming languages?",
    "type": "multiple-choice",
    "options": [
      {"id": "a", "text": "JavaScript"},
      {"id": "b", "text": "Python"},
      {"id": "c", "text": "HTML"},
      {"id": "d", "text": "Java"}
    ],
    "correctAnswers": ["a", "b", "d"]
  }
  ```

  **Text question:**
  ```json
  {
    "text": "Explain what a closure is in JavaScript",
    "type": "text",
    "correctAnswers": ["A closure is a function that has access to variables in its outer scope"],
    "wordLimit": 200
  }
  ```

#### 5. Get Quiz Questions (for taking)
- **GET** `/api/quizzes/:id/questions`
- **Description**: Get questions for a quiz without correct answers
- **Response**:
  ```json
  {
    "success": true,
    "message": "Questions retrieved successfully",
    "data": [
      {
        "id": 1,
        "text": "What is the capital of France?",
        "type": "single-choice",
        "options": [
          {"id": "a", "text": "London"},
          {"id": "b", "text": "Paris"},
          {"id": "c", "text": "Berlin"}
        ]
      }
    ]
  }
  ```

#### 6. Submit Quiz Answers
- **POST** `/api/quizzes/:id/submit`
- **Description**: Submit answers and get score
- **Request Body**:
  ```json
  {
    "answers": [
      {"questionId": 1, "answer": "b"},
      {"questionId": 2, "answer": ["a", "b", "d"]},
      {"questionId": 3, "answer": "A closure provides access to outer scope"}
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Quiz submitted successfully",
    "data": {
      "score": 2,
      "total": 3,
      "percentage": 67,
      "passed": true,
      "results": [
        {
          "questionId": 1,
          "correct": true,
          "userAnswer": "b",
          "correctAnswer": ["b"]
        }
      ]
    }
  }
  ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

### Test Coverage
The test suite includes:
- **21 comprehensive test cases** covering all endpoints
- **Edge case handling** (partial answers, case sensitivity)
- **Validation testing** (input validation, error scenarios)
- **Integration testing** (full request-response cycle)
- **83%+ code coverage** across all modules

### Test Categories
- Health check endpoint
- Quiz creation and management
- Question addition with validation
- Quiz taking functionality
- Answer submission and scoring
- Error handling and edge cases

## 🔧 Design Decisions & Architecture

### 1. **Layered Architecture**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and data manipulation  
- **Models**: Data structures and validation rules
- **Validators**: Input validation using Joi schemas

### 2. **Data Storage**
- **In-memory storage** for simplicity and fast development
- **Easily replaceable** with database integration (PostgreSQL, MongoDB, etc.)
- **Singleton pattern** for data store management

### 3. **Question Types**
- **Single-choice**: One correct answer, radio button UI
- **Multiple-choice**: Multiple correct answers, checkbox UI
- **Text**: Free-form text with word limits and case-insensitive matching

### 4. **Validation Strategy**
- **Schema-based validation** using Joi for consistent rules
- **Model-level validation** for business logic constraints
- **Comprehensive error messages** for better developer experience

### 5. **Scoring System**
- **All-or-nothing** for multiple-choice questions
- **Case-insensitive** text matching with multiple acceptable answers
- **Percentage-based** scoring with pass/fail threshold (60%)

### 6. **Security & Best Practices**
- **Helmet.js** for security headers
- **CORS** enabled for cross-origin requests
- **Input sanitization** and validation
- **Error handling** middleware with environment-aware responses
- **RESTful API design** following standard conventions

## 🔮 Future Enhancements

### Database Integration
- Replace in-memory storage with PostgreSQL/MongoDB
- Add data persistence and migration support
- Implement connection pooling and query optimization

### Advanced Features
- User authentication and authorization
- Quiz categories and tags
- Time-limited quizzes
- Question randomization
- Detailed analytics and reporting
- File upload for questions (images, audio)

### Performance & Scalability
- Add caching layer (Redis)
- Implement rate limiting
- Add API versioning
- Database indexing and query optimization
- Horizontal scaling support

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created successfully
- **400**: Bad request / Validation error
- **404**: Resource not found
- **500**: Internal server error

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ for the coding challenge**
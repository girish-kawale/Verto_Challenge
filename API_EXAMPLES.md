# API Usage Examples

This file contains example API calls you can use to test the Quiz API.

## Prerequisites
Make sure the server is running on http://localhost:3000

## Example API Calls (using curl)

### 1. Health Check
```bash
curl -X GET http://localhost:3000/health
```

### 2. Create a Quiz
```bash
curl -X POST http://localhost:3000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{"title": "JavaScript Fundamentals Quiz"}'
```

### 3. Add Single-Choice Question
```bash
curl -X POST http://localhost:3000/api/quizzes/1/questions \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is the correct syntax for creating a function in JavaScript?",
    "type": "single-choice",
    "options": [
      {"id": "a", "text": "function myFunction() {}"},
      {"id": "b", "text": "def myFunction() {}"},
      {"id": "c", "text": "func myFunction() {}"}
    ],
    "correctAnswers": ["a"]
  }'
```

### 4. Add Multiple-Choice Question
```bash
curl -X POST http://localhost:3000/api/quizzes/1/questions \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Which of the following are JavaScript data types?",
    "type": "multiple-choice",
    "options": [
      {"id": "a", "text": "String"},
      {"id": "b", "text": "Number"},
      {"id": "c", "text": "Boolean"},
      {"id": "d", "text": "Character"}
    ],
    "correctAnswers": ["a", "b", "c"]
  }'
```

### 5. Add Text Question
```bash
curl -X POST http://localhost:3000/api/quizzes/1/questions \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Explain what hoisting means in JavaScript",
    "type": "text",
    "correctAnswers": ["Hoisting is JavaScript default behavior of moving declarations to the top"],
    "wordLimit": 100
  }'
```

### 6. Get All Quizzes
```bash
curl -X GET http://localhost:3000/api/quizzes
```

### 7. Get Quiz Questions (for taking)
```bash
curl -X GET http://localhost:3000/api/quizzes/1/questions
```

### 8. Submit Quiz Answers
```bash
curl -X POST http://localhost:3000/api/quizzes/1/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": 1, "answer": "a"},
      {"questionId": 2, "answer": ["a", "b", "c"]},
      {"questionId": 3, "answer": "Hoisting moves declarations to the top"}
    ]
  }'
```

## Expected Workflow

1. **Create a quiz** using POST /api/quizzes
2. **Add questions** to the quiz using POST /api/quizzes/:id/questions
3. **Get quiz questions** for participants using GET /api/quizzes/:id/questions
4. **Submit answers** and get scores using POST /api/quizzes/:id/submit

## Testing Different Scenarios

### Validation Errors
```bash
# Missing title
curl -X POST http://localhost:3000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{}'

# Invalid question type
curl -X POST http://localhost:3000/api/quizzes/1/questions \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test question",
    "type": "invalid-type",
    "options": [{"id": "a", "text": "Option 1"}],
    "correctAnswers": ["a"]
  }'
```

### 404 Errors
```bash
# Non-existent quiz
curl -X GET http://localhost:3000/api/quizzes/999/questions
```
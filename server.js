const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Quiz API server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
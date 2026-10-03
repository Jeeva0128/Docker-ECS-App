const app = require('./app');
const config = require('./config');
const connectDB = require('./config/database');
const mongoose = require('mongoose');

// Handle uncaught exceptions globally
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Start Server Wrapper
const startServer = async () => {
  // 1. Connect to database
  await connectDB();

  // 2. Start server
  const server = app.listen(config.PORT, '0.0.0.0', () => {
    // 3. Log running mode
    console.log(`TaskFlow API running on port ${config.PORT} in ${config.NODE_ENV} mode`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    server.close(() => {
      process.exit(1);
    });
  });

  // 4. Graceful shutdown
  const shutdown = () => {
    console.log('Received termination signal. Closing HTTP server...');
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error during database disconnection:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();

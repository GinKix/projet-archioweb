// Load environment variables from the .env file.
try {
    require('dotenv').config();
  } catch (err) {
    console.log('No .env file loaded');
  }

// Database connection
exports.databaseUrl = process.env.DATABASE_URL || 'mongodb://projet-archioweb.herokuapp.com';

exports.port = process.env.PORT || '3000';

exports.bcryptCostFactor = 10;

// JWT signing Key
exports.secretKey = process.env.SECRET_KEY || 'changeme';

// Validate that port is a positive integer.
if (process.env.PORT) {
    const parsedPort = parseInt(process.env.PORT, 10);
    if (!Number.isInteger(parsedPort)) {
      throw new Error('Environment variable $PORT must be an integer');
    } else if (parsedPort < 1 || parsedPort > 65535) {
      throw new Error('Environment variable $PORT must be a valid port number');
    }
  }
/* // Validate that some environment variable is set.
if (!process.env.MY_APP_FOO) {
  throw new Error('Environment variable $MY_APP_FOO must be set');
} */
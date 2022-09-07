const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { connectDB } = require('./config/db');
const app = express();
const HttpError = require('./utils/httpError');
const errorHandler = require('./middlewares/error');

// #region ~ CORS ~

app.use(cors());
// OR
app.use((req, res, next) => {
  // Set the origin * to allow all domains or make it limited
  res.setHeader('Access-Control-Allow-Origin', '*');
  // The headers which you use from front-end
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Contrnt-Type,Accept',
    'Authorization'
  );
  // Methods you use to contact with Backend
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next();
});
//#endregion

// Body Parser
app.use(express.json());

// Set secuity headers
app.use(helmet());

// Sanitize data
app.use(mongoSanitize());

//#region ~ ENV CONFIG ~
// require('dotenv').config({ path: './config/.env' });
//#endregion

connectDB();

//#region ~ Routes ~

app.use('/api/v1/auth', require('./routes/auth-routes'));
app.use('/api/v1/slider', require('./routes/slider-routes'));

//#endregion

//#region ~ 404 - NO PAGE/ROUTE FOUND ~

app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});

//#endregion

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`server is running at PORT ${PORT}`);
});

// Handle unhandeled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`);
  // Close sever & exit process
  server.close(() => process.exit(1));
});

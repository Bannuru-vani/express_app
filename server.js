const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { connectDB } = require('./config/db');
const app = express();
const HttpError = require('./utils/httpError');
const errorHandler = require('./middlewares/error');
const { createServer } = require('http');
const http = require('http').Server(app);
const socketIO = require('socket.io')(http);
//socket
// const { Server } = require('socket.io');
// #region ~ CORS ~

app.use(cors());
// OR
app.use((req, res, next) => {
  // Set the origin * to allow all domains or make it limited
  res.setHeader('Access-Control-Allow-Origin', '*');
  // The headers which you use from front-end
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Contrnt-Type ,Accept',
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

// socketIO.on('connection', socket => {
//   //connected to correct id
//   console.log('connected');
//   socket.on('setup', userData => {
//     socket.join(userData._id);

//     socket.emit('connected');
//   });

//   socket.on('join-chat', room => {
//     socket.join(room);
//   });

//   socket.on('typing', room => socket.in(room).emit('typing'));
//   socket.on('stop-typing', room => socket.in(room).emit('stop-typing'));

//   socket.on('new-message', newMessageReceived => {
//     let chat = newMessageReceived.chat;

//     if (!chat.users) return console.log(`chat.users not defined`);

//     chat.users.forEach(user => {
//       if (user._id === newMessageReceived.sender._id) return;

//       socket.in(user._id).emit('message-received', newMessageReceived);
//     });
//   });

//   socket.off('setup', () => {
//     socket.leave(userData._id);
//   });
// });

app.use('/api/v1/auth', require('./routes/auth-routes'));
app.use('/api/v1/slider', require('./routes/slider-routes'));
app.use('/api/v1/product', require('./routes/product-routes'));
app.use('/api/v1/cart', require('./routes/cart-routes'));
// app.use('/api/v1/chat', require('./routes/chat-routes'));
// app.use('/api/v1/message', require('./routes/message-routes'));
//#endregion

//#region ~ 404 - NO PAGE/ROUTE FOUND ~

app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});

//#endregion

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = createServer(app);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(PORT, () =>
      console.log(`Server Running on port : ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: '*',
//   },
// });

// Handle unhandeled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`);
  // Close sever & exit process
  server.close(() => process.exit(1));
});

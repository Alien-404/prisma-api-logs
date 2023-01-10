const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cron = require('node-cron');

// import
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// init express
const app = express();

// miscellaneous
const BASE_URL = `http://localhost:${process.env.PORT || 8080}`;

// variable

// middleware
app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  await prisma.api_logs.create({
    data: {
      path: req.path,
      method: req.method,
    },
  });

  console.log(req.path, req.method);
  next();
});

// cron
cron.schedule('*/10 * * * *', async () => {
  await prisma.api_logs.deleteMany({});
  console.log('logs cleared');
});

// root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'this is auto delete logs api with corn',
    status: 200,
  });
});

// check status
app.get('/status', (req, res) => {
  res.status(200).json({
    message: 'server is healty',
    status: 200,
  });
});

// show logs data
app.get('/logs', async (req, res) => {
  const logs = await prisma.api_logs.findMany();
  res.status(200).json({
    message: 'ok',
    total: logs.length,
    data: logs,
  });
});

// listen app
app.listen(
  process.env.PORT || 8080,
  process.env.HOSTNAME || 'localhost',
  (req, res) => {
    console.log(`Server running ${BASE_URL} - success`);
  }
);

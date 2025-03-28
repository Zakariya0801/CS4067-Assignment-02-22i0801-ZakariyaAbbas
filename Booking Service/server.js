const express = require('express')
require('dotenv').config();
const connectDB = require('./Services/dbConfig');
const app = express()
const http = require('http');
const port = process.env.PORT || 3000
const bookingRoutes = require('./routes/bookingRoutes');
const cors = require('cors')

const server = http.createServer(app);
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/bookings', bookingRoutes); 

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
start();
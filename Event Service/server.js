const express = require('express')
require('dotenv').config();
const connectDB = require('./Services/dbConfig');
const eventRoutes = require('./routes/EventRoutes');
const app = express()
const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer(app);
app.use(express.json());
app.use('/api/events', eventRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

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
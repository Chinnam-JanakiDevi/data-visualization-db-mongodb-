require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const Insight = require('./models/insight');
const cors=require("cors");
const app=express();
const path = require("path"); 
const bodyParser=require("body-parser");
const Router = express.Router(); 

const PORT = process.env.PORT || 3000
//mongodb+srv://chinnamjanakidevi123:<password>@cluster0.zkix1hk.mongodb.net/
mongoose.set('strictQuery', false);
MONGO_URI="mongodb+srv://chinnamjanakidevi123:bNnaW8MhXAwtlnAe@cluster0.zkix1hk.mongodb.net/test"
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

//Routes go here
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));  // Updated path
});


app.get('/api/insights', async (req, res) => {
    try {
      const insights = await Insight.find();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);    })
})

const express=require("express");
const cors=require("cors");
const app=express();
const path = require("path"); 
const bodyParser=require("body-parser");
const Router = express.Router();
const loginmodel = require('./get');  //filepath mentioned
const mongoose = require('mongoose');
const Insight = require('./models/insight');

const PORT=5000;
const url = 'mongodb://127.0.0.1:27017/sample';    //bNnaW8MhXAwtlnAe
//mongodb+srv://chinnamjanakidevi123:<password>@cluster0.zkix1hk.mongodb.net/
//-------------------------connection code----------------------------------
mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});
db.once('open', () => {
  console.log('Connected successfully to MongoDB');
});
//-------------------------end---------------------------------------------




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




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




  

const mongoose = require('mongoose');

const login_cred = new mongoose.Schema({
  username: String,
  email: String,
  
});

const login = mongoose.model('login', login_cred);

module.exports = login;
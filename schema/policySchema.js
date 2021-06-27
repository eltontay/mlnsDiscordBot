const mongoose = require('./mongoLogin');

const policySchema = new mongoose.Schema({
  policyid: String,
  imageurl: String,
  date: { type: Date, default: Date.now },
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;

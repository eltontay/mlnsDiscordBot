require('dotenv').config();
const Policy = require('../schema/policySchema');

module.exports = {
  // Define the prefix
  prefix: '!search',
  // Define a function to pass the message to
  fn: (msg) => {
    let application = {};
    let filter = (msg) => !msg.author.bot;
    let options = {
      max: 1,
      time: 15000,
    };
    msg.channel
      .send('Welcome to MLNS Policy Bot! What is the policy id of the NFT?')
      .then((collected) => {
        // After each question, we'll setup a collector on the DM channel
        return collected.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        // Convert the collection to an array & get the content from the first element
        application.policyid = collected.array()[0].content;
        console.log(application);
        Policy.findOne(
          application,
          'policyid imageurl',
          function (err, policy) {
            if (err) return handleError(err);
            return msg.channel.send(
              'The policy id : ' +
                policy.policyid +
                ' is in the system! \n The respective image url is : ' +
                policy.imageurl
            );
          }
        );
      })
      .catch((err) => {
        console.error('Something went wrong', err);
        if (err === 'timeout_format_error') {
          msg.channel.send("That doesn't seem to be a valid number...");
        } else {
          msg.channel.send('Sorry! Something went wrong...');
        }
      });
  },
};

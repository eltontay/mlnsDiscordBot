require('dotenv').config();
const Policy = require('../schema/policySchema');

module.exports = {
  // Define the prefix
  prefix: '!insert',
  // Define a function to pass the message to
  fn: (msg) => {
    let application = {};
    let filter = (msg) => !msg.author.bot;
    let options = {
      max: 1,
      time: 15000,
    };
    msg.channel
      .send(
        'Welcome to MLNS Policy Bot! What is the policy id of the NFT that you want to insert?'
      )
      .then((collected) => {
        // After each question, we'll setup a collector on the DM channel
        return collected.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        // Convert the collection to an array & get the content from the first element
        application.policyid = collected.array()[0].content;
        console.log(application);
        // Ask the next question
        return msg.channel.send(
          "Got it! What is the NFT's respective url? You can find it in Pool.pm by clicking onto the NFT :)"
        );
      })
      .then((collected) => {
        return collected.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        application.imageurl = collected.array()[0].content;
        console.log(application);
        const policyDoc = new Policy(application);
        policyDoc.save(function (err) {
          console.log(err);
        });

        return msg.channel.send(
          'Awesome! Policy id : ' +
            application.policyid +
            ' with image url : ' +
            application.imageurl +
            ' is saved successfully!'
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

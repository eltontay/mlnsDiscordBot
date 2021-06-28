require('dotenv').config();
const Policy = require('../schema/policySchema');

module.exports = {
  // Define the prefix
  prefix: '!delete',
  // Define a function to pass the message to
  fn: (msg) => {
    let application = {};
    let answer = {};
    let filter = (msg) => !msg.author.bot;
    let options = {
      max: 1,
      time: 15000,
    };
    msg.channel
      .send(
        'Welcome to MLNS Policy Bot! What is the policy id of the NFT that you want to delete?'
      )
      .then((collected) => {
        // After each question, we'll setup a collector on the DM channel
        return collected.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        // Convert the collection to an array & get the content from the first element
        const check = true;
        application.policyid = collected.array()[0].content;
        console.log(application);
        async function find() {
          await Policy.findOne(
            application,
            'policyid imageurl',
            function (err, policy) {
              if (err) return handleError(err);
              if (policy === null) {
                check = false;
                return msg.channel.send(
                  'The policy id : ' +
                    application.policyid +
                    ' is not in the system!'
                );
              }
              return msg.channel.send(
                'The policy id : ' +
                  policy.policyid +
                  ' is in the system! \n The respective image url is : ' +
                  policy.imageurl
              );
            }
          );
          return check;
        }
        find().then((check) => {
          if (check === true) {
            Policy.findOneAndDelete(application, function (err, done) {
              if (err) return HandleError(err);
              console.log(done);
            });
            return msg.channel.send(
              'The policy id : ' +
                application.policyid +
                ' has been successfully deleted!'
            );
          }
        });
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

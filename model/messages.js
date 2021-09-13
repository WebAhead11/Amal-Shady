const moment = require("moment");
function messageFormater(username, msg) {
  return {
    username,
    msg,
    time: moment().format("h:mm a"),
  };
}
module.exports = messageFormater;

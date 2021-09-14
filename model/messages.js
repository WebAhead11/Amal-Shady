const moment = require("moment");
function messageFormater(username, msg) {
  return {
    username,
    msg,
    time: moment().format(" h:mm:ss a"),
  };
}
module.exports = messageFormater;

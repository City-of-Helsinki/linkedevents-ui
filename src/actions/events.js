const constants = require('../constants');

function getEvents(q) {
  return {
    type: constants.GET_EVENTS,
    query: q
  };
}

module.exports = { increase, decrease };

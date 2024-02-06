const authResolver = require("./auth.resolver");
const eventsResolver = require("./events.resolvers");
const bookingResolver = require("./booking.resolvers");

const rootResolver = {
  ...eventsResolver,
  ...bookingResolver,
  ...authResolver,
};

module.exports = rootResolver;

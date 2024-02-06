const Event = require("../../models/events");
const User = require("../../models/user");
const { dateToString } = require("../helpers/date");
const { userLoader } = require("./merge.helper");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find({});

      // const creators = await Promise.all(events.map(async(item) => {
      //         const user= await userLoader.load(item._doc.creator);
      //         return user._doc
      // }))

      // Extract unique creator IDs
      const creatorIds = [...new Set(events.map((item) => item._doc.creator))];

      // Load users using loadMany
      const users = await userLoader.loadMany(creatorIds);

      // Now, map the users to their respective documents
      const creators = users.map((user) => user._doc);

      const allEvents = creators.map((creator, i) => {
        return {
          ...events[i]._doc,
          date: dateToString(events[i]._doc.date),
          creator: creator,
        };
      });

      return allEvents;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createEvent: (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: args.eventInput.date || new Date().toISOString(),
      creator: req.userId,
    });
    let createdEvent;
    return event
      .save()
      .then((res) => {
        createdEvent = {
          ...res._doc,
          date: new Date(res._doc.date).toISOString(),
        };
        return User.findById(req.userId);
      })
      .then((user) => {
        if (!user) throw new Error("No user exists");
        user.createdEvents.push(event);
        return user.save();
      })
      .then((user) => {
        return { ...createdEvent, creator: user };
      })
      .catch((er) => {
        console.log(er);
        throw er;
      });
  },
};

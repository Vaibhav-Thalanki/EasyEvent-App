const Booking = require("../../models/booking");
const { dateToString } = require("../helpers/date");
const { eventLoader, userLoader } = require("./merge.helper");

module.exports = {
  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Not Authenticated!");
      }
      const bookings = await Booking.find({ user: req.userId });
  

      // return await Promise.all(bookings.map(async booking=>{
      //     const user = await userLoader.load(booking.user)
      //     const event = await eventLoader.load(booking.event)

      //     return {...booking._doc, createdAt: dateToString(booking._doc.createdAt),updatedAt: dateToString(booking._doc.updatedAt),user:user._doc, event: {...event._doc,date:dateToString(event._doc.date)}}
      // }))

      // Extract unique user IDs and event IDs

      const eventIds = [...new Set(bookings.map((booking) => booking.event))];
      

      // Load events using loadMany
      const allEvents = await eventLoader.loadMany(eventIds);
      
      const user = await userLoader.load(req.userId);
    

      // Map through bookings to format data
      const formattedBookings = bookings.map((booking) => {
       
        const event = allEvents.find((event) => {
          return JSON.stringify(event._doc._id) === JSON.stringify(booking.event);
        });
        
        //console.log(event);

        return {
          ...booking._doc,
          createdAt: dateToString(booking._doc.createdAt),
          updatedAt: dateToString(booking._doc.updatedAt),
          user: user._doc,
          event: {
            ...event._doc,
            date: dateToString(event._doc.date),
          },
        };
      });

      return formattedBookings;
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Not Authenticated!");
      }

      const booking = new Booking({
        user: req.userId,
        event: args.eventId,
      });

      const result = await booking.save();

      const user = await userLoader.load(result._doc.user);

      const event = await eventLoader.load(result._doc.event);

      return {
        ...result._doc,
        createdAt: dateToString(result._doc.createdAt),
        updatedAt: dateToString(result._doc.updatedAt),
        user: user._doc,
        event: event._doc,
      };
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Not Authenticated!");
      }
      const booking = await Booking.findById(args.bookingId).populate("event");
      await Booking.deleteOne({ _id: args.bookingId });

      const user = await userLoader.load(booking.user);

      return { ...booking.event._doc, creator: user._doc };
    } catch (err) {
      throw err;
    }
  },
};

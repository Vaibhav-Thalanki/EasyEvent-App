const User = require("../../models/user");
const Event = require("../../models/events");
const DataLoader = require("dataloader");


const singleUser = async(userID) => {
  try{
    const user = await User.findById(userID)
    .populate("createdEvents");

  return {...user}
  }
  catch(error){
    throw error
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    
    const oneUser = await userLoader.load(event.creator)
    return { ...event, creator: oneUser._doc  };
  } catch (err) {
    throw err;
  }
};
const events = async(eventIDs)=>{
  try{
    ;
    const allEvents = await Promise.all(eventIDs.map(async(id)=>await singleEvent(id)))

    return allEvents
  }
  catch(error){
    throw error
  }
}

const users = async(userIds)=>{
  try{
    const allusers = await Promise.all( userIds.map(async(id)=>{
      const oneSingleUser = await singleUser(id)
      return oneSingleUser
    }))
  return allusers
  }
  catch(error){
    throw error
  }
  
}
const eventLoader = new DataLoader(events);
const userLoader = new DataLoader(users);

exports.singleUser = singleUser;
exports.singleEvent = singleEvent;
exports.eventLoader = eventLoader;
exports.userLoader = userLoader;

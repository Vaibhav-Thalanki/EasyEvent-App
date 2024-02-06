import React from "react";
import "./EventList.css";
import EventItem from "./EventItem/EventItem";


const EventList = (props) => {
    
    const events = (props.events).map((item,i)=>{
        return <EventItem key={item._id} eventId={item._id} title={item.title} price={item.price} date={item.date} creatorId={item.creator._id} onDetail={props.onDetail}/>
      })

  return <ul className="event__list">{events}</ul>;
};

export default EventList;

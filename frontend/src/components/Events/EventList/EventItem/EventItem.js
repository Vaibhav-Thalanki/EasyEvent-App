import React from "react";
import "./EventItem.css";
import { useUserContext } from "../../../../context/auth-context";
import { padLeft } from "../../../../utils";

const EventItem = (props) => {
    const authContext = useUserContext()
   
  return (
    <li key={props.eventId} className="event__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>${props.price} - {new Date(props.date).toLocaleDateString()}, {padLeft(new Date(props.date).getHours(),2)}:{padLeft(new Date(props.date).getMinutes(),2)}</h2>
      </div>
      <div>
      {authContext.userId===props.creatorId?
        <p>You're the owner of this event</p>:
        <button className="btn" onClick={()=>{props.onDetail(props.eventId)}}>View Details</button>
      }
      </div>
    </li>
  );
};

export default EventItem;

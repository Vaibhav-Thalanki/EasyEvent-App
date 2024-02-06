import React from "react";
import './BookingList.css'

const BookingList = (props)=>{
    return <ul>
        {props.bookings.map(item=>{
            return <li  className="bookings__item" key={item._id}>
            <div className="bookings__item-data">
            {item.event.title} - {item.user.email}, {new Date(item.event.date).toLocaleDateString()},{new Date(item.createdAt).toLocaleDateString()}
            </div>
            <div className="bookings__item-actions">
                <button className="btn" onClick={()=>{props.onDelete(item._id)}}>Cancel Booking</button>
            </div>
         
          </li>
        })}
        {
            props.bookings.length===0?
            <div className="bookings__container">
                No Bookings Made
            </div>

            :null
        }
    </ul>
}

export default BookingList
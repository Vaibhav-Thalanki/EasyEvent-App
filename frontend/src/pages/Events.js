import React, { useState, useRef, useEffect } from "react";
import "./Events.css";
import { useUserContext } from "../context/auth-context";
import Modal from "../components/Modal/Modal";
import BackDrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import { padLeft } from "../utils";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const navigate = useNavigate();
  const [rendered, setRendered] = useState(false);
  const [modelOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const titleInputRef = useRef();
  const dateInputRef = useRef();
  const priceInputRef = useRef();
  const descriptionInputRef = useRef();
  const authContext = useUserContext();
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleModal = () => {
    setModalOpen(!modelOpen);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };
  const handleBookEventFromModal = () => {
    if(!authContext.token){
      setModalOpen(false)
      setSelectedEvent(null)
      return;
    }
    setLoading(true)
    setSelectedEvent(null);
    const requestBody = {
      variables:{
        eventId : selectedEvent._id
      },
      query: `
            mutation BookEvent($eventId: ID!){
                bookEvent(eventId:$eventId){
                    _id
                    user{
                      email
                    }
                    createdAt
                    updatedAt
                    event{
                      title
                    }
                 
                }
            }`,
    };
  

  fetch("https://easy-event-app.vercel.app/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authContext.token}`,
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      return res.json();
    })
    .then((resData) => {
      setLoading(false);
      setSelectedEvent(null);
      setModalOpen(false)
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      setSelectedEvent(null);
      setModalOpen(false)
    });

  };
  const handleConfirmButton = () => {
    setLoading(true);
    setModalOpen(false);
    setSelectedEvent(null);

    const title = titleInputRef.current.value;
    const price = +priceInputRef.current.value;
    const date = dateInputRef.current.value;
    const description = descriptionInputRef.current.value;
    if (
      title.trim().length === 0 ||
      price < 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    let requestBody;
    if (date) {
      requestBody = {
        variables:{
          description,
          title, price, date
        },
        query: `
              mutation  CreateEvent($title: String!, $description: String!, $price: Float!, $date: String){
                  createEvent(eventInput:{title:$title, description:$description,price:$price,date:$date}){
                      title
                      description
                      _id
                      price
                      date
                   
                  }
              }`,
      };
    } else {
      requestBody = {
        variables:{
          description,
          title, price
        },
        query: `
              mutation CreateEvent($title: String!, $description: String!, $price: Float!){
                  createEvent(eventInput:{title:$title, description:$description,price:$price}){
                      title
                      description
                      _id
                      price
                      date
                  }
              }`,
      };
    }

    fetch("https://easy-event-app.vercel.app/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authContext.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        setEvents((prev) => {
          const newEventList = [...prev];
          newEventList.push({
            ...resData.data.createEvent,
            creator: { _id: authContext.userId },
          });
       
          return newEventList;
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const fetchEvents = () => {
    setLoading(true);
    const requestBody = {
      query: `
            query{
                events{
                    title
                    description
                    _id
                    price
                    date
                    creator{
                      _id
                      email
                    }
                }
            }`,
    };

    fetch("https://easy-event-app.vercel.app/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        setEvents(resData.data.events);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (rendered) {
      fetchEvents();
    } else {
      setRendered(true);
    }
  }, [rendered]);

  const onDetail = (eventId) => {
    const chosenEvent = events.find((e) => e._id === eventId);
    setSelectedEvent(chosenEvent);
  };
  const redirectToLogin = () =>{
    navigate('/auth')
  }
  return (
    <>
      {(modelOpen || selectedEvent) && <BackDrop />}
      {modelOpen && (
        <Modal
          title="Add Event"
          actionButton={() => {
            handleConfirmButton();
          }}
          closeModal={() => {
            handleCloseModal();
          }}
          actionButtonText="Confirm"

        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                ref={titleInputRef}
                required
              ></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                ref={priceInputRef}
                required
              ></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateInputRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                rows={4}
                id="description"
                ref={descriptionInputRef}
                required
              />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent ? (
        <Modal
          title={selectedEvent.title}
          actionButton={() => {
            if(authContext.token)
            handleBookEventFromModal();
            else
            redirectToLogin()
          }}
          closeModal={() => {
            handleCloseModal();
          }}
          actionButtonText={authContext.token?"Book Event":"Login to Book"}
        >
          <div className="">
        <h1>{selectedEvent.title}</h1>
        <h2>${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}, {padLeft(new Date(selectedEvent.date).getUTCHours(),2)}:{padLeft(new Date(selectedEvent.date).getMinutes(),2)}</h2>
        <p>{selectedEvent.description}</p>
        
      </div>
        </Modal>
      ) : null}
      {authContext.token ? (
        <div className="events-control">
          <p>Share you own events!</p>
          <button className="btn" onClick={() => handleModal()}>
            Create Event
          </button>
        </div>
      ) : null}
      {loading ? (
        <Spinner />
      ) : (
        <EventList events={events} onDetail={onDetail} />
      )}
    </>
  );
};

export default EventsPage;

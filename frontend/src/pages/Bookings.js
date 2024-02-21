import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";

const BookingsPage = () => {
  const authContext = useUserContext();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [outputType, setOutputType] = useState("list");

  useEffect(() => {
    const fetchBookings = () => {
      setLoading(true);
      const requestBody = {
        query: `
                  query{
                      bookings{
                         _id
                         createdAt
                         updatedAt
                         event{
                          title
                          _id
                          date
                          price
                         }
                         user{
                          email
                          _id
                         }
                      }
                  }`,
      };

      fetch("https://easy-event-app-api.vercel.app/graphql", {
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
          setBookings(resData.data.bookings);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    if (rendered) {
      fetchBookings();
    } else {
      setRendered(true);
    }
  }, [rendered, authContext.token]);

  const onDelete = (bookingId) => {
    setLoading(true);
    const requestBody = {
      variables: {
        id: bookingId,
      },
      query: `
                mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id){
                       _id
                        title
                        date
                    }
                }`,
    };

    fetch("https://easy-event-app-api.vercel.app/graphql", {
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
        setBookings((prev) => {
          return prev.filter((item) => {
            return item._id !== bookingId;
          });
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleOutput = () => {
    if (outputType === "list") {
      return <BookingList bookings={bookings} onDelete={onDelete} />;
    } else if(outputType==="chart") {
      return <BookingsChart bookings={bookings}  />;
    }
  };
  const handleOutputType = (type) => {
    setOutputType(type);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="bookings-control">
            <button
              onClick={() => {
                handleOutputType("list");
              }}
              className={outputType === 'list'? 'active':''}
            >
              List
            </button>
            <button
              onClick={() => {
                handleOutputType("chart");
              }}
              className={outputType === 'chart'? 'active':''}
            >
              Chart
            </button>
          </div>
          {handleOutput()}
        </>
      )}
    </>
  );
};

export default BookingsPage;

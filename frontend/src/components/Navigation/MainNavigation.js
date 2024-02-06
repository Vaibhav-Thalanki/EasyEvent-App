import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import { useUserContext } from "../../context/auth-context";

const MainNavigation = (props) => {
    const authContext=useUserContext()

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {!authContext.token &&  <li>
            <NavLink to="/auth">Authenticate</NavLink>
          </li>}
         {authContext.token && ( <React.Fragment><li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
          <li>
            <button onClick={authContext.logout}>Logout</button>
          </li></React.Fragment>)}
          
        </ul>
      </nav>
    </header>
  );
};
export default MainNavigation;

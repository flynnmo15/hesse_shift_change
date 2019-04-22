// Imports
import React, { Component } from "react";
import { NavLink } from "react-router-dom"; // Needed for NavLink
 
// Contains the Links to navigate the application
// NavLink will allow for rerouting of DOM
class Navigation extends Component {
  render() {
    return (
      <div className="Navigation">
        <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/listings">Listings</NavLink></li>
            <li><NavLink to="/post">Post</NavLink></li>
	    <li><NavLink to="/points">Points</NavLink></li>
        </ul> 
      </div>
    );
  }
}
 
export default Navigation;

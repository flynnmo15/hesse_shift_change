// Imports
import React, { Component } from "react";
import { Route } from "react-router-dom"; // Needed for Route
import { GoogleLogin } from 'react-google-login';
// Component Imports
import PageHeader from "./PageHeader";
import Navigation from "./Navigation";
import Home from "./Home";
import Listings from "./Listings";
import Post from "./Post";
import Shift from "./Shift"; 

// Main Component for App
// Contains the Page Header
// Contains the Navigation Bar
// Contains the Current Component details
class Main extends Component {

  render() {
    return (
      <div className="Main">
        {/* Contains the items for page header
            includes:
              name of person logged in
              logout button
         */}
        <PageHeader 
          name = {this.props.name}
          logout = {this.props.logout}
        />
        {/* Contains the Navigation Bar for page links */}
        <Navigation />

        {/* Contains the Body of the Website, actual page content */}
        <div className="content">
          <Route exact path='/' component={Home} />
          <Route exact path="/listings" component={Listings} />
          <Route exact path="/post" 
		 render={(props) => <Post {...props} googleId={this.props.googleId} />} />
          <Route exact path="/shift/:id"
		 render={(props) => <Shift {...props} googleId={this.props.googleId} />} />
        </div>
      </div>
    );
  }
 }
 
export default Main;

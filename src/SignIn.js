// Imports
import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
// Component Imports
import PageHeader from "./PageHeader";

// Sign In Component for App
// Contains the Page Header
// Contains the Navigation Bar
// Contains the Current Component details
class SignIn extends Component {
  render() {

    const responseGoogle = (response) => {
        console.log(response);
      }

    return (
      <div className="SignIn">
        {/* Contains the items for page header */}
        <PageHeader />

        {/* Contains the Body of the Website, actual page content */}
        <div className="content">
            <GoogleLogin
                clientId="113840316565-os16fo10mcrd7d4kvi1pm0dpsh727atl.apps.googleusercontent.com" // Only Allows for @valpo.edu emails
                buttonText="LOGIN WITH GOOGLE"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
            />
        </div>
      </div>
    );
  }
}
 
export default SignIn;

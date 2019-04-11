import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import config from './config.json';
import 'react-router-dom'
import Main from "./Main";


class App extends Component {

    constructor() {
        super();
        this.state = { 
            isAuthenticated: false, 
            user: null,
        };
    }

    // Logs user out of system, causes return to log in page
    logout = () => {
        this.setState({isAuthenticated: false, user: null})
    };

    // Returns an error if authentication fails
    onFailure = (error) => {
        alert(error);
    };

    // Handle the Authentication Details
    // w3 = whole object file
    // Eea = googleId
    // U3 = "email@valpo.edu"
    // ig = "first last"
    // ofa = "first"
    // wea = "last"
    googleResponse = (response) => {
        if(response) {
            this.setState({
                isAuthenticated:true, 
                user:response.w3
            })
	    // put their name and id in the database
  	    fetch('/api/user', {
      	        method: 'post',
      	        headers: {
        	    'Accept': 'application/json, text/plain, */*',
        	    'Content-Type': 'application/json'
      		},
      		body: JSON.stringify({
        	    id: this.state.user.Eea,
        	    name: this.state.user.ig,
		    email: this.state.user.U3
      		})
    	    }).then(res => res.json()).catch(error => alert('Error'));	    
        }
    };

    render() {
        // Determine what the user will view based on authentication status
        let content = !!this.state.isAuthenticated ?
                (
                    // User has been logged in, display main web application
                    <Main 
			googleId = {this.state.user.Eea}
                        email = {this.state.user.U3}
                        name = {this.state.user.ig}
                        logout = {this.logout}
                    />
                ) :
                (
                    // No user registered or logged in. Show sign in page
                    <div>
                        <h1>Hesse Center Shift Manager</h1>
                        <GoogleLogin
                            clientId={config.GOOGLE_CLIENT_ID}
                            buttonText="Login with Google"
                            onSuccess={this.googleResponse}
                            onFailure={this.onFailure}
                        />
                    </div>
                );
    
            return (
                <div className="App">
                    {content}
                </div>
            );
        }
    }
    
    export default App;

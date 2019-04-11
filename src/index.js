import React from "react";
import ReactDOM from "react-dom";
import 'react-router-dom';
import 'react-google-login';
import App from "./App";
import "./index.css";
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Renders the page content to index.html 
ReactDOM.render(
  <Router>
  <Route component={App} />
  </Router>,
  document.getElementById('root')
)

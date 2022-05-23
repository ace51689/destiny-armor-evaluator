import React from "react";
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client'
import App from "./App.js";
import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";


const root = createRoot(document.getElementById("root"))
root.render(
  <Router>
      <App />
  </Router>,
  // document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

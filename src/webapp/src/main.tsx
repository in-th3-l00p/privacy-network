import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";

import App from './App';

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

axios.defaults.baseURL = "http://localhost:8080";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

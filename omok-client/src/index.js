import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './omok/Game';
import reportWebVitals from './reportWebVitals';
import socketio from 'socket.io-client';

var socket = socketio.connect('http://localhost:3001');

ReactDOM.render(
  <React.StrictMode>
    <Game socket={socket} />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

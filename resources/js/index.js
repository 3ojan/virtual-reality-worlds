
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ModeEdit from './components/pages/ModeEdit';
import OneWorldApp from './OneWorld';
import ReactThreeApp from './ReactThreeApp';
import "bootstrap-icons/font/bootstrap-icons.css";
import MainEditClass from './components/pages/MainEditClass';

if (document.getElementById('')) {
  ReactDOM.render(<App />, document.getElementById(''));
}
if (document.getElementById('playground')) {
  ReactDOM.render(<App />, document.getElementById('playground'));
}
if (document.getElementById('testHome')) {
  ReactDOM.render(<App />, document.getElementById('testHome'));
}
if (document.getElementById('threejs')) {
  ReactDOM.render(<ReactThreeApp />, document.getElementById('threejs'));
}
if (document.getElementById('one-world')) {
  console.log("HERE")
  ReactDOM.render(<OneWorldApp />, document.getElementById('one-world'));
}
if (document.getElementById('mode-edit-world')) {
  ReactDOM.render(<MainEditClass />, document.getElementById('mode-edit-world'));
}
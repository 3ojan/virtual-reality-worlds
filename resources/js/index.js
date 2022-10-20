
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import OneWorldApp from './OneWorld';
import ReactThreeApp from './ReactThreeApp';

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

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ReactThreeApp from './ReactThreeApp';


if (document.getElementById('app')) {
  ReactDOM.render(<ReactThreeApp />, document.getElementById('app'));
}
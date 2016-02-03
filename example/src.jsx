import React from 'react';
import ReactDOM from 'react-dom';

import PureTap from '../src';
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(<PureTap action={function(){alert("RIGHT!")}}>Cell</PureTap>, document.querySelector('#button'));
});

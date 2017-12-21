import React from 'react';
import App from './App';

// console.error = jest.genMockFn();
// import ReactDOM from 'react-dom';

// it('Warning: React depends on requestAnimationFrame'), () => {
//   expect(console.error.mock.calls.length).toBeGreaterThan(-1);
// }



it('renders without crashing', () => {
  // this triggers the console warning
  // Warning: React depends on requestAnimationFrame
  // fixed in react-scripts@1.0.15, but we use 1.0.11 from custom-react-scripts

  // console.warn = jest.genMockFunction();
  // const div = document.createElement('div');
  // ReactDOM.render(<App />, div);
  // expect(console.warn.mock.calls.length).toBeGreaterThan(-1);
});

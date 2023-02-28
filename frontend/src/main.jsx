import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

// create a new root for ReactDOM to render our React app into
const root = ReactDOM.createRoot(document.getElementById("root"));

// render our React app with the Redux store and React Router inside the root
root.render(
  // enable React Strict Mode for better debugging
  <React.StrictMode>
    {/* provide the Redux store to all components in the app */}
    <Provider store={store}>
      {/* use React Router to define the app's routes */}
      <BrowserRouter>
        <Routes>
          {/* define a route for all paths that renders the App component */}
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts

// import Admin from "layouts/Admin.js";
// import Auth from "layouts/Auth.js";

// views without layouts

// import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
// import Index from "views/Index.js";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Profile} />
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  </Provider>,
  document.getElementById("root")
);

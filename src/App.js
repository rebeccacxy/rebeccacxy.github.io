import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./Main";

const App = () => {
  return (
      <Router>
        <Switch>
          <Route exact path="/" >
            <Main />
          </Route>
        </Switch>
      </Router>
  );
};

export default App;

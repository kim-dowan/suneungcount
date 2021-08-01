import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import NotFound from "routes/NotFound";
import Profile from "routes/Profile";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Home userObj={userObj} isLoggedIn={isLoggedIn} />
        </Route>
        <Route exact path="/auth">
          <Auth />
        </Route>
        <Route exact path="/profile">
          <Profile userObj={userObj} />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default AppRouter;

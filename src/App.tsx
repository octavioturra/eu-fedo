import * as React from "react";

import { HashRouter as Router, Switch, Route } from "react-router-dom";

import PageHome from "./PageHome";
import PageCreatePoll from "./PageCreatePoll";
import PagePoll from "./PagePoll";
import PageFollowUp from "./PageFollowUp";
import PageAlreadyAnswered from "./PageAlreadyAnswered";
import PageLogin from "./PageLogin";
import ErrorBoundaryLogin from "./ErrorBoundaryLogin";
import { AuthContext } from "./useLogin";

import "./styles.css";

export default function App() {
  return (
    <AuthContext>
      <Router>
        <Switch>
          <Route path="/" exact>
            <PageHome />
          </Route>
          <Route path="/criar">
            <PageCreatePoll />
          </Route>
          <Route path="/pesquisa/:pollId+/acompanhar">
            <ErrorBoundaryLogin>
              <PageFollowUp />
            </ErrorBoundaryLogin>
          </Route>
          <Route path="/pesquisa/:pollId+/respondido">
            <PageAlreadyAnswered />
          </Route>
          <Route path="/pesquisa/:pollId+">
            <PagePoll />
          </Route>
          <Route path="/login/:pollId+">
            <PageLogin />
          </Route>
        </Switch>
      </Router>
    </AuthContext>
  );
}

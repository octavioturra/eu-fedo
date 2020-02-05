import * as React from "react";

import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet, Box } from "grommet";

import PageHome from "./PageHome";
import PageCreatePoll from "./PageCreatePoll";
import PagePoll from "./PagePoll";
import PageFollowUp from "./PageFollowUp";
import PageAlreadyAnswered from "./PageAlreadyAnswered";
import PageLogin from "./PageLogin";
import ErrorBoundaryLogin from "./ErrorBoundaryLogin";
import { AuthContext } from "./useLogin";

import "./styles.css";

// width: "100%",
//       height: "100%",
//       overflow: "auto",
//       background: `linear-gradient(45deg, rgba(255, 0, 0, .5), rgba(0, 255, 0, .3)) center center,
//         radial-gradient(rgba(255, 0, 255, .5), rgba(255, 192, 203, .3)) bottom left,
//         radial-gradient(rgba(128, 0, 128, .5), rgba(255, 255, 0, .3)) top right`,
//       backgroundAttachment: "fixed, fixed, fixed"

const theme = {
  global: {
    body: {
      background: "blue"
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px"
    }
  }
};

export default function App() {
  return (
    <Box alignContent="center">
      <Grommet theme={theme}>
        <AuthContext>
          <Router>
            <Switch>
              <Route path="/" exact>
                <PageHome />
              </Route>
              <Route path="/pesquisa/criar">
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
      </Grommet>
    </Box>
  );
}

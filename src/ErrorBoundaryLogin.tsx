import * as React from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

interface ErrorBoundaryState {
  pollId: string;
  hasError: boolean;
}

type ErrorBoundaryProps = RouteComponentProps & {
  children: React.ReactNode;
  history: any;
  location: any;
  match: any;
};

export class LoginError extends Error {
  name: string = "LoginError";
  constructor(public message: string, public pollId: string) {
    super(message);
  }
}

class ErrorBoundaryLogin extends React.Component<ErrorBoundaryProps> {
  state = {
    hasError: false,
    pollId: ""
  };

  static getDerivedStateFromError(error: LoginError) {
    const errorName = error.name;
    console.error(error);
    if (errorName === "LoginError") {
      return {
        hasError: true,
        pollId: error.pollId
      };
    }
  }

  render() {
    console.log("bundler rendered");
    if (this.state.hasError) {
      setTimeout(() => {
        this.props.history.push(`/login/${this.state.pollId}`);
      }, 1);
      return <>!!!</>;
    }

    return this.props.children;
  }
}

export default withRouter(({ history, location, match, children }) => (
  <>
    <ErrorBoundaryLogin location={location} match={match} history={history}>
      {children}
    </ErrorBoundaryLogin>
  </>
));

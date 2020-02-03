import * as React from "react";
import { withRouter } from "react-router-dom";

interface ErrorBoundaryProps {
  children: React.ReactElement;
  history: any;
}
interface ErrorBoundaryState {
  pollId: string;
  hasError: boolean;
}

export class LoginError extends Error {
  constructor(public message: string, public pollId: string) {
    super(message);
  }
}

export default withRouter(
  class ErrorBoundaryLogin extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
  > {
    state = {
      hasError: false,
      pollId: null
    };

    static getDerivedStateFromError(error: LoginError) {
      const errorName = error.constructor.name;
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
        this.props.history.push(`/login/${this.state.pollId}`);
        return <>!!!</>;
      }

      return this.props.children;
    }
  }
);

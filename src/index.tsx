import * as React from "react";
import { render } from "react-dom";

import App from "./App";

declare global {
  interface Window {
    OrbitDB: any;
    Ipfs: any;
  }
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);

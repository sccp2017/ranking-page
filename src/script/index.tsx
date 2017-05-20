// import Style Sheet
import "../style/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { List, Map } from "immutable";

import App from "./components/App";
import { IRanking } from "./define";

ReactDOM.render(<App />, document.getElementById("content"));
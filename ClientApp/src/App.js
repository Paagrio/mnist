import React, { Component } from "react";
import { Switch, Route } from "react-router";
import { Home } from "./components/Home";
import { Learning } from "./components/Learning/Learning";
export default class App extends Component {
  displayName = App.name;

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/learning" component={Learning} />
      </Switch>
    );
  }
}

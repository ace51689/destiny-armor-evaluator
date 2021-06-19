import React from "react"
import GetManifest from "./components/GetManifest"
import AuthPage from "./views/AuthPage"
import Main from "./views/Main"
import ExoticBattle from "./views/ExoticBattle"
import {Switch, Route } from "react-router-dom"
import './App.css';

function App() {

  return (
    <div className="App">
      <GetManifest />
      <Switch>
        <Route exact path="/" render={(routeProps) => {
          return <AuthPage {...routeProps} />
        }} />
        <Route path="/main" render={(routeProps) => {
          return <Main {...routeProps} />
        }} />
        <Route path="/exotic-battle" render={(routeProps) => {
          return <ExoticBattle {...routeProps} />
        }}></Route>
      </Switch>
    </div>
  );
}

export default App;

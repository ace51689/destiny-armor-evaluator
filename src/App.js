import React from "react"
import GetManifest from "./components/GetManifest"
import GetUserArmor from "./components/GetUserArmor"
import AuthPage from "./views/AuthPage"
import Main from "./views/Main"
import ExoticBattle from "./views/ExoticBattle"
import ExtoicPage from "./views/ExtoicPage"
import { Switch, Route } from "react-router-dom"
import './App.css';

function App() {

  return (
    <div className="App">
      <GetManifest />
      <Switch>
        <Route exact path="/" render={(routeProps) => {
          return <AuthPage {...routeProps} />
        }} />
        <Route path="/populate" render={(routeProps) => {
          return <GetUserArmor {...routeProps} />
        }} />
        <Route path="/main" render={(routeProps) => {
          return <Main {...routeProps} />
        }} />
        <Route path="/exotic-battle" render={(routeProps) => {
          return <ExoticBattle {...routeProps} />
        }}></Route>
        <Route path="/evaluate/:hash?" render={(routeProps) => {
          return <ExtoicPage {...routeProps} />
        }}>
        </Route>
      </Switch>
    </div>
  );
}

export default App;

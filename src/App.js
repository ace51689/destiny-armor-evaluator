import React from "react"
import GetManifest from "./components/GetManifest"
import GetUserArmor from "./components/GetUserArmor"
import AuthPage from "./views/AuthPage"
import ClassPage from "./views/ClassPage"
import Main from "./views/Main"
import ExoticBattle from "./views/ExoticBattle"
import ExtoicPage from "./views/ExtoicPage"
import ArmorEvaluator from "./views/ArmorEvaluator"
import { Switch, Route } from "react-router-dom"
import './App.css';
import SingleEvaluation from "./views/SingleEvaluation"
import Navigation from "./components/Navigation"

function App() {

  return (
    <div className="App">
      <Navigation />
      <Switch>
        <Route exact path="/" render={(routeProps) => {
          return <AuthPage {...routeProps} />
        }} />
        <Route path="/select" render={(routeProps) => {
          return <ClassPage {...routeProps} />
        }} />
        <Route path="/manifest" render={(routeProps) => {
          return <GetManifest {...routeProps} />
        }} />
        <Route path="/populate" render={(routeProps) => {
          return <GetUserArmor {...routeProps} />
        }} />
        <Route path="/main" render={(routeProps) => {
          return <Main {...routeProps} />
        }} />
        <Route path="/exotic-battle" render={(routeProps) => {
          return <ExoticBattle {...routeProps} />
        }} />
        <Route exact path="/evaluate" render={(routeProps) => {
          return <ArmorEvaluator {...routeProps} />
        }} />
        <Route path="/evaluate/:hash?" render={(routeProps) => {
          return <ExtoicPage {...routeProps} />
        }} />
        <Route path="/single/:instance?" render={(routeProps) => {
          return <SingleEvaluation {...routeProps} />
        }} />
      </Switch>
    </div>
  );
}

export default App;

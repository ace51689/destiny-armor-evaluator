import React from "react"
import Populate from "./components/Populate"
import AuthPage from "./views/AuthPage"
import ClassPage from "./views/ClassPage"
import Main from "./views/Main"
import ExoticBattle from "./views/ExoticBattle"
import ExtoicPage from "./views/ExtoicPage"
import ArmorEvaluator from "./views/ArmorEvaluator"
import { Switch, Route } from "react-router-dom"
import './App.css';
import SingleEvaluation from "./archived/SingleEvaluation"
import Navigation from "./components/Navigation"
import DemoPopulate from "./components/DemoPopulate"
import ReAuth from "./views/ReAuth"

function App() {

  return (
    <div className="App">
      <Navigation />
      <Switch>
        <Route exact path="/" render={(routeProps) => {
          return <AuthPage {...routeProps} />
        }} />
        <Route exact path="/reauth" render={(routeProps) => {
          return <ReAuth {...routeProps} />
        }} />
        <Route path="/select" render={(routeProps) => {
          return <ClassPage {...routeProps} />
        }} />
        <Route path="/populate" render={(routeProps) => {
          return <Populate {...routeProps} />
        }} />
        <Route path="/demo-populate" render={(routeProps) => {
          return <DemoPopulate {...routeProps} />
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

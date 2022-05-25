import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./views/Login"
import Authenticate from "./views/Authenticate"
import PopulateUser from "./views/PopulateUser"
import PopulateVendor from "./views/PopulateVendor"
import ArmorEvaluator from "./views/ArmorEvaluator"
import Navigation from "./components/Navigation"
import DemoPopulate from "./components/DemoPopulate"
import './App.css';
import NotFound from "./views/NotFound"

function App() {

  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/authenticate' element={<Authenticate />} />
        <Route path="/populate-user" element={<PopulateUser />} />
        <Route path="/populate-vendor" element={<PopulateVendor />} />
        <Route path="/demo-populate" element={<DemoPopulate />} />
        <Route path='/evaluate'>
          <Route path=":class" element={<ArmorEvaluator />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

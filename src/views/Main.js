import React from 'react'
import { Link } from "react-router-dom"
// import { useStore } from "../store/store"

const Main = (props) => {

  return (
    <div>
      <div>You're successuflly authorized with Bungie! What would you want to do now?</div>
      <Link to="/exotic-battle">Exotic Battle</Link>
    </div>
  )

}

export default Main

import React from 'react'
import { Link } from "react-router-dom"

const Main = () => {

  return (
    <div>
      <div>You're successuflly authorized with Bungie! What would you want to do now?</div>
      <Link to="/exotic-battle">Exotic Battle</Link>
      <br/>
      <Link to="/evaluate">Armor Evaluator</Link>
    </div>
  )

}

export default Main

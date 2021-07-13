import React from 'react'
import { Link } from "react-router-dom"
import ChangeArmorGroup from './ChangeArmorGroup'
import CustomDisplay from './CustomDisplay'

const AlternateEvalInterface = (props) => {
  return (
    <div>
      <ChangeArmorGroup changeArmor={props.changeArmor} />
      <button onClick={props.evaluateArmor}>Evaluate for Recovery/Intellect Builds</button>
      {
        props.chosen && props.chosen.map((choice) => (
          <div key={choice[0]}>
            <br />
            <Link to={`/single/${choice[0]}`} >{choice[1].name}</Link>
            <br />
            Power Level: {choice[1].powerLevel}
            <br />
            Affinity: {choice[1].energyType}
            <br />
            Energy: {choice[1].energyCapacity}
            <br />
            Unique Stat Tier Combinations: {choice[1].counter ? choice[1].counter : 0}
            <br />
            <CustomDisplay choice={choice} />
            <br />
          </div>
        ))
      }
    </div>
  )
}

export default AlternateEvalInterface

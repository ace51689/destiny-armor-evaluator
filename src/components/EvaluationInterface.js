import React from 'react'
import { Link } from "react-router-dom"

const EvaluationInterface = (props) => {
  return (
    <div>
      <button onClick={props.changeArmor} value="Exotic Helmets">Exotic Helmets</button>
      <button onClick={props.changeArmor} value="Exotic Gauntlets">Exotic Gauntlets</button>
      <button onClick={props.changeArmor} value="Exotic Chests">Exotic Chests</button>
      <button onClick={props.changeArmor} value="Exotic Legs">Exotic Legs</button>
      <br />
      <button onClick={props.changeArmor} value="Helmets">Helmets</button>
      <button onClick={props.changeArmor} value="Gauntlets">Gauntlets</button>
      <button onClick={props.changeArmor} value="Chests">Chests</button>
      <button onClick={props.changeArmor} value="Legs">Legs</button>
      <br />
      <button onClick={props.handleChained}>{props.chained ? "Chaining Stat Evaluation" : "Evaluating Stats Seperatly"}</button>
      <br />
      <label htmlFor="customTier">Minimum Stat Tier: </label>
      <input onChange={props.handleChange} name="totalTier" type="number" value={props.userTier.totalTier}></input>
      <br />
      <label htmlFor="customTier">Minimum Mobility Tier: </label>
      <input onChange={props.handleChange} name="mobility" type="number" value={props.userTier.mobility}></input>
      <br />
      <label htmlFor="customTier">Minimum Resilience Tier: </label>
      <input onChange={props.handleChange} name="resilience" type="number" value={props.userTier.resilience}></input>
      <br />
      <label htmlFor="customTier">Minimum Recovery Tier: </label>
      <input onChange={props.handleChange} name="recovery" type="number" value={props.userTier.recovery}></input>
      <br />
      <label htmlFor="customTier">Minimum Discipline Tier: </label>
      <input onChange={props.handleChange} name="discipline" type="number" value={props.userTier.discipline}></input>
      <br />
      <label htmlFor="customTier">Minimum Intellect Tier: </label>
      <input onChange={props.handleChange} name="intellect" type="number" value={props.userTier.intellect}></input>
      <br />
      <label htmlFor="customTier">Minimum Strength Tier: </label>
      <input onChange={props.handleChange} name="strength" type="number" value={props.userTier.strength}></input>
      <br />
      <button
        onClick={props.evaluateArmor}
      >Evaluate for tier {props.userTier.totalTier} loadouts</button>
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
            Unique Stat Tier Combinations: {choice[1].uniqueCombos ? choice[1].uniqueCombos : 0}
            <br />
            {props.chained ?
              <div>
                Total Custom Stat Loadouts: {choice[1].customTier && choice[1].customTier.chained}
                <br />
                {
                  choice[1].itemTier === "Legendary" ?
                    <div>Paired Exotics {choice[1].pairedExotics && choice[1].pairedExotics.map((exotic) => `- ${exotic} `)}</div>
                    :
                    <div>Paired Legendaries:
                      {choice[1].pairedItems && choice[1].pairedItems.map((piece) => {
                        return <div>
                          {piece[0]}
                          <br />
                          {`Mobility: ${piece[1].mobility} - Resilience: ${piece[1].resilience} - Recovery: ${piece[1].recovery} - Discipline: ${piece[1].discipline} - Intellect: ${piece[1].intellect} - Strength: ${piece[1].strength}`}
                        </div>
                      })}
                    </div>
                }
              </div>
              :
              <div>
                Tier {props.userTier.totalTier}: {choice[1].customTier && choice[1].customTier.totalTier}
                <br />
                Minimum {props.userTier.mobility} Mobility: {choice[1].customTier && choice[1].customTier.mobility}
                <br />
                Mimimum {props.userTier.resilience} Resilience: {choice[1].customTier && choice[1].customTier.resilience}
                <br />
                Minimum {props.userTier.recovery} Recovery: {choice[1].customTier && choice[1].customTier.recovery}
                <br />
                Minimum {props.userTier.discipline} Discipline: {choice[1].customTier && choice[1].customTier.discipline}
                <br />
                Minimum {props.userTier.intellect} Intellect: {choice[1].customTier && choice[1].customTier.intellect}
                <br />
                Mimimum {props.userTier.strength} Strength: {choice[1].customTier && choice[1].customTier.strength}
                <br />
              </div>
            }
            <br />
          </div>
        ))
      }
    </div>
  )
}

export default EvaluationInterface

import React from 'react'

const SelectableStatGroup = (props) => {
  return (
    <div>
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
      {props.evalType === 3 &&
        <>
          <label htmlFor="average">Two Stat Average: </label>
          <input onChange={props.handleChange} name="average" type="number" value={props.userTier.average}></input>
          <br/>
        </>
      }
      <button
        onClick={props.evaluateArmor}
      >Evaluate Loadouts</button>
    </div>
  )
}

export default SelectableStatGroup

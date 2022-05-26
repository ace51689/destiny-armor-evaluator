import React from 'react'

const SelectableStatGroup = (props) => {
  return (
    <div>

      <div className='selectable-stat-group'>
        <div id='stat-groups'>
          <div>
            <label title="Minimum amount of total stat points you want across all six stat tiers." htmlFor="customTier">Minimum Stat Tier: </label>
            &nbsp;
            <input id='stat-input' onChange={props.handleChange} min={25} max={32} name="totalTier" type="number" value={props.userTier.totalTier}></input>
          </div>


        </div>
        <div id='stat-groups'>

          {/* <div>
            <label htmlFor="customTier">Minimum Mobility Tier: </label>
            &nbsp;
            <input id='stat-input' onChange={props.handleChange} min={1} max={10} name="mobility" type="number" value={props.userTier.mobility}></input>
            </div>
            
          <div>
            <label htmlFor="customTier">Minimum Discipline Tier: </label>
            &nbsp;
            <input id='stat-input' onChange={props.handleChange} min={1} max={10} name="discipline" type="number" value={props.userTier.discipline}></input>
          </div> */}

          <div>
            <label title="Minimum Recovery tier you want your loadouts to have." htmlFor="customTier">Minimum Recovery Tier: </label>
            &nbsp;
            <input id='stat-input' onChange={props.handleChange} min={1} max={10} name="recovery" type="number" value={props.userTier.recovery}></input>
          </div>
        </div>

        <div id='stat-groups'>
          <div>
            <label title="Minimum Intellect tier you want your loadouts to have." htmlFor="customTier">Minimum Intellect Tier: </label>
            &nbsp;
            <input id='stat-input' onChange={props.handleChange} min={1} max={10} name="intellect" type="number" value={props.userTier.intellect}></input>
          </div>
          {/* <div>
            <label htmlFor="customTier">Minimum Resilience Tier: </label>
            &nbsp;
            <input id='stat-input' onChange={props.handleChange} min={1} max={10} name="resilience" type="number" value={props.userTier.resilience}></input>
          </div> */}

        </div>



        {/* <div id='stat-groups'> */}

          {/* <div>
            <label htmlFor="average">Minimum Combined:</label>
            &nbsp;
            <input id='stat-input' onChange={props.handleChange} min={10} max={20} name="average" type="number" value={props.userTier.average}></input>
          </div> */}

          {/* <div>
            <label htmlFor="customTier">Minimum Strength Tier: </label>
            &nbsp;
            <input id='stat-input' onChange={props.handleChange} min={1} max={10} name="strength" type="number" value={props.userTier.strength}></input>
          </div> */}
        {/* </div> */}

      </div>

    </div>
  )
}

export default SelectableStatGroup

import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import StatTypeSeclection from './StatTypeSeclection'

const SelectableStatGroup = (props) => {

  const handleChangeValue = (e) => {
    props.setUserInput({
      ...props.userInput,
      totalTier: parseInt(e.target.value)
    })
  }

  const handleChangeTiebreak = (e) => {
    props.setUserInput({
      ...props.userInput,
      tieBreak: e.target.value
    })
  }

  return (
    <div className='selectable-stat-group'>
      <div id='stat-groups'>
        <div>
          <label title="Minimum amount of total stat points you want across all six stat tiers." htmlFor="customTier">Minimum Stat Tier: </label>
          &nbsp;
          <input id='stat-input' onChange={handleChangeValue} min={25} max={32} name="totalTier" type="number" value={props.userInput.totalTier}></input>
        </div>


      </div>
      <div id='stat-groups'>
        <StatTypeSeclection userInput={props.userInput} setUserInput={props.setUserInput} name="topStat" />
      </div>

      <div id='stat-groups'>
        <StatTypeSeclection userInput={props.userInput} setUserInput={props.setUserInput} name="bottomStat" />
      </div>



      <div id='stat-groups' style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        Tie-breaking stat:
        <DropdownButton variant='link' title={props.userInput.tieBreak}>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} value='mobility'>mobility</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} value='resilience'>resilience</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} value='recovery'>recovery</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} value='discipline'>discipline</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} value='intellect'>intellect</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} value='strength'>strength</Dropdown.Item>
        </DropdownButton>
      </div>

    </div>
  )
}

export default SelectableStatGroup

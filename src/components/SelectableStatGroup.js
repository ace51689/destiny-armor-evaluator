import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import StatTypeSeclection from './StatTypeSeclection'

const SelectableStatGroup = ({ setUserInput, userInput }) => {

  const handleChangeValue = (e) => {
    setUserInput({
      ...userInput,
      totalTier: parseInt(e.target.value)
    })
  }

  const handleChangeTiebreak = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className='selectable-stat-group'>
      <div id='stat-groups'>
        <div>
          <label title="Minimum amount of total stat points you want across all six stat tiers." htmlFor="customTier">Minimum Stat Tier: </label>
          &nbsp;
          <input id='stat-input' onChange={handleChangeValue} min={25} max={32} name="totalTier" type="number" value={userInput.totalTier}></input>
        </div>


      </div>
      <div id='stat-groups'>
        <StatTypeSeclection userInput={userInput} setUserInput={setUserInput} name="topStat" />
      </div>

      <div id='stat-groups'>
        <StatTypeSeclection userInput={userInput} setUserInput={setUserInput} name="bottomStat" />
      </div>



      <div id='stat-groups' style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        1st tie-break:
        <DropdownButton variant='link' title={userInput.tieBreakOne}>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakOne" value='mobility'>mobility</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakOne" value='resilience'>resilience</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakOne" value='recovery'>recovery</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakOne" value='discipline'>discipline</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakOne" value='intellect'>intellect</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakOne" value='strength'>strength</Dropdown.Item>
        </DropdownButton>
      </div>
      
      <div id='stat-groups' style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        2nd tie-break:
        <DropdownButton variant='link' title={userInput.tieBreakTwo}>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakTwo" value='mobility'>mobility</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakTwo" value='resilience'>resilience</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakTwo" value='recovery'>recovery</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakTwo" value='discipline'>discipline</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakTwo" value='intellect'>intellect</Dropdown.Item>
          <Dropdown.Item as="button" onClick={handleChangeTiebreak} name="tieBreakTwo" value='strength'>strength</Dropdown.Item>
        </DropdownButton>
      </div>

    </div>
  )
}

export default SelectableStatGroup

import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import "./StatTypeSelection.css"

function StatTypeSeclection({ userInput, setUserInput, name }) {
  const topStatType = userInput.topStat.type
  const bottomStatType = userInput.bottomStat.type

  const changeStatType = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: {
        ...userInput[e.target.name],
        type: e.target.value
      }
    })
  }

  const handleChangeValue = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: {
        ...userInput[e.target.name],
        value: parseInt(e.target.value)
      }
    })
  }

  const determineStatType = (topStatType, bottomStatType, typeToCheck) => {
    if (topStatType === typeToCheck || bottomStatType === typeToCheck) {
      return false
    }
    return true
  }

  const dropDownStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  return (
    <div style={dropDownStyle}>
      Minimum
      <DropdownButton variant='link' title={userInput[name].type} >
        {
          determineStatType(topStatType, bottomStatType, "mobility") && <Dropdown.Item as='button' onClick={changeStatType} name={name} value="mobility" >mobility</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "resilience") && <Dropdown.Item as='button' onClick={changeStatType} name={name} value="resilience" >resilience</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "recovery") && <Dropdown.Item as='button' onClick={changeStatType} name={name} value="recovery" >recovery</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "discipline") && <Dropdown.Item as='button' onClick={changeStatType} name={name} value="discipline" >discipline</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "intellect") && <Dropdown.Item as='button' onClick={changeStatType} name={name} value="intellect"  >intellect</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "strength") && <Dropdown.Item as='button' onClick={changeStatType} name={name} value="strength" >strength</Dropdown.Item>
        }
      </DropdownButton>
      tier:
      &nbsp;
      <input id='stat-input' onChange={handleChangeValue} min={1} max={10} value={userInput[name].value} name={name} type="number"></input>
    </div>
  )
}

export default StatTypeSeclection
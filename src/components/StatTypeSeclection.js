import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import "./StatTypeSelection.css"

function StatTypeSeclection(props) {
  const topStatType = props.userInput.topStat.type
  const bottomStatType = props.userInput.bottomStat.type

  const changeStatType = (e) => {
    props.setUserInput({
      ...props.userInput,
      [e.target.name]: {
        ...props.userInput[e.target.name],
        type: e.target.value
      }
    })
  }

  const handleChangeValue = (e) => {
    props.setUserInput({
      ...props.userInput,
      [e.target.name]: {
        ...props.userInput[e.target.name],
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

  // if (props.top) {
  return (
    <div style={dropDownStyle}>
      Minimum
      <DropdownButton variant='link' title={props.userInput[props.name].type} >
        {
          determineStatType(topStatType, bottomStatType, "mobility") && <Dropdown.Item as='button' onClick={changeStatType} name={props.name} value="mobility" >mobility</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "resilience") && <Dropdown.Item as='button' onClick={changeStatType} name={props.name} value="resilience" >resilience</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "recovery") && <Dropdown.Item as='button' onClick={changeStatType} name={props.name} value="recovery" >recovery</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "discipline") && <Dropdown.Item as='button' onClick={changeStatType} name={props.name} value="discipline" >discipline</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "intellect") && <Dropdown.Item as='button' onClick={changeStatType} name={props.name} value="intellect"  >intellect</Dropdown.Item>
        }
        {
          determineStatType(topStatType, bottomStatType, "strength") && <Dropdown.Item as='button' onClick={changeStatType} name={props.name} value="strength" >strength</Dropdown.Item>
        }
      </DropdownButton>
      tier:
      &nbsp;
      <input id='stat-input' onChange={handleChangeValue} min={1} max={10} value={props.userInput[props.name].value} name={props.name} type="number"></input>
    </div>
  )
  // }
  // if (props.bottom) {
  //   return (
  //     <div style={dropDownStyle}>
  //       Minimum
  //       <DropdownButton variant='link' title={props.userInput.bottomStat.type} name="bottomStat">
  //       </DropdownButton>
  //       tier:
  //       &nbsp;
  //       <input id='stat-input' onChange={handleChangeValue} min={1} max={10} value={props.userInput.bottomStat.value} name="bottomStat" type="number"></input>
  //     </div>
  //   )
  // }
}

export default StatTypeSeclection
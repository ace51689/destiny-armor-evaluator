import React from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

const EvaluationOptions = (props) => {
  
  return (
    <ToggleButtonGroup type="radio" name="evalTypes" value={props.evalType} onChange={props.handleEvalType}>
      <ToggleButton value={1}>Seperate Stats</ToggleButton>
      <ToggleButton value={2}>Chain Stats</ToggleButton>
      <ToggleButton value={3}>Average Two Stats</ToggleButton>
    </ToggleButtonGroup>
  )
}

export default EvaluationOptions

import React from 'react'
import { Button } from 'react-bootstrap'

//Component that returns a button used for boolean switching.
function BooleanButton({ buttonText, booleanType, toggleFunction, color, title, disabled }) {
  //Define a style for if the boolean is true:
  const trueStyle = {
    color: "#fff",
    backgroundColor: color,
    borderColor: color,
    boxShadow: "none"
  }
  //Define a style for if the boolean is false:
  const falseStyle = {
    color: color,
    backgroundColor: "#fff",
    borderColor: color,
    boxShadow: "none"
  }
  const disabledStyle = {
    color: "#fff",
    backgroundColor: color,
    borderColor: color,
    boxShadow: "none"
  }
  //Define a function that handles changing the boolean:
  const handleChange = () => {
    toggleFunction(!booleanType)
  }

  //If disabled is a prop:
  if (disabled) {
    //Return a disabled button
    return (
      <Button title={title} style={disabledStyle}>
        {buttonText}
      </Button>
    )
  }
  //If if disabled is not a prop:
  if (!disabled) {
    //Return an active button
    return (
      //Button if boolean is true:
      <Button onClick={handleChange} title={title} style={booleanType ? trueStyle : falseStyle} >
        {buttonText}
      </Button>
    )
  }
}

export default BooleanButton
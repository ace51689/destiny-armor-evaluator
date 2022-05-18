import React from 'react'
import { useStore } from "../store/store"
import { useHistory } from "react-router-dom"
import { Button } from 'react-bootstrap'

const ClassPage = () => {
  const characterClasses = useStore(state => state.characterClasses)
  const history = useHistory()

  return (
    <div>
      <h4>Select the class you would like to analyze:</h4>
      {
        characterClasses.includes("Titan") &&
        <Button onClick={() => {
          history.push('/evaluate/Titan')
        }}><img src={'https://www.bungie.net/common/destiny2_content/icons/e78f012b19b5f6c6026c12547895b756.png'} alt='titan logo' style={{ width: '25px' }} /> Titan</Button>
      }
      &nbsp;
      {
        characterClasses.includes("Hunter") &&
        <button onClick={() => {
          history.push("/evaluate/Hunter")
        }}>Hunter</button>
      }
      {
        characterClasses.includes("Warlock") &&
        <button onClick={() => {
          history.push("/evaluate/Warlock")
        }}>Warlock</button>
      }
    </div>
  )
}

export default ClassPage

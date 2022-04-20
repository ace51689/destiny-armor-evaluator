import React from 'react'
import { useStore, CHANGE_CLASS } from "../store/store"
import { useHistory } from "react-router-dom"

const ClassPage = () => {
  const dispatch = useStore((state) => state.dispatch)
  const characterClasses = useStore(state => state.characterClasses)
  const history = useHistory()

  return (
    <div>
      <h4>Select the class you would like to analyze:</h4>
      {
        characterClasses.includes("Titan") &&
        <button onClick={() => {
          dispatch({ type: CHANGE_CLASS, payload: "Titan" })
          history.push("/evaluate")
        }}>Titan</button>
      }
      {
        characterClasses.includes("Hunter") &&
        <button onClick={() => {
          dispatch({ type: CHANGE_CLASS, payload: "Hunter" })
          history.push("/evaluate")
        }}>Hunter</button>
      }
      {
        characterClasses.includes("Warlock") &&
        <button onClick={() => {
          dispatch({ type: CHANGE_CLASS, payload: "Warlock" })
          history.push("/evaluate")
        }}>Warlock</button>
      }
    </div>
  )
}

export default ClassPage

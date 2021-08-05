import React from 'react'
import { useStore, CHANGE_CLASS } from "../store/store"
import { useHistory } from "react-router-dom"

const ClassPage = () => {
  const dispatch = useStore((state) => state.dispatch)
  const history = useHistory()
  
  return (
    <div>
      <button onClick={() => {
        dispatch({ type: CHANGE_CLASS, payload: "Titan" })
        history.push("/populate")
        }}>Titan</button>
      <button onClick={() => {
        dispatch({ type: CHANGE_CLASS, payload: "Hunter" })
        history.push("/populate")
        }}>Hunter</button>
      <button onClick={() => {
        dispatch({ type: CHANGE_CLASS, payload: "Warlock" })
        history.push("/populate")
        }}>Warlock</button>
    </div>
  )
}

export default ClassPage

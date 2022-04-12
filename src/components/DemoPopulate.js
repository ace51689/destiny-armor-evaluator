import React, { useState, useEffect } from 'react'
import { useStore, GET_USER_ARMOR, CHANGE_CLASS } from '../store/store'
import { demoArmor } from '../DemoArmor'
import { useHistory } from 'react-router-dom'

function DemoPopulate() {
  const history = useHistory()
  const dispatch = useStore((state) => state.dispatch)
  // const destinyId = localStorage.getItem("DESTINY_ID")
  // const memberType = localStorage.getItem("MEMBER_TYPE")
  // const authToken = localStorage.getItem("AUTH_TOKEN")
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) {
      dispatch({ type: GET_USER_ARMOR, payload: demoArmor })
      setLoading(false)
    }

    if (!mounted) {
      setMounted(true)
    }

  }, [mounted, dispatch])

  if (loading) {
    return (
      <div>Loading user armor</div>
    )
  }
  else {
    return (
      <div>
        <h4>Select the class you would like to analyze:</h4>
        <button onClick={() => {
          dispatch({ type: CHANGE_CLASS, payload: "Titan" })
          history.push("/evaluate")
        }}>Titan</button>
        <button onClick={() => {
          dispatch({ type: CHANGE_CLASS, payload: "Hunter" })
          history.push("/evaluate")
        }}>Hunter</button>
        <button onClick={() => {
          dispatch({ type: CHANGE_CLASS, payload: "Warlock" })
          history.push("/evaluate")
        }}>Warlock</button>
      </div>
    )
  }
}

export default DemoPopulate
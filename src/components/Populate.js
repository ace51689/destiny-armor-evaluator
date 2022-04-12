import React, { useState, useEffect } from 'react'
import { useStore, GET_USER_ARMOR, CHANGE_CLASS } from '../store/store'
import { gettingUserArmor } from './GetUserArmor'
import { useHistory } from 'react-router-dom'

function Populate() {
  const history = useHistory()
  const dispatch = useStore((state) => state.dispatch)
  const destinyId = localStorage.getItem("DESTINY_ID")
  const memberType = localStorage.getItem("MEMBER_TYPE")
  const authToken = localStorage.getItem("AUTH_TOKEN")
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) {
      gettingUserArmor(destinyId, memberType, authToken, setLoading).then((array) => {
        // console.log(array)
        dispatch({ type: GET_USER_ARMOR, payload: array })
      })
    }

    if (!mounted) {
      setMounted(true)
    }

  }, [mounted, destinyId, memberType, authToken, dispatch])

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

export default Populate
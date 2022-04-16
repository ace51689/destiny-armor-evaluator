import React, { useState, useEffect } from 'react'
import { useStore, GET_USER_ARMOR, CHANGE_CLASS } from '../store/store'
import { gettingUserArmor } from './GetUserArmor'
import { useHistory } from 'react-router-dom'

function Populate() {
  const history = useHistory()
  const dispatch = useStore((state) => state.dispatch)
  const destinyId = localStorage.getItem("destinyId")
  const memberType = localStorage.getItem("membershipType")
  const authToken = localStorage.getItem("accessToken")
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) {
      gettingUserArmor(destinyId, memberType, authToken, setLoading).then((array) => {
        if (!array) {
          history.push('/reauth')
        }
        dispatch({ type: GET_USER_ARMOR, payload: array })
      })
    }

    if (!mounted) {
      setMounted(true)
    }

  }, [mounted, destinyId, memberType, authToken, dispatch, history])

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
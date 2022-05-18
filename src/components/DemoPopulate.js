import React, { useState, useEffect } from 'react'
import { useStore, GET_USER_ARMOR } from '../store/store'
import { demoArmor } from '../DemoArmor'
import { useHistory } from 'react-router-dom'

function DemoPopulate() {
  const history = useHistory()
  const dispatch = useStore((state) => state.dispatch)
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
          history.push("/evaluate/Titan")
        }}>Titan</button>
        <button onClick={() => {
          history.push("/evaluate/Hunter")
        }}>Hunter</button>
        <button onClick={() => {
          history.push("/evaluate/Warlock")
        }}>Warlock</button>
      </div>
    )
  }
}

export default DemoPopulate
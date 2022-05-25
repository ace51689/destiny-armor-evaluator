import React, { useState, useEffect } from 'react'
import { useStore, actions } from '../store/store'
import { demoArmor } from '../DemoArmor'
import { useNavigate } from 'react-router-dom'

function DemoPopulate() {
  const navigate = useNavigate()
  const dispatch = useStore((state) => state.dispatch)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) {
      dispatch({ type: actions.setCharacterInformation, payload: {
        characterClasses: ['Titan', 'Hunter', 'Warlock'],
        characterIds: [0, 1, 2]
      }
    })
      dispatch({ type: actions.setUserArmor, payload: demoArmor })
      dispatch({ type: actions.setIsLoggedIn, payload: true})
      dispatch({ type: actions.setIsDemo, payload: true})
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
          navigate("/evaluate/Titan")
        }}>Titan</button>
        <button onClick={() => {
          navigate("/evaluate/Hunter")
        }}>Hunter</button>
        <button onClick={() => {
          navigate("/evaluate/Warlock")
        }}>Warlock</button>
      </div>
    )
  }
}

export default DemoPopulate
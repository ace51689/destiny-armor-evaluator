import React, { useState, useEffect } from 'react'
import { useStore, actions } from '../store/store'
import { demoArmor } from '../DemoArmor'
import { useNavigate } from 'react-router-dom'

function DemoPopulate() {
  const navigate = useNavigate()
  const dispatch = useStore((state) => state.dispatch)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) {
      dispatch({
        type: actions.setCharacterInformation, payload: {
          characterClasses: ['Titan', 'Hunter', 'Warlock'],
          characterIds: [0, 1, 2]
        }
      })
      dispatch({ type: actions.setUserArmor, payload: demoArmor })
      dispatch({ type: actions.setIsLoggedIn, payload: true })
      dispatch({ type: actions.setIsDemo, payload: true })
      navigate('/evaluate/Titan')
    }

    if (!mounted) {
      setMounted(true)
    }

  }, [mounted, dispatch, navigate])

  return (
    <div>Loading user armor</div>
  )
}

export default DemoPopulate
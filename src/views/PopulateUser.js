import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getUserArmor } from '../functions/ArmorHelpers'
import { useStore, GET_USER_ARMOR } from '../store/store'

function PopulateUser() {
  const [mounted, setMounted] = useState(false)
  const destinyId = localStorage.getItem('destinyId')
  const membershipType = localStorage.getItem('membershipType')
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useStore(state => state.dispatch)
  const history = useHistory()

  useEffect(() => {
    if (mounted) {
      getUserArmor(destinyId, membershipType, accessToken)
        .then(array => {
          dispatch({ type: GET_USER_ARMOR, payload: array })
          history.push('/populate-vendor')
        })
    }
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted, destinyId, membershipType, accessToken, dispatch, history])

  return (
    <div className='Populate'>
      <div className='Pop-Box'>Getting user armor...</div>
    </div>
  )
}

export default PopulateUser
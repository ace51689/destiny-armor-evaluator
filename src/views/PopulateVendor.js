import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getVendorArmor } from '../functions/VendorHelpers'
import { useStore, GET_VENDOR_ARMOR } from '../store/store'

function PopulateVendor() {
  const membershipType = localStorage.getItem('membershipType')
  const destinyId = localStorage.getItem('destinyId')
  const accessToken = localStorage.getItem('accessToken')
  const characterIds = useStore(state => state.characterInfo.characterIds)
  const [mounted, setMounted] = useState(false)
  const [finished, setFinished] = useState(false)
  const dispatch = useStore(state => state.dispatch)
  const history = useHistory()

  useEffect(() => {
    if (mounted) {
      getVendorArmor(membershipType, destinyId, characterIds, accessToken)
        .then(array => {
          dispatch({ type: GET_VENDOR_ARMOR, payload: array })
          setFinished(true)
          setTimeout(() => {
            history.push('/select')
          }, 1000)
        })
    }
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted, membershipType, destinyId, characterIds, accessToken, dispatch, history])

  if (finished) {
    return (
      <div className='Populate'>
        <div className='Pop-Box'>Finishing up...</div>
      </div>
    )
  }
  if (!finished) {
    return (
      <div className='Populate'>
        <div className='Pop-Box'>Getting vendor armor... </div>
      </div>
    )
  }
}

export default PopulateVendor
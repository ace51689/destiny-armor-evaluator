import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserArmor } from '../functions/ArmorHelpers'
import { useStore, actions } from '../store/store'

function PopulateUser() {
  //Define a boolean to control when we run our master function:
  const [mounted, setMounted] = useState(false)
  //Define the user's destinyId:
  const destinyId = useStore(state => state.profileInformation.destinyId)
  //Define the user's membership type:
  const membershipType = useStore(state => state.profileInformation.membershipType)
  //Define the user's accessToken:
  const accessToken = useStore(state => state.accessInformation.accessToken)
  //Define the dispatch used to store data in global state:
  const dispatch = useStore(state => state.dispatch)
  //Define the history object used to push the user to the next page:
  const navigate = useNavigate()

  useEffect(() => {
    //If mounted:
    if (mounted) {
      //Get the user's armor:
      getUserArmor(destinyId, membershipType, accessToken)
        .then(array => {
          //If the array is false, return the user to /login. (TODO: more robust error handling)
          if (array.ErrorCode !== 1) {
            dispatch({
              type: actions.setError,
              payload: {
                type: "error",
                message: `There was an error retrieving your armor. ${array.Message} Please try authenticating with Bungie again.`
              }
            })
            navigate('/login')
          }
          //If the array isn't false:
          else {
            //Dispatch the array to global state:
            dispatch({ type: actions.setUserArmor, payload: array.armorArray })
            //Send the user to /populate-vendor:
            navigate('/populate-vendor')
          }
        })
    }
    //If mounted is false: Used to manage how many times we run getUserArmor
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted, destinyId, membershipType, accessToken, dispatch, navigate])

  return (
    <div className='Populate'>
      <div className='Pop-Box'>Getting user armor...</div>
    </div>
  )
}

export default PopulateUser
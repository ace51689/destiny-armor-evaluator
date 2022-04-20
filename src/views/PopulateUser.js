import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getUserArmor } from '../functions/ArmorHelpers'
import { useStore, GET_USER_ARMOR } from '../store/store'

function PopulateUser() {
  //Define a boolean to control when we run our master function:
  const [mounted, setMounted] = useState(false)
  //Define the user's destinyId:
  const destinyId = localStorage.getItem('destinyId')
  //Define the user's membership type:
  const membershipType = localStorage.getItem('membershipType')
  //Define the user's accessToken:
  const accessToken = localStorage.getItem('accessToken')
  //Define the dispatch used to store data in global state:
  const dispatch = useStore(state => state.dispatch)
  //Define the history object used to push the user to the next page:
  const history = useHistory()

  useEffect(() => {
    //If mounted:
    if (mounted) {
      //Get the user's armor:
      getUserArmor(destinyId, membershipType, accessToken)
        .then(array => {
          //If the array is false, return the user to /login. (TODO: more robust error handling)
          if (!array) {
            history.push('/login')
          }
          //If the array isn't false:
          else {
            //Dispatch the array to global state:
            dispatch({ type: GET_USER_ARMOR, payload: array })
            //Send the user to /populate-vendor:
            history.push('/populate-vendor')
          }
        })
    }
    //If mounted is false: Used to manage how many times we run getUserArmor
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
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getVendorArmor } from '../functions/VendorHelpers'
import { useStore, GET_VENDOR_ARMOR, SET_ERROR, SET_SHOW_CLASS_BUTTONS } from '../store/store'

function PopulateVendor() {
   //Define the user's membership type:
  const membershipType = localStorage.getItem('membershipType')
  //Define the user's destinyId:
  const destinyId = localStorage.getItem('destinyId')
  //Define the user's accessToken:
  const accessToken = localStorage.getItem('accessToken')
  //Define the user's character ids:
  const characterIds = localStorage.getItem('characterIds')
  const characterClasses = useStore(state => state.characterClasses)
  const mainClass = characterClasses[0]
  //Define a boolean to control when we run our master function:
  const [mounted, setMounted] = useState(false)
  //Define a boolean to contol what we return to render:
  const [finished, setFinished] = useState(false)
  //Define the dispatch used to store data in global state:
  const dispatch = useStore(state => state.dispatch)
  //Define the history object used to push the user to the next page:
  const history = useHistory()

  useEffect(() => {
    //If mounted:
    if (mounted) {
      //Get the vendor armor:
      getVendorArmor(membershipType, destinyId, characterIds.split(','), accessToken)
        .then(array => {
          //If the array is false, return the user to /login. (TODO: more robust error handling)
          if (!array) {
            dispatch({
              type: SET_ERROR,
              payload: {
                message: "There was an error retrieving current vendor information. Please try authenticating with Bungie again."
              }
            })
            history.push('/login')
          }
          //If the array isn't false:
          else {
            //Dispatch array to golbal state:
            dispatch({ type: GET_VENDOR_ARMOR, payload: array })
            //Set finished to true:
            setFinished(true)
            //After one second send the user to the select page: (TODO more robust 'home' page)
            setTimeout(() => {
              dispatch({ type: SET_SHOW_CLASS_BUTTONS, payload: true})
              history.push(`/evaluate/${mainClass}`)
            }, 1000)
          }
        })
    }
    //If mounted is false: Used to manage how many times we run getVendorArmor
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted, membershipType, destinyId, characterIds, accessToken, dispatch, history, mainClass])

  //If finished is true render a finishing up message:
  if (finished) {
    return (
      <div className='Populate'>
        <div className='Pop-Box'>Finishing up...</div>
      </div>
    )
  }
  //If finished is false render a getting vendor armor message:
  if (!finished) {
    return (
      <div className='Populate'>
        <div className='Pop-Box'>Getting vendor armor... </div>
      </div>
    )
  }
}

export default PopulateVendor
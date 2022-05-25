import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVendorArmor } from '../functions/VendorHelpers'
import { useStore, actions } from '../store/store'

function PopulateVendor() {
   //Define the user's membership type:
  const membershipType = useStore(state => state.profileInformation.membershipType)
  //Define the user's destinyId:
  const destinyId = useStore(state => state.profileInformation.destinyId)
  //Define the user's accessToken:
  const accessToken = useStore(state => state.accessInformation.accessToken)
  //Define the user's character ids:
  const characterIds = useStore(state => state.characterInformation.characterIds)
  const characterClasses = useStore(state => state.characterInformation.characterClasses)
  const mainClass = characterClasses[0]
  //Define a boolean to control when we run our master function:
  const [mounted, setMounted] = useState(false)
  //Define a boolean to contol what we return to render:
  const [finished, setFinished] = useState(false)
  //Define the dispatch used to store data in global state:
  const dispatch = useStore(state => state.dispatch)
  //Define the history object used to push the user to the next page:
  const navigate = useNavigate()

  useEffect(() => {
    //If mounted:
    if (mounted) {
      //Get the vendor armor:
      getVendorArmor(membershipType, destinyId, characterIds, accessToken)
        .then(array => {
          //If the array is false, return the user to /login. (TODO: more robust error handling)
          if (array.ErrorCode !== 1) {
            dispatch({
              type: actions.setError,
              payload: {
                type: "error",
                message: `There was an error retrieving current vendor information. ${array.Message} Please try authenticating with Bungie again.`
              }
            })
          }
          //If the array isn't false:
          else {
            //Dispatch array to golbal state:
            dispatch({ type: actions.setVendorArmor, payload: array.vendorArray })
          }
          //Set finished to true:
          setFinished(true)
          //After one second send the user to the select page: (TODO more robust 'home' page)
          setTimeout(() => {
            dispatch({ type: actions.setIsLoggedIn, payload: true})
            navigate(`/evaluate/${mainClass}`)
          }, 1000)
        })
    }
    //If mounted is false: Used to manage how many times we run getVendorArmor
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted, membershipType, destinyId, characterIds, accessToken, dispatch, navigate, mainClass])

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
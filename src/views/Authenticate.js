import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore, GET_CLASS_INFO } from '../store/store'
import { getUserInformation } from '../functions/ProfileHelpers'

function Authenticate(props) {
  //Define the code needed to retrieve the access token:
  const authcode = (props.location.search).replace('?code=', '')
  //Define the dispatch used to store data in global state:
  const dispatch = useStore(state => state.dispatch)
  //Define a boolean to control when we run our master function:
  const [mounted, setMounted] = useState(false)
  //Define the history object used to push the user to the next page:
  const history = useHistory()

  useEffect(() => {
    //If mounted is true then call the master function:
    if (mounted) {
      getUserInformation(authcode)
        .then(data => {
          //Shorten the paths to the access and profile data:
          const accessInformation = data.accessToken
          const profileInformation = data.destinyId
          //Set important items in local storage:
          localStorage.setItem("accessToken", accessInformation.accessToken)
          localStorage.setItem("bungieId", accessInformation.bungieId)
          localStorage.setItem("destinyId", profileInformation.destinyId)
          localStorage.setItem("membershipType", profileInformation.membershipType)
          //Shorten the path to the character data:
          const characterInformation = data.characterInformation
          //Dispatch the character information to global state:
          dispatch({ type: GET_CLASS_INFO, payload: characterInformation })
          //Send the user to "/populate" to load user armor:
          history.push('/populate')
        })
    }
    //If mounted is false, then set it to true. Used to control when/how often getUserInformation is run.
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted, authcode, dispatch, history])

  return (
    <div>Getting account information...</div>
  )
}

export default Authenticate

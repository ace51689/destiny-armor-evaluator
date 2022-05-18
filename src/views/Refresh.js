import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore, GET_CHAR_INFO, SET_ERROR, SET_SHOW_CLASS_BUTTONS } from '../store/store'
import { refreshUserInformation } from '../functions/ProfileHelpers'

function Refresh() {
  //Define the membershipType currently in local storage:
  const membershipType = localStorage.getItem('membershipType')
  //Define the destinyId currently in local storage:
  const destinyId = localStorage.getItem('destinyId')
  //Define the accessToken currently in local storage:
  const accessToken = localStorage.getItem('accessToken')
  //Define the dispatch used to store data in global state:
  const dispatch = useStore(state => state.dispatch)
  //Define a boolean to control when we run our master function:
  const [mounted, setMounted] = useState(false)
  //Define the history object used to push the user to the next page:
  const history = useHistory()

  useEffect(() => {
    //If mounted is true then call the master function:
    if (mounted) {
      dispatch({ type: SET_SHOW_CLASS_BUTTONS, payload: false })
      refreshUserInformation(membershipType, destinyId, accessToken)
        .then(data => {
          if (!data) {
            dispatch({ type: SET_ERROR, payload: { message: "Your access token has expired, please reauthorize with Bungie.net." } })
            history.push('/login')
          }
          else {
            //Shorten the path to the character data:
            const characterInformation = data.characterInformation
            //Set the character Id's in local storage:
            localStorage.setItem('characterIds', characterInformation.characterIds)
            //Dispatch the character information to global state:
            dispatch({ type: GET_CHAR_INFO, payload: characterInformation.characterClasses })
            //Send the user to "/populate" to load user armor:
            history.push('/populate-user')
          }
        })
    }
    //If mounted is false, then set it to true. Used to control when/how often refreshUserInformation is run.
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted, membershipType, destinyId, accessToken, dispatch, history])

  return (
    <div className='Authenticate'>
      <div className='Auth-Box'>
        Refreshing account information...
      </div>
    </div>
  )
}

export default Refresh
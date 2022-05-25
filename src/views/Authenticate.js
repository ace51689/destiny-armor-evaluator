import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore, actions } from '../store/store'
import { getUserInformation } from '../functions/ProfileHelpers'

function Authenticate() {
  //Define the current location:
  const location = useLocation()
  //Define the code needed to retrieve the access token:
  const authcode = location.search.replace('?code=', '')
  //Define the dispatch used to store data in global state:
  const dispatch = useStore(state => state.dispatch)
  //Define a boolean to control when we run our master function:
  const [mounted, setMounted] = useState(false)
  //Define the history object used to push the user to the next page:
  const navigate = useNavigate()

  useEffect(() => {
    //If mounted is true then call the master function:
    if (mounted) {
      localStorage.clear()
      getUserInformation(authcode)
        .then(data => {
          if (data.ErrorCode !== 1) {
            dispatch({ type: actions.setError, payload: { type: "error", message: `Could not access your Bungie profile information. ${data.Message}`  } })
            navigate('/login')
          }
          else {
            //Shorten the paths to the access, profile and character data:
            const accessInformation = data.accessToken
            const profileInformation = data.destinyId
            const characterInformation = data.characterInformation
            //Dispatch important items to global storage:
            dispatch({ type: actions.setAccessInformation, payload: accessInformation })
            dispatch({ type: actions.setProfileInformation, payload: profileInformation })
            dispatch({ type: actions.setCharacterInformation, payload: characterInformation })
            //Send the user to "/populate" to load user armor:
            navigate('/populate-user')
          }
        })
    }
    //If mounted is false, then set it to true. Used to control when/how often getUserInformation is run.
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted, authcode, dispatch, navigate])

  return (
    <div className='Authenticate'>
      <div className='Auth-Box'>
        Getting account information...
      </div>
    </div>
  )
}

export default Authenticate

import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { useStore, GET_AUTH_CODE, GET_AUTH_TOKEN, GET_MEMBER_ID, GET_DESTINY_ID, GET_MEMBER_TYPE } from '../store/store'
import { getAuthToken, getLinkedProfiles } from '../endpoints'

const AuthPage = (props) => {
  const dispatch = useStore((state) => state.dispatch)
  const authCode = useStore((state) => state.authCode)
  // const authToken = useStore((state) => state.authToken)
  // const memberId = useStore((state) => state.memberId)
  // const destinyId = useStore((state) => state.destinyId)
  // const memberType = useStore((state) => state.memberType)
  const history = useHistory()
  const [error, setError] = useState("")
  let queryParam = props.location.search

  useEffect(() => {
    if (queryParam.includes("?code=") && authCode !== props.location.search) {
      dispatch({ type: GET_AUTH_CODE, payload: props.location.search })
      getAuthToken(queryParam.replace("?", ""))
        .then((res) => {
          if (Object.keys(res).includes("error")) {
            setError(res["error_description"])
          }
          dispatch({ type: GET_AUTH_TOKEN, payload: res.access_token })
          dispatch({ type: GET_MEMBER_ID, payload: res.membership_id })
          getLinkedProfiles(res.membership_id)
            .then((res) => {
              if (res.ErrorCode === 1) {
                dispatch({ type: GET_DESTINY_ID, payload: res.Response.profiles[0].membershipId })
                dispatch({ type: GET_MEMBER_TYPE, payload: res.Response.profiles[0].membershipType})
                setError("Success!")
                history.push("/main")
              }
            }) 
        })
    }
  }, [props.location.search])

  if (authCode === "") {
    return (
      <div className="App">
        <a href="https://www.bungie.net/en/OAuth/Authorize?client_id=36791&response_type=code">Login with Bungie.net</a>
      </div>
    )
  } else {
    return (
      <div>
        {error && <div>{error}</div>}
      </div>
    )
  }
}

export default AuthPage

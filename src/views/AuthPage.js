import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
// import DragAndDrop from '../components/DragAndDrop'
import { getAuthToken, getLinkedProfiles } from '../endpoints'

const AuthPage = (props) => {
  const [error, setError] = useState("")
  const authCode = localStorage.getItem("AUTH_CODE")
  let queryParam = props.location.search
  const history = useHistory()

  useEffect(() => {
    console.log(authCode)
    if (authCode !== null) {
      history.push("/select")
    }
    if (queryParam.includes("?code=") && authCode !== props.location.search) {
      localStorage.setItem("AUTH_CODE", props.location.search)
      console.log(queryParam.replace("?", ""))
      getAuthToken(queryParam.replace("?", ""))
        .then((res) => {
          if (Object.keys(res).includes("error")) {
            setError(res["error_description"])
          }
          localStorage.setItem("AUTH_TOKEN", res.access_token)
          localStorage.setItem("MEMBER_ID", res.membership_id)
          getLinkedProfiles(res.membership_id)
            .then((res) => {
              if (res.ErrorCode === 1) {
                localStorage.setItem("DESTINY_ID", res.Response.profiles[0].membershipId)
                localStorage.setItem("MEMBER_TYPE", res.Response.profiles[0].membershipType)
                setError("Success!")
                history.push("/select")
              }
            })
        })
    }
  }, [props.location.search, authCode, history, queryParam])

  if (authCode === null) {
    return (
      <div className="App">
        <a href="https://www.bungie.net/en/OAuth/Authorize?client_id=36791&response_type=code">Login with Bungie.net</a>
        {/* <DragAndDrop /> */}
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

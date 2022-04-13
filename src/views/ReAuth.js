import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { getAuthToken, getLinkedProfiles, getProfile } from '../endpoints'
import { useStore, GET_CLASSES } from '../store/store'

const ReAuth = (props) => {
  const clientId = process.env.REACT_APP_CLIENT_ID
  const [error, setError] = useState("")
  const dispatch = useStore((state) => state.dispatch)
  const authCode = localStorage.getItem("AUTH_CODE")
  let queryParam = props.location.search
  const history = useHistory()

  useEffect(() => {
    if (authCode !== null) {
      const destinyId = localStorage.getItem('DESTINY_ID')
      const memberType = localStorage.getItem('MEMBER_TYPE')
      const authToken = localStorage.getItem('AUTH_TOKEN')
      getProfile(destinyId, memberType, authToken)
        .then((res) => {
          const classes = []
          const characters = Object.entries(res.Response.characters.data)
          characters.forEach((character) => {
            classes.push(character[0])
          })
          dispatch({ type: GET_CLASSES, payload: classes })
        })
      history.push("/populate")
    }
    if (queryParam.includes("?code=") && authCode !== props.location.search) {
      localStorage.setItem("AUTH_CODE", props.location.search)
      getAuthToken(queryParam.replace("?", ""))
        .then((res) => {
          if (Object.keys(res).includes("error")) {
            setError(res["error_description"])
          }
          const authToken = res.access_token
          localStorage.setItem("AUTH_TOKEN", authToken)
          localStorage.setItem("MEMBER_ID", res.membership_id)
          getLinkedProfiles(res.membership_id)
            .then((res) => {
              if (res.ErrorCode === 1) {
                const destinyId = res.Response.profiles[0].membershipId
                const memberType = res.Response.profiles[0].membershipType
                localStorage.setItem("DESTINY_ID", destinyId)
                localStorage.setItem("MEMBER_TYPE", memberType)
                setError("Success!")

                getProfile(destinyId, memberType, authToken)
                  .then((res) => {
                    const classes = []
                    const characters = Object.entries(res.Response.characters.data)
                    characters.forEach((character) => {
                      classes.push(character[0])
                    })
                    dispatch({ type: GET_CLASSES, payload: classes })
                  })

                history.push("/populate")
              }
            })
        })
    }
  }, [props.location.search, dispatch, authCode, history, queryParam])

  if (authCode === null) {
    return (
      <div className="App">
        <h3 style={{"color": "red"}}>Your authorization token has expired, please re-authorize with Bungie.net</h3>
        <h1>Destiny Armor Evaluator</h1>
        <h4>An easy way to clean your vault without fear of losing high Recovery/Intellect loadouts.</h4>
        <a href={`https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code`}>Login with Bungie.net</a>
        <h1>OR</h1>
        <h4>Click <a href='/demo-populate'>here</a> to demo application.</h4>
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

export default ReAuth
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../store/store'

function NotFound() {
  const location = useLocation()
  const isLoggedIn = useStore(state => state.helpers.isLoggedIn)

  return (
    isLoggedIn ?
      <div>No such route "{location.pathname}". Select a class above, refresh your gear, or logout to continue.</div>
      :
      <div>No such route "{location.pathname}". Click <a href='/login'>here</a> to return to login.</div>
  )

}

export default NotFound
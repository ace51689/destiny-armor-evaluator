import React from 'react'
import { useStore } from '../store/store'
const clientId = process.env.REACT_APP_CLIENT_ID

function Login() {
  const error = useStore(state => state.error)

  return (
    <div className="Login">
      <div className='Login-Box'>
        <div className='Login-Text'>
          <h1>Destiny Armor Evaluator</h1>
          <h4>An easy way to find high Recovery & Intellect loadouts, and isolate unused armor.</h4>
          <p><a href={`https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code`}>Authorize with Bungie.net</a> to get started.</p>
          {
            error.message && <p style={{color: "red"}}>{error.message}</p>
          }
          <h4>OR</h4>
          <p>Click <a href='/demo-populate'>here</a> use static data to demo application.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
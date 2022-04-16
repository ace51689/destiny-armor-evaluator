import React from 'react'
const clientId = process.env.REACT_APP_CLIENT_ID

function Login() {

  return (
    <div className="Login">
      <div className='Auth-Box'>
        <div className='Auth-Text'>
          <h1>Destiny Armor Evaluator</h1>
          <h4>An easy way to find high Recovery & Intellect loadouts, and isolate unused armor.</h4>
          <p><a href={`https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code`}>Authorize with Bungie.net</a> to get started.</p>
          <h4>OR</h4>
          <p>Click <a href='/demo-populate'>here</a> use static data to demo application.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
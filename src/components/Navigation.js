import React from 'react'
import { useHistory } from "react-router-dom"
import { Nav } from "react-bootstrap"

const Navigation = () => {
  const history = useHistory()
  const handle_restart = () => {
    localStorage.clear()
    history.push("/")
  }

  return (
    <Nav style={{"backgroundColor": "lightgray"}}>
      <Nav.Item>
        <Nav.Link href="/">Refresh Gear</Nav.Link>
      </Nav.Item>
      <button onClick={handle_restart}>Start Over</button>
    </Nav>
  )
}

export default Navigation

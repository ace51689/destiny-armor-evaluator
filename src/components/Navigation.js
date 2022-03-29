import React from 'react'
import { useHistory } from "react-router-dom"
import { Nav, Button } from "react-bootstrap"

const Navigation = () => {
  const history = useHistory()

  const handle_restart = () => {
    localStorage.clear()
    history.push("/")
  }

  return (
    <Nav style={{ "backgroundColor": "lightgray" }}>
      {/* <Nav.Item>
        <Nav.Link href="/">Refresh Gear</Nav.Link>
      </Nav.Item> */}
      &nbsp;
      <Nav.Item>
        <Button onClick={handle_restart}>Start Over</Button>
      </Nav.Item>
    </Nav>
  )
}

export default Navigation

import React from 'react'
import { Nav } from "react-bootstrap"

const Navigation = () => {
  return (
    <Nav style={{"backgroundColor": "lightgray"}}>
      <Nav.Item>
        <Nav.Link href="/">Refresh Gear</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

export default Navigation

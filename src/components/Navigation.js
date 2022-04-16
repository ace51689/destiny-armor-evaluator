import React from 'react'
import { useHistory } from "react-router-dom"
import { useStore, CHANGE_CLASS } from '../store/store'
import { Nav, Button } from "react-bootstrap"

const Navigation = () => {
  const history = useHistory()
  const dispatch = useStore((state) => state.dispatch)

  const handle_restart = () => {
    localStorage.clear()
    history.push("/login")
  }

  return (
    <Nav style={{ "backgroundColor": "lightgray", "display": "flex", "justifyContent": "space-between" }}>
      <div style={{"display": "flex"}}>
        <Nav.Item>
          <Button onClick={handle_restart}>Start Over</Button>
        </Nav.Item>
        &nbsp;
        <Nav.Item>
          <Button onClick={() => {
            dispatch({ type: CHANGE_CLASS, payload: "Titan" })
          }}><img src={'https://www.bungie.net/common/destiny2_content/icons/e78f012b19b5f6c6026c12547895b756.png'} alt='titan logo' style={{ width: '25px' }} /></Button>
        </Nav.Item>
        &nbsp;
        <Nav.Item>
          <Button onClick={() => {
            dispatch({ type: CHANGE_CLASS, payload: "Hunter" })
          }}><img src={'https://www.bungie.net/common/destiny2_content/icons/bfe570eef316e3893589a152af716479.png'} alt='hunter logo' style={{ width: '25px' }} /></Button>
        </Nav.Item>
        &nbsp;
        <Nav.Item>
          <Button onClick={() => {
            dispatch({ type: CHANGE_CLASS, payload: "Warlock" })
          }}><img src={'https://www.bungie.net/common/destiny2_content/icons/08abe62a2664be8c3239e23a80dfea9d.png'} alt='warlock logo' style={{ width: '25px' }} /></Button>
        </Nav.Item>
      </div>
      <div>
        {/* <h3>Destiny Armor Evaluator</h3> */}
      </div>
      {/* &nbsp; */}
      <div>
        <Nav.Item>
          <Nav.Link href="/populate">Refresh Gear</Nav.Link>
        </Nav.Item>
      </div>
    </Nav>
  )
}

export default Navigation

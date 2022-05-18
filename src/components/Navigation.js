import React from 'react'
import { useHistory } from "react-router-dom"
import {
  useStore,
  // SET_SHOW_CLASS_BUTTONS 
} from '../store/store'
import { Nav, Button } from "react-bootstrap"

const Navigation = () => {
  const history = useHistory()
  // const dispatch = useStore((state) => state.dispatch)
  const showClassButtons = useStore(state => state.showClassButtons)
  const characterClasses = useStore(state => state.characterClasses)

  // const handleRestart = () => {
  //   localStorage.clear()
  //   dispatch({ type: SET_SHOW_CLASS_BUTTONS, payload: false })
  //   history.push("/login")
  // }

  return (
    <Nav style={{ "backgroundColor": "lightgray", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "height": "5vh" }}>
      <div style={{ "display": "flex" }}>
        {/* <Nav.Item>
          <Button onClick={handleRestart}>Start Over</Button>
        </Nav.Item> */}
        &nbsp;
        {
          (showClassButtons && characterClasses.includes("Titan")) &&
          <Nav.Item>
            <Button onClick={() => {
              history.push('/evaluate/Titan')
            }}><img src={'https://www.bungie.net/common/destiny2_content/icons/e78f012b19b5f6c6026c12547895b756.png'} alt='titan logo' style={{ width: '25px' }} /> Titan</Button>
            &nbsp;
          </Nav.Item>
        }
        {
          (showClassButtons && characterClasses.includes("Hunter")) &&
          <Nav.Item>
            <Button onClick={() => {
              history.push('/evaluate/Hunter')
            }}><img src={'https://www.bungie.net/common/destiny2_content/icons/bfe570eef316e3893589a152af716479.png'} alt='hunter logo' style={{ width: '25px' }} /> Hunter</Button>
            &nbsp;
          </Nav.Item>
        }
        {
          (showClassButtons && characterClasses.includes("Warlock")) &&
          <Nav.Item>
            <Button onClick={() => {
              history.push('/evaluate/Warlock')
            }}><img src={'https://www.bungie.net/common/destiny2_content/icons/08abe62a2664be8c3239e23a80dfea9d.png'} alt='warlock logo' style={{ width: '25px' }} /> Warlock</Button>
          </Nav.Item>
        }
      </div>
      <div>
        {
          showClassButtons &&
          <Nav.Item>
            <Button onClick={() => history.push('/refresh')}>Refresh Gear</Button>
            &nbsp;
          </Nav.Item>
        }
      </div>
    </Nav>
  )
}

export default Navigation

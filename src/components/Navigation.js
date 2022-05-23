import React from 'react'
import { useNavigate } from "react-router-dom"
import { useStore, actions } from '../store/store'
import ClassButton from './ClassButton'
import { Nav, Button } from "react-bootstrap"

const Navigation = () => {
  const navigate = useNavigate()
  const dispatch = useStore(state => state.dispatch)
  const showClassButtons = useStore(state => state.helpers.showClassButtons)
  const characterClasses = useStore(state => state.characterInformation.characterClasses)

  const handleLogout = () => {
    dispatch({ type: actions.setError, payload: { type: "success", message: "You've successfully logged out." } })
    navigate("/login")
  }

  const handleRefresh = () => {
    dispatch({ type: actions.setShowClassButtons, payload: false })
    navigate('/populate-user')
  }

  return (
    <Nav style={{ "backgroundColor": "lightgray", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "height": "5vh" }}>
      <div style={{ "display": "flex" }}>
        &nbsp;
        {
          showClassButtons &&
          characterClasses
            .filter((item, index) => characterClasses.indexOf(item) === index)
            .map(classType => {
              return <ClassButton key={classType} classType={classType} />
            })
        }
      </div>
      <div>
        {
          showClassButtons &&
          <Nav.Item>
            <Button onClick={handleRefresh}>Refresh Gear</Button>
            &nbsp;
            <Button onClick={handleLogout}>Logout</Button>
            &nbsp;
          </Nav.Item>
        }
      </div>
    </Nav>
  )
}

export default Navigation

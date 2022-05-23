import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Nav, Button } from 'react-bootstrap'

function ClassButton(props) {
  const navigate = useNavigate()
  const classIcons = {
    Titan: "https://www.bungie.net/common/destiny2_content/icons/e78f012b19b5f6c6026c12547895b756.png",
    Hunter: "https://www.bungie.net/common/destiny2_content/icons/bfe570eef316e3893589a152af716479.png",
    Warlock: "https://www.bungie.net/common/destiny2_content/icons/08abe62a2664be8c3239e23a80dfea9d.png"
  }

  const handleClick = () => {
    navigate(`/evaluate/${props.classType}`)
  }

  return (
    <Nav.Item>
      <Button onClick={handleClick}>
        <img
          src={classIcons[props.classType]}
          alt='titan logo'
          style={{ width: '25px' }}
        />
        {props.classType}
      </Button>
      &nbsp;
    </Nav.Item>
  )
}

export default ClassButton
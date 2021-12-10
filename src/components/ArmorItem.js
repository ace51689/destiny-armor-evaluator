import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { Card } from "react-bootstrap"
import CustomDisplay from './CustomDisplay'
import "./ArmorItem.css"

const ArmorItem = (props) => {
  const [check, setCheck] = useState(false)
  const [display, setDisplay] = useState(true)

  const handleChange = (e) => {
    setCheck(!e.target.value)
  }

  return (
    display ?
      <li>
        <Card>
          <Card.Header>
            <Link to={"/evaluate/" + props.item.itemHash}>
              <Card.Img style={{ width: "90px" }} src={"https://www.bungie.net" + props.item.icon} alt="" />
            </Link>
          </Card.Header>
          <Card.Body>
            Name: <Link to={"/evaluate/" + props.item.itemHash}>{props.item.name}</Link>
            <br />
            Power Level: {props.item.powerLevel}
            <br />
            Type: {props.item.itemSubType}
            <br />
            Affinity: {props.item.energyType}
            <br />
            Energy: {props.item.energyCapacity}

          </Card.Body>
          <Card.Body>
            {
              props.item.pairedExotics && props.item.pairedExotics.filter((exotic) => {
                if (exotic.toLowerCase().includes(props.specific)) {
                  return exotic
                }
                return false
              }).map((exotic) => {
                return <div key={exotic}>{exotic} <input onChange={handleChange} type="checkbox" value={check} /></div>
              })
            }
          </Card.Body>
          <Card.Body>
            <CustomDisplay item={props.item} evalType={props.evalType} userTier={props.userTier} specific={props.specific} />
          </Card.Body>
          <Card.Body className="resize">
            <button onClick={() => setDisplay(!display)}>-</button>
          </Card.Body>
        </Card>
      </li>
      :
      <li>
        <Card>
          <Card.Body>Name: <Link to={"/evaluate/" + props.item.itemHash}>{props.item.name}</Link></Card.Body>
          <Card.Body className="resize">
            <button onClick={() => setDisplay(!display)}>+</button>
          </Card.Body>
        </Card>
      </li>
  )
}

export default ArmorItem

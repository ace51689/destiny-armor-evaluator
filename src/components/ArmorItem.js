import React from 'react'
import { Link } from "react-router-dom"
import { Card } from "react-bootstrap"
import CustomDisplay from './CustomDisplay'
import "./ArmorItem.css"

const ArmorItem = (props) => {
  return (
    <li>
      <Card>
        <Card.Header>
          <Link to={"/evaluate/" + props.item.itemHash}>
            <Card.Img style={{ width: "90px" }} src={"https://www.bungie.net" + props.item.icon} alt="" />
          </Link>
        </Card.Header>
        <Card.Body>
          Name: <Link to={"/evaluate/" + props.item.itemHash}>{props.item.name}</Link>
          <br/>
          Power Level: {props.item.powerLevel}
          <br/>
          Type: {props.item.itemSubType}
          <br/>
          Affinity: {props.item.energyType}
          <br/>
          Energy: {props.item.energyCapacity}

        </Card.Body>
        <Card.Body>
          {
            props.item.pairedExotics && props.item.pairedExotics.map((exotic) => {
              return <div key={exotic}>{exotic}</div>
            })
          }
        </Card.Body>
        <Card.Body>
          <CustomDisplay item={props.item} evalType={props.evalType} userTier={props.userTier} />
        </Card.Body>
      </Card>
    </li>
  )
}

export default ArmorItem

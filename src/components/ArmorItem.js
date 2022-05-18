import React from 'react'
// import { Link } from "react-router-dom"
import { Card } from "react-bootstrap"
import CustomDisplay from './CustomDisplay'
import "./ArmorItem.css"

const ArmorItem = (props) => {
  let armorIcon
  if (props.item.ornament !== false) {
    armorIcon = props.item.ornament
  } else {
    armorIcon = props.item.icon
  }

  return (
    <li>
      <Card>
        <Card.Header>
          {/* <Link to={"/evaluate/" + props.item.itemHash}> */}
            <Card.Img style={{ width: "90px" }} src={"https://www.bungie.net" + armorIcon} alt="" />
          {/* </Link> */}
        </Card.Header>
        <Card.Body id='item-info'>
          {props.item.name}
          <br />
          Power Level: {props.item.powerLevel}
          <br />
          {
            props.item.owned ?
              <>
                Affinity: {props.item.energyType}
                <br />
                Energy: {props.item.energyCapacity}
              </>
              :
              <>
                Vendor: {props.item.vendor}
              </>
          }

        </Card.Body>
        {
          props.item.itemTier === "Legendary" &&
          <Card.Body id='loadouts'>
            <CustomDisplay item={props.item} evalType={props.evalType} userTier={props.userTier} specific={props.specific} />
          </Card.Body>
        }
      </Card>
    </li>
  )
}

export default ArmorItem

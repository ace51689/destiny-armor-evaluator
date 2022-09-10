import React from 'react'
import { Card } from "react-bootstrap"
import CustomDisplay from './CustomDisplay'
import "./ArmorItem.css"

const ArmorItem = ({ item }) => {
  let armorIcon
  if (item.ornament !== false) {
    armorIcon = item.ornament
  } else {
    armorIcon = item.icon
  }

  return (
    <li>
      <Card>
        <Card.Header>
          <Card.Img style={{ width: "90px" }} src={"https://www.bungie.net" + armorIcon} alt="" />
        </Card.Header>
        <Card.Body id='item-info'>
          {item.name}
          <br />
          Power Level: {item.powerLevel}
          <br />
          {
            item.owned ?
              <>
                Affinity: {item.energyType}
                <br />
                Energy: {item.energyCapacity}
              </>
              :
              <>
                Vendor: {item.vendor}
              </>
          }

        </Card.Body>
        {/* {
          item.itemTier === "Legendary" && */}
          <Card.Body id='loadouts'>
            <CustomDisplay item={item} />
          </Card.Body>
        {/* } */}
      </Card>
    </li>
  )
}

export default ArmorItem

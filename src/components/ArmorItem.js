import React from 'react'
import { Link } from "react-router-dom"
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
    // display ?
    <li>
      <Card>
        <Card.Header>
          <Link to={"/evaluate/" + props.item.itemHash}>
            <Card.Img style={{ width: "90px" }} src={"https://www.bungie.net" + armorIcon} alt="" />
          </Link>
        </Card.Header>
        <Card.Body id='item-info'>
          Name: <Link to={"/evaluate/" + props.item.itemHash}>{props.item.name}</Link>
          <br />
          Power Level: {props.item.powerLevel}
          <br />
          Type: {props.item.itemSubType}
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
        {/* <Card.Body>
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
          </Card.Body> */}
        <Card.Body id='loadouts'>
          <CustomDisplay item={props.item} evalType={props.evalType} userTier={props.userTier} specific={props.specific} />
        </Card.Body>
        {/* <Card.Body className="resize">
            <button onClick={() => setDisplay(!display)}>-</button>
          </Card.Body> */}
      </Card>
    </li>
    // :
    // <li>
    //   <Card>
    //     <Card.Body>Name: <Link to={"/evaluate/" + props.item.itemHash}>{props.item.name}</Link></Card.Body>
    //     <Card.Body className="resize">
    //       <button onClick={() => setDisplay(!display)}>+</button>
    //     </Card.Body>
    //   </Card>
    // </li>
  )
}

export default ArmorItem

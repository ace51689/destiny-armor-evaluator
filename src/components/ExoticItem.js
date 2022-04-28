import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ArmorItem from './ArmorItem'

function ExoticItem(props) {
  const listStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    // flexWrap: "wrap",
    width: "95vw",
    maxWidth: "100%",
    marginBottom: "2vh",
    // overflow: "hidden"
  }

  const baseStyle = {
    width: "20vw",
    maxWidth: "45vw",
    height: "20vh",
    maxHeight: "20vh",
  }
  
  const cardStyle = {
    width: "20vw",
    maxWidth: "45vw",
    height: "20vh",
    maxHeight: "20vh",  
  }

  const imageStyle = {
    width: "90%",
  }

  return (
    <ul style={listStyle} key={props.item[0].itemHash}>
      {
        props.item && props.item.map(exotic => {
          let armorIcon
          if (exotic.ornament !== false) {
            armorIcon = exotic.ornament
          } else {
            armorIcon = exotic.icon
          }

          const key = (exotic) => {
            if (exotic.itemInstanceId !== undefined) {
              return exotic.itemInstanceId
            }
            else {
              return exotic.itemHash
            }
          }


          return <li
            key={key(exotic)}
            style={baseStyle}
          >
            {/* <ArmorItem
              item={exotic}
            /> */}

            <Card style={cardStyle}>
              <Card.Header>
                <Link to={"/evaluate/" + exotic.itemHash}>
                  <Card.Img style={imageStyle} src={"https://www.bungie.net" + armorIcon} alt="" />
                </Link>
              </Card.Header>
              <Card.Body id='item-info'>
                Name: <Link to={"/evaluate/" + exotic.itemHash}>{exotic.name}</Link>
                <br />
                Power Level: {exotic.powerLevel}
                <br />
                Type: {exotic.itemSubType}
                <br />
                {
                  exotic.owned ?
                    <>
                      Affinity: {exotic.energyType}
                      <br />
                      Energy: {exotic.energyCapacity}
                    </>
                    :
                    <>
                      Vendor: {exotic.vendor}
                    </>
                }

              </Card.Body>
            </Card>
          </li>
        })
      }
    </ul>
  )
}

export default ExoticItem
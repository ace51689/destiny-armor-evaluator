import React from 'react'
import { Card } from 'react-bootstrap'

function ExoticItem({ item }) {

  const listStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "95vw",
    maxWidth: "100%",
    marginBottom: "2vh",
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

  const keepStyle = {
    width: "20vw",
    maxWidth: "45vw",
    height: "20vh",
    maxHeight: "20vh",
    backgroundColor: "lightgreen"
  }

  return (
    <ul style={listStyle} key={item[0].itemHash}>
      {
        item && item.map(exotic => {
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
            <Card style={
              exotic.counter > 0 ?
                keepStyle
                :
                cardStyle
            }>
              <Card.Header>
                <Card.Img style={imageStyle} src={"https://www.bungie.net" + armorIcon} alt="" />
              </Card.Header>
              <Card.Body id='item-info'>
                {exotic.name}
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
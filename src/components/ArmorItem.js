import React from 'react'
import { Link } from "react-router-dom"

const ArmorItem = (props) => {
  // console.log(props)
  return (
    <li>
      <div>Type: {props.itemSubType}</div>
      <div>Name: {props.name}</div>
      <Link to={"/evaluate/" + props.itemHash}>
        <img src={"https://www.bungie.net" + props.icon} alt="" />
      </Link>
    </li>
  )
}

export default ArmorItem

import React from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

const ArmorToggleBar = (props) => {

  return (
    <div>
      <ToggleButton
        type="checkbox"
        variant="secondary"
        checked={props.exotic}
        value="1"
        onChange={props.toggleExotic}
      >
        Exotic
      </ToggleButton>
      <ToggleButtonGroup type="radio" name="armorTypes" value={props.armorType} onChange={props.changeArmor}>
        <ToggleButton value={1}>Helmets</ToggleButton>
        <ToggleButton value={2}>Gauntlets</ToggleButton>
        <ToggleButton value={3}>Chest Armor</ToggleButton>
        <ToggleButton value={4}>Leg Armor</ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}

export default ArmorToggleBar

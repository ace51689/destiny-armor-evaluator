import React from 'react'
import { ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap'

const ArmorToggleBar = (props) => {

  return (
    <div className="armor-toggle-bar">
      {
        props.hasExoticDupes ?
          <ToggleButton
            type="checkbox"
            variant="secondary"
            checked={props.exotic}
            value="1"
            onChange={props.toggleExotic}
          >
            Exotic
          </ToggleButton>
          :
          <ToggleButton
            disabled
            type="checkbox"
            variant="secondary"
            checked={props.exotic}
            value="1"
            onChange={props.toggleExotic}
          >
            Exotic
          </ToggleButton>
      }
      <ToggleButtonGroup type="radio" name="armorTypes" value={props.armorType} onChange={props.changeArmor}>
        <ToggleButton value={1}>Helmets</ToggleButton>
        <ToggleButton value={2}>Gauntlets</ToggleButton>
        <ToggleButton value={3}>Chest Armor</ToggleButton>
        <ToggleButton value={4}>Leg Armor</ToggleButton>
      </ToggleButtonGroup>
      &nbsp;
      <ToggleButton
        type="checkbox"
        variant="secondary"
        checked={props.showKeeps}
        value="1"
        onChange={props.toggleKeeps}
      >
        &nbsp;Keeps
      </ToggleButton>
      &nbsp;
      <ToggleButton
        type="checkbox"
        variant="secondary"
        checked={props.showJunks}
        value="1"
        onChange={props.toggleJunks}
      >
        &nbsp;Junks
      </ToggleButton>
      &nbsp;
      <ToggleButton
        type="checkbox"
        variant="secondary"
        checked={props.showVendor}
        value="1"
        onChange={props.toggleVendor}
      >
        &nbsp;Vendor
      </ToggleButton>
      &nbsp;
      <Button variant="success" onClick={props.evaluateArmor}>Evaluate Loadouts</Button>

    </div>
  )
}

export default ArmorToggleBar

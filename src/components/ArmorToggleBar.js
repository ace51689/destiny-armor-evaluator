import React from 'react'
import BooleanButton from './BooleanButton'
import { Button, ButtonGroup } from 'react-bootstrap'

const ArmorToggleBar = (props) => {

  const changeArmor = (e) => {
    props.changeArmor(parseInt(e.target.value))
  }

  const onStyle = {
    color: "#fff",
    backgroundColor: "#0d6efd",
    borderColor: "#0d6efd",
    boxShadow: 'none'
  }

  const offStyle = {
    color: "#0d6efd",
    backgroundColor: "#fff",
    borderColor: "#0d6efd",
    boxShadow: 'none'
  }

  return (
    <div className="armor-toggle-bar">
      {
        props.hasExoticDupes ?
          <BooleanButton
            buttonText=" Test Duplicate Exotics"
            booleanType={props.exotic}
            toggleFunction={props.toggleExotic}
            color='#565e64'
            title="Toggle to show or hide duplicate exotics."
          />
          :
          <BooleanButton
            buttonText="No Duplicate Exotics"
            booleanType={props.exotic}
            toggleFunction={props.toggleExotic}
            color='#adb5bd'
            title="No duplicate exotics found."
            disabled
          />
      }
      &nbsp;
      <ButtonGroup type="checkbox" name="armorTypes" value={props.armorType}>
        <Button value={1} style={props.armorType === 1 ? onStyle : offStyle} onClick={changeArmor}>Helmets</Button>
        <Button value={2} style={props.armorType === 2 ? onStyle : offStyle} onClick={changeArmor}>Gauntlets</Button>
        <Button value={3} style={props.armorType === 3 ? onStyle : offStyle} onClick={changeArmor}>Chest Armor</Button>
        <Button value={4} style={props.armorType === 4 ? onStyle : offStyle} onClick={changeArmor}>Leg Armor</Button>
      </ButtonGroup>
      &nbsp;
      <BooleanButton
        buttonText="Keeps"
        booleanType={props.showKeeps}
        toggleFunction={props.toggleKeeps}
        color="#565e64"
        title="Toggle to show or hide armor to keep."
      />
      &nbsp;
      <BooleanButton
        buttonText="Junks"
        booleanType={props.showJunks}
        toggleFunction={props.toggleJunks}
        color="#565e64"
        title="Toggle to show or hide armor to dismantle."
      />
      &nbsp;
      <BooleanButton
        buttonText="Vendor"
        booleanType={props.showVendor}
        toggleFunction={props.toggleVendor}
        color="#565e64"
        title="Toggle to show or hide vendor armor."
      />
      &nbsp;
      <Button
        variant="success"
        onClick={props.evaluateArmor}
        title="Click to evaluate armor based on the inputs below."
      >Evaluate Loadouts
      </Button>

    </div>
  )
}

export default ArmorToggleBar

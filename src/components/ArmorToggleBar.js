import React from 'react'
import BooleanButton from './BooleanButton'
import { Button, ButtonGroup } from 'react-bootstrap'

const ArmorToggleBar = ({
  changeArmor,
  hasExotics,
  exotic,
  toggleExotic,
  armorType,
  showDuplicates,
  setShowDuplicates,
  showKeeps,
  toggleKeeps,
  showJunks,
  toggleJunks,
  showVendor,
  toggleVendor,
  evaluateArmor,
  hasDupes,
  xur,
  ignoreXur,
  setIgnoreXur
}) => {

  const handleChangeArmor = (e) => {
    changeArmor(e.target.value)
  }

  const handleToggleExotic = () => {
    if (exotic) {
      setShowDuplicates(false)
      toggleExotic(false)
    }
    else {
      toggleExotic(true)
    }
    toggleKeeps(true)
    toggleJunks(true)
    toggleVendor(true)
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
        hasExotics ?
          <BooleanButton
            buttonText="Exotic"
            booleanType={exotic}
            toggleFunction={handleToggleExotic}
            color='#daa520'
            title="Toggle to switch display to exotic armor."
          />
          :
          <BooleanButton
            buttonText="Exotic"
            booleanType={exotic}
            toggleFunction={handleToggleExotic}
            color='#adb5bd'
            title="No exotic armor found for this class."
            disabled
          />
      }
      &nbsp;
      <ButtonGroup type="checkbox" name="armorTypes" value={armorType}>
        <Button value="helmets" style={armorType === "helmets" ? onStyle : offStyle} onClick={handleChangeArmor}>Helmets</Button>
        <Button value="gauntlets" style={armorType === "gauntlets" ? onStyle : offStyle} onClick={handleChangeArmor}>Gauntlets</Button>
        <Button value="chests" style={armorType === "chests" ? onStyle : offStyle} onClick={handleChangeArmor}>Chest Armor</Button>
        <Button value="legs" style={armorType === "legs" ? onStyle : offStyle} onClick={handleChangeArmor}>Leg Armor</Button>
      </ButtonGroup>
      &nbsp;
      {
        !exotic &&
        <BooleanButton
          buttonText="Keeps"
          booleanType={showKeeps}
          toggleFunction={toggleKeeps}
          color="#565e64"
          title="Toggle to show or hide armor to keep."
        />
      }
      {
        (exotic && hasDupes) &&
        <BooleanButton
          buttonText="Duplicates"
          booleanType={showDuplicates}
          toggleFunction={setShowDuplicates}
          color="#565e64"
          title="Toggle to show or hide duplicate exotics."
        />
      }
      {
        (exotic && !hasDupes) &&
        <BooleanButton
          buttonText="Duplicates"
          booleanType={showDuplicates}
          toggleFunction={setShowDuplicates}
          color="#6c757d"
          title="No duplicate exotics found."
          disabled
        />
      }
      &nbsp;
      {
        !exotic &&
        <BooleanButton
          buttonText="Junks"
          booleanType={showJunks}
          toggleFunction={toggleJunks}
          color="#565e64"
          title="Toggle to show or hide armor to dismantle."
        />
      }
      &nbsp;
      <BooleanButton
        buttonText="Vendor"
        booleanType={showVendor}
        toggleFunction={toggleVendor}
        color="#565e64"
        title="Toggle to show or hide vendor armor."
      />
      &nbsp;
      <Button
        variant="success"
        onClick={evaluateArmor}
        title="Click to evaluate armor based on the inputs below."
      >Evaluate Loadouts
      </Button>
    &nbsp;
      {
        xur &&
        <BooleanButton
            buttonText={"Ignore Xur Exotics"}
            booleanType={ignoreXur}
            toggleFunction={setIgnoreXur}
            color="#b22222"
            title="Some text we'll figure out later"
        />
      }

    </div>
  )
}

export default ArmorToggleBar

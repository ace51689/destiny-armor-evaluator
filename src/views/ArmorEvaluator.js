import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../store/store'
import ArmorToggleBar from '../components/ArmorToggleBar'
import SelectableStatGroup from '../components/SelectableStatGroup'
// import ExoticDupeEvaluation from '../evaluationFunctions/ExoticDupeEvaluation'
import LegendaryArmorEvaluation from '../evaluationFunctions/LegendaryArmorEvaluation'
import ArmorList from '../components/ArmorList'
import "./ArmorEvaluator.css"


const ArmorEvaluator = () => {
  const userArmor = useStore((state) => state.userArmor)
  const vendorArmor = useStore(state => state.vendorArmor)
  const location = useLocation()
  const playerClass = location.pathname.replace('/evaluate/', '')
  const error = useStore(state => state.helpers.error)
  const [armorType, setArmorType] = useState("helmets")
  const [helmets, setHelmets] = useState([])
  const [exoticHelmets, setExoticHelmets] = useState([])
  const [dupeHelmets, setDupeHelmets] = useState([])
  const [gauntlets, setGauntlets] = useState([])
  const [exoticGauntlets, setExoticGauntlets] = useState([])
  const [dupeGauntlets, setDupeGauntlets] = useState([])
  const [chests, setChests] = useState([])
  const [exoticChests, setExoticChests] = useState([])
  const [dupeChests, setDupeChests] = useState([])
  const [legs, setLegs] = useState([])
  const [exoticLegs, setExoticLegs] = useState([])
  const [dupeLegs, setDupeLegs] = useState([])
  const [noLoadouts, setNoLoadouts] = useState([])
  const [exotic, setExotic] = useState(false)
  const [showDuplicates, setShowDuplicates] = useState(false)
  const [showVendor, setShowVendor] = useState(true)
  const [showKeeps, setShowKeeps] = useState(true)
  const [showJunks, setShowJunks] = useState(true)
  // const [hasExoticDupes, setHasExoticDupes] = useState(true)
  const [hasExotics, setHasExotics] = useState(true)
  const [xur, setXur] = useState(false)
  const [ignoreXur, setIgnoreXur] = useState(false)
  const [hasDupes, setHasDupes] = useState(false)
  const [userInput, setUserInput] = useState({
    totalTier: 30,
    topStat: {
      type: "recovery",
      value: 1
    },
    bottomStat: {
      type: "intellect",
      value: 1
    },
    tieBreakOne: "discipline",
    tieBreakTwo: "resilience",
    ignoreXur: true
  })

  useEffect(() => {
    setShowDuplicates(false)

    if (vendorArmor.some(item => item.vendor === "Xur")) {
      setXur(true)
    }

    const masterArray = [...userArmor, ...vendorArmor]

    const legendaryHelmets = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Legendary")
      .filter(armor => armor.itemSubType === "Helmet")
      .sort((a, b) => b.baseStats.total - a.baseStats.total)

    const legendaryGauntlets = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Legendary")
      .filter(armor => armor.itemSubType === "Gauntlets")
      .sort((a, b) => b.baseStats.total - a.baseStats.total)

    const legendaryChests = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Legendary")
      .filter(armor => armor.itemSubType === "Chest Armor")
      .sort((a, b) => b.baseStats.total - a.baseStats.total)

    const legendaryLegs = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Legendary")
      .filter(armor => armor.itemSubType === "Leg Armor")
      .sort((a, b) => b.baseStats.total - a.baseStats.total)

    setHelmets(legendaryHelmets)
    setGauntlets(legendaryGauntlets)
    setChests(legendaryChests)
    setLegs(legendaryLegs)

    const exoticHelmets = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")
      .filter(armor => armor.itemSubType === "Helmet")
      .sort((a, b) => b.baseStats.total - a.baseStats.total)

    const exoticGauntlets = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")
      .filter(armor => armor.itemSubType === "Gauntlets")
      .sort((a, b) => b.baseStats.total - a.baseStats.total)

    const exoticChests = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")
      .filter(armor => armor.itemSubType === "Chest Armor")
      .sort((a, b) => b.baseStats.total - a.baseStats.total)

    const exoticLegs = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")
      .filter(armor => armor.itemSubType === "Leg Armor")
      .sort((a, b) => b.baseStats.total - a.baseStats.total)

    const exoticHashes = masterArray
                        .filter(armor => armor.itemTier === "Exotic")
                        .map(armor => armor.itemHash)

    const dupeHashes = exoticHashes.filter((item, index) => exoticHashes.indexOf(item) !== index)

    if (dupeHashes.length !== 0) {
      setHasDupes(true)
    }

    const findingExoticDupes = (exoticArray) => {
      const dupeExoticArray = []
      const exoticHashes = exoticArray.map(item => item.itemHash)
      const dupeHashes = exoticHashes.filter((item, index) => exoticHashes.indexOf(item) !== index)
      const dupeExotics = exoticArray.filter(item => dupeHashes.includes(item.itemHash)).sort((a, b) => a.itemHash - b.itemHash)
      dupeHashes.forEach(hash => {
        const dupeArray = []
        dupeExotics.forEach(dupe => {
          if (hash === dupe.itemHash) {
            dupeArray.push(dupe)
          }
        })
        dupeExoticArray.push(dupeArray)
      })
      return dupeExoticArray
    }

    setDupeHelmets(findingExoticDupes(exoticHelmets))
    setDupeGauntlets(findingExoticDupes(exoticGauntlets))
    setDupeChests(findingExoticDupes(exoticChests))
    setDupeLegs(findingExoticDupes(exoticLegs))

    // if (!dupeHelmets && !dupeGauntlets && !dupeChests && !dupeLegs) {
    //   setHasExoticDupes(false)
    // }
    // else {
    //   setHasExoticDupes(true)
    // }

    setExoticHelmets(exoticHelmets)
    setExoticGauntlets(exoticGauntlets)
    setExoticChests(exoticChests)
    setExoticLegs(exoticLegs)

    const exoticArmor = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")

    if (exoticArmor.length === 0) {
      setHasExotics(false)
    }

    setExotic(false)
    setArmorType("helmets")
    setShowKeeps(true)
    setShowJunks(true)
    setShowVendor(true)

  },
    [userArmor, vendorArmor, setHelmets, setGauntlets, setChests, setLegs, playerClass]
  )

  const evaluateArmor = () => {
    LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, setExoticHelmets, gauntlets, exoticGauntlets, setGauntlets, setExoticGauntlets, chests, exoticChests, setChests, setExoticChests, legs, exoticLegs, setLegs, setExoticLegs, userInput, setNoLoadouts, ignoreXur)
  }

  const determineArmorType = (armorType) => {
    switch (armorType) {
      case "helmets":
        return exotic ? exoticHelmets : helmets
      case "gauntlets":
        return exotic ? exoticGauntlets : gauntlets
      case "chests":
        return exotic ? exoticChests : chests
      case "legs":
        return exotic ? exoticLegs : legs
      default:
        return false
    }
  }

  return (
    <div>
      {
        error.type === "error" && <div style={{ color: "red" }}>{error.message}</div>
      }
      <ArmorToggleBar
        exotic={exotic}
        showDuplicates={showDuplicates}
        setShowDuplicates={setShowDuplicates}
        toggleExotic={setExotic}
        showVendor={showVendor}
        toggleVendor={setShowVendor}
        armorType={armorType}
        changeArmor={setArmorType}
        evaluateArmor={evaluateArmor}
        showKeeps={showKeeps}
        toggleKeeps={setShowKeeps}
        showJunks={showJunks}
        toggleJunks={setShowJunks}
        hasExotics={hasExotics}
        hasDupes={hasDupes}
        xur={xur}
        ignoreXur={ignoreXur}
        setIgnoreXur={setIgnoreXur}
      />
      <SelectableStatGroup
        evaluateArmor={evaluateArmor}
        userInput={userInput}
        setUserInput={setUserInput}
      />
      <div className='no-loadouts-display'>
        {(noLoadouts && noLoadouts.length > 0) && <div>No Applicable Loadouts for:</div>}
        &nbsp;
        {
          noLoadouts && noLoadouts.map((exotic) => {
            return <div id='unused-exotic' key={exotic.itemInstanceId}>
              {exotic}
            </div>
          })
        }
      </div>
      <ArmorList
        chosen={determineArmorType(armorType)}
        showVendor={showVendor}
        showKeeps={showKeeps}
        showJunks={showJunks}
        exotic={exotic}
        showDuplicates={showDuplicates}
      />
    </div>
  )
}

export default ArmorEvaluator

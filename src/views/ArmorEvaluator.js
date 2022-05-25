import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../store/store'
import "./ArmorEvaluator.css"
import EvaluationInterface from '../components/EvaluationInterface'
import { ExoticDupeEvaluation } from '../evaluationFunctions/ExoticDupeEvaluation'
import LegendaryArmorEvaluation from '../evaluationFunctions/LegendaryArmorEvaluation'


const ArmorEvaluator = (props) => {
  const userArmor = useStore((state) => state.userArmor)
  const vendorArmor = useStore(state => state.vendorArmor)
  const location = useLocation()
  const playerClass = location.pathname.replace('/evaluate/', '')
  const [exotic, setExotic] = useState(false)
  const [armorType, setArmorType] = useState(1)
  const [evalType, setEvalType] = useState(3)
  const [helmets, setHelmets] = useState([])
  const [exoticHelmets, setExoticHelmets] = useState([])
  const [gauntlets, setGauntlets] = useState([])
  const [exoticGauntlets, setExoticGauntlets] = useState([])
  const [chests, setChests] = useState([])
  const [exoticChests, setExoticChests] = useState([])
  const [legs, setLegs] = useState([])
  const [exoticLegs, setExoticLegs] = useState([])
  const [dupeHelmets, setDupeHelmets] = useState([])
  const [dupeGauntlets, setDupeGauntlets] = useState([])
  const [dupeChests, setDupeChests] = useState([])
  const [dupeLegs, setDupeLegs] = useState([])
  const [noLoadouts, setNoLoadouts] = useState([])
  const [showVendor, setShowVendor] = useState(true)
  const [showKeeps, setShowKeeps] = useState(true)
  const [showJunks, setShowJunks] = useState(true)
  const [hasExoticDupes, setHasExoticDupes] = useState(true)
  const [userTier, setUserTier] = useState({
    totalTier: 30,
    mobility: 1,
    resilience: 1,
    recovery: 1,
    discipline: 1,
    intellect: 1,
    strength: 1,
    average: 10
  })

  useEffect(() => {
    const masterArray = [...userArmor, ...vendorArmor]

    const legendaryHelmets = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Legendary")
      .filter(armor => armor.itemSubType === "Helmet")
      .sort((a, b) => (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery))

    const legendaryGauntlets = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Legendary")
      .filter(armor => armor.itemSubType === "Gauntlets")
      .sort((a, b) => (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery))

    const legendaryChests = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Legendary")
      .filter(armor => armor.itemSubType === "Chest Armor")
      .sort((a, b) => (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery))

    const legendaryLegs = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Legendary")
      .filter(armor => armor.itemSubType === "Leg Armor")
      .sort((a, b) => (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery))

    setHelmets(legendaryHelmets)
    setGauntlets(legendaryGauntlets)
    setChests(legendaryChests)
    setLegs(legendaryLegs)

    const exoticHelmets = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")
      .filter(armor => armor.itemSubType === "Helmet")
      .sort((a, b) => (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery))

    const exoticGauntlets = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")
      .filter(armor => armor.itemSubType === "Gauntlets")
      .sort((a, b) => (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery))

    const exoticChests = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")
      .filter(armor => armor.itemSubType === "Chest Armor")
      .sort((a, b) => (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery))

    const exoticLegs = masterArray.filter(armor => armor.equippableBy === playerClass)
      .filter(armor => armor.itemTier === "Exotic")
      .filter(armor => armor.itemSubType === "Leg Armor")
      .sort((a, b) => (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery))

    const findExoticDupes = (exoticArray) => {
      const exoticHashes = []
      const dupeExoticHashes = []

      exoticArray.forEach(item => {
        if (exoticHashes.includes(item.itemHash) && !dupeExoticHashes.includes(item.itemHash)) {
          dupeExoticHashes.push(item.itemHash)
        }
        else {
          exoticHashes.push(item.itemHash)
        }
      })

      if (dupeExoticHashes.length === 0) {
        return false
      }

      const dupeExotics = []
      dupeExoticHashes.forEach(dupe => {
        const dupes = exoticArray.filter(item => item.itemHash === dupe)
        dupeExotics.push(dupes)
      })

      return dupeExotics
    }

    //WERE ON TO SOMETHING HERE-----------------------------------------------------------------------------------
    // const findingExoticDupes = (exoticArray) => {
    //   const exoticHashes = exoticArray.map(item => item.itemHash)
    //   const dupeHashes = exoticHashes.filter((item, index) => exoticHashes.indexOf(item) !== index)
    //   return exoticArray.filter(item => dupeHashes.includes(item.itemHash))
    // }

    // const dupeExoticHelms = findingExoticDupes(exoticHelmets)
    // console.log(dupeExoticHelms)
    //------------------------------------------------------------------------------------------------------------

    const dupeExoticHelmets = findExoticDupes(exoticHelmets)
    const dupeExoticGauntlets = findExoticDupes(exoticGauntlets)
    const dupeExoticChests = findExoticDupes(exoticChests)
    const dupeExoticLegs = findExoticDupes(exoticLegs)

    setDupeHelmets(dupeExoticHelmets)
    setDupeGauntlets(dupeExoticGauntlets)
    setDupeChests(dupeExoticChests)
    setDupeLegs(dupeExoticLegs)

    if (!dupeExoticHelmets && !dupeExoticGauntlets && !dupeExoticChests && !dupeExoticLegs) {
      setHasExoticDupes(false)
    }
    else {
      setHasExoticDupes(true)
    }

    setExoticHelmets(exoticHelmets)
    setExoticGauntlets(exoticGauntlets)
    setExoticChests(exoticChests)
    setExoticLegs(exoticLegs)

    setExotic(false)
    setArmorType(1)
    setShowKeeps(true)
    setShowJunks(true)
    setShowVendor(true)

  },
    [userArmor, vendorArmor, setHelmets, setGauntlets, setChests, setLegs, playerClass]
  )

  const handleChange = (e) => {
    setUserTier((state) => ({ ...state, [e.target.name]: parseInt(e.target.value) }))
  }

  const handleEvalType = (val) => {
    setEvalType(val)
  }

  // const handleArmorType = (val) => {
  //   // console.log("clicked")
  //   setArmorType(val)
  // }

  // const handleToggleExotic = (e) => {
  //   setExotic(e.currentTarget.checked)
  // }

  // const handleToggleVendor = (e) => {
  //   setShowVendor(e.currentTarget.checked)
  // }

  // const handleToggleKeeps = (e) => {
  //   setShowKeeps(e.currentTarget.checked)
  // }

  // const handleToggleJunks = (e) => {
  //   setShowJunks(e.currentTarget.checked)
  // }

  const evaluateArmor = () => {
    switch (armorType) {
      case 1:
        if (exotic) {
          ExoticDupeEvaluation(dupeHelmets, setDupeHelmets, helmets, dupeGauntlets, setDupeGauntlets, gauntlets, dupeChests, setDupeChests, chests, dupeLegs, setDupeLegs, legs, userTier, setNoLoadouts)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 2:
        if (exotic) {
          ExoticDupeEvaluation(dupeHelmets, setDupeHelmets, helmets, dupeGauntlets, setDupeGauntlets, gauntlets, dupeChests, setDupeChests, chests, dupeLegs, setDupeLegs, legs, userTier, setNoLoadouts)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 3:
        if (exotic) {
          ExoticDupeEvaluation(dupeHelmets, setDupeHelmets, helmets, dupeGauntlets, setDupeGauntlets, gauntlets, dupeChests, setDupeChests, chests, dupeLegs, setDupeLegs, legs, userTier, setNoLoadouts)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 4:
        if (exotic) {
          ExoticDupeEvaluation(dupeHelmets, setDupeHelmets, helmets, dupeGauntlets, setDupeGauntlets, gauntlets, dupeChests, setDupeChests, chests, dupeLegs, setDupeLegs, legs, userTier, setNoLoadouts)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      default:
        break;
    }
  }

  switch (armorType) {
    case 1:
      if (exotic) {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={dupeHelmets}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={helmets}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
          />
        )
      }
    case 2:
      if (exotic) {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={dupeGauntlets}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={gauntlets}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
          />
        )
      }
    case 3:
      if (exotic) {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={dupeChests}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={chests}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
          />
        )
      }
    case 4:
      if (exotic) {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={dupeLegs}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={legs}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
          />
        )
      }
    default:
      return (
        <div>
          This is where the buttons will be
        </div>
      )
  }
}

export default ArmorEvaluator

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
    tieBreak: "discipline"
  })

  useEffect(() => {
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

  const handleEvalType = (val) => {
    setEvalType(val)
  }

  const evaluateArmor = () => {
    if (exotic) {
      ExoticDupeEvaluation(dupeHelmets, setDupeHelmets, helmets, dupeGauntlets, setDupeGauntlets, gauntlets, dupeChests, setDupeChests, chests, dupeLegs, setDupeLegs, legs, userInput, setNoLoadouts)
    }
    else {
      LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userInput, setNoLoadouts)
    }
  }

  switch (armorType) {
    case 1:
      if (exotic) {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userInput={userInput}
            chosen={dupeHelmets}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
            setUserInput={setUserInput}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userInput={userInput}
            chosen={helmets}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
            setUserInput={setUserInput}
          />
        )
      }
    case 2:
      if (exotic) {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userInput={userInput}
            chosen={dupeGauntlets}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
            setUserInput={setUserInput}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userInput={userInput}
            chosen={gauntlets}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
            setUserInput={setUserInput}
          />
        )
      }
    case 3:
      if (exotic) {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userInput={userInput}
            chosen={dupeChests}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
            setUserInput={setUserInput}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userInput={userInput}
            chosen={chests}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
            setUserInput={setUserInput}
          />
        )
      }
    case 4:
      if (exotic) {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userInput={userInput}
            chosen={dupeLegs}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
            setUserInput={setUserInput}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            evaluateArmor={evaluateArmor}
            changeArmor={setArmorType}
            toggleExotic={setExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userInput={userInput}
            chosen={legs}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={setShowVendor}
            showKeeps={showKeeps}
            toggleKeeps={setShowKeeps}
            showJunks={showJunks}
            toggleJunks={setShowJunks}
            hasExoticDupes={hasExoticDupes}
            setUserInput={setUserInput}
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

import React, { useState, useEffect } from 'react'
import { useStore } from '../store/store'
import "./ArmorEvaluator.css"
import EvaluationInterface from '../components/EvaluationInterface'
import ExoticLoop from '../evaluationFunctions/ExoticLoop'
import { ExoticDupeEvaluation } from '../evaluationFunctions/ExoticDupeEvaluation'
import LegendaryArmorEvaluation from '../evaluationFunctions/LegendaryArmorEvaluation'


const ArmorEvaluator = () => {
  const userArmor = useStore((state) => state.userArmor)
  const vendorArmor = useStore(state => state.vendorArmor)
  const playerClass = useStore((state) => state.activeClass)
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
    const helmetsArray = []
    const exoticHelmetsArray = []
    const gauntletsArray = []
    const exoticGauntletsArray = []
    const chestsArray = []
    const exoticChestsArray = []
    const legsArray = []
    const exoticLegsArray = []

    const masterArray = [...userArmor, ...vendorArmor]

    masterArray.filter((armor) => {
      if (armor.itemTier === "Legendary") {
        return armor
      }
      return false
    }).filter((armor) => armor.equippableBy === playerClass)
      .forEach((armor) => {
        if (armor.itemSubType === "Helmet") {
          helmetsArray.push(armor)
        }
        if (armor.itemSubType === "Gauntlets") {
          gauntletsArray.push(armor)
        }
        if (armor.itemSubType === "Chest Armor") {
          chestsArray.push(armor)
        }
        if (armor.itemSubType === "Leg Armor") {
          legsArray.push(armor)
        }
      })

    const sortArray = (array) => {
      array.sort((a, b) => {
        return (b.baseStats.intellect + b.baseStats.recovery) - (a.baseStats.intellect + a.baseStats.recovery)
      })
    }

    sortArray(helmetsArray)
    sortArray(gauntletsArray)
    sortArray(chestsArray)
    sortArray(legsArray)

    setHelmets(helmetsArray)
    setGauntlets(gauntletsArray)
    setChests(chestsArray)
    setLegs(legsArray)

    masterArray.filter((armor) => {
      if (armor.itemTier === "Exotic") {
        return armor
      }
      return false
    }).filter((armor) => armor.equippableBy === playerClass)
      .forEach((armor) => {
        if (armor.itemSubType === "Helmet") {
          exoticHelmetsArray.push(armor)
        }
        if (armor.itemSubType === "Gauntlets") {
          exoticGauntletsArray.push(armor)
        }
        if (armor.itemSubType === "Chest Armor") {
          exoticChestsArray.push(armor)
        }
        if (armor.itemSubType === "Leg Armor") {
          exoticLegsArray.push(armor)
        }
      })

    sortArray(exoticHelmetsArray)
    sortArray(exoticGauntletsArray)
    sortArray(exoticChestsArray)
    sortArray(exoticLegsArray)


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

    const dupeExoticHelmets = findExoticDupes(exoticHelmetsArray)
    const dupeExoticGauntlets = findExoticDupes(exoticGauntletsArray)
    const dupeExoticChests = findExoticDupes(exoticChestsArray)
    const dupeExoticLegs = findExoticDupes(exoticLegsArray)

    setDupeHelmets(dupeExoticHelmets)
    setDupeGauntlets(dupeExoticGauntlets)
    setDupeChests(dupeExoticChests)
    setDupeLegs(dupeExoticLegs)

    console.log(dupeExoticGauntlets)

    setExoticHelmets(exoticHelmetsArray)
    setExoticGauntlets(exoticGauntletsArray)
    setExoticChests(exoticChestsArray)
    setExoticLegs(exoticLegsArray)

  }, [userArmor, vendorArmor, setHelmets, setGauntlets, setChests, setLegs, playerClass])

  const handleChange = (e) => {
    setUserTier((state) => ({ ...state, [e.target.name]: parseInt(e.target.value) }))
  }

  const handleEvalType = (val) => {
    setEvalType(val)
  }

  const handleArmorType = (val) => {
    setArmorType(val)
  }

  const handleToggleExotic = (e) => {
    setExotic(e.currentTarget.checked)
  }

  const handleToggleVendor = (e) => {
    setShowVendor(e.currentTarget.checked)
  }

  const handleToggleKeeps = (e) => {
    setShowKeeps(e.currentTarget.checked)
  }

  const handleToggleJunks = (e) => {
    setShowJunks(e.currentTarget.checked)
  }

  const evaluateArmor = () => {
    switch (armorType) {
      case 1:
        if (exotic) {
          ExoticDupeEvaluation(dupeHelmets, setDupeHelmets, gauntlets, chests, legs, userTier, setNoLoadouts)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 2:
        if (exotic) {
          ExoticDupeEvaluation(dupeGauntlets, setDupeGauntlets, helmets, chests, legs, userTier, setNoLoadouts)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 3:
        if (exotic) {
          ExoticDupeEvaluation(dupeChests, setDupeChests, helmets, gauntlets, legs, userTier, setNoLoadouts)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 4:
        if (exotic) {
          ExoticDupeEvaluation(dupeLegs, setDupeLegs, helmets, gauntlets, chests, userTier, setNoLoadouts)
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
            changeArmor={handleArmorType}
            toggleExotic={handleToggleExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={dupeHelmets}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
            showKeeps={showKeeps}
            toggleKeeps={handleToggleKeeps}
            showJunks={showJunks}
            toggleJunks={handleToggleJunks}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={handleArmorType}
            toggleExotic={handleToggleExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={helmets}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
            showKeeps={showKeeps}
            toggleKeeps={handleToggleKeeps}
            showJunks={showJunks}
            toggleJunks={handleToggleJunks}
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
            changeArmor={handleArmorType}
            toggleExotic={handleToggleExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={dupeGauntlets}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
            showKeeps={showKeeps}
            toggleKeeps={handleToggleKeeps}
            showJunks={showJunks}
            toggleJunks={handleToggleJunks}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={handleArmorType}
            toggleExotic={handleToggleExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={gauntlets}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
            showKeeps={showKeeps}
            toggleKeeps={handleToggleKeeps}
            showJunks={showJunks}
            toggleJunks={handleToggleJunks}
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
            changeArmor={handleArmorType}
            toggleExotic={handleToggleExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={dupeChests}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
            showKeeps={showKeeps}
            toggleKeeps={handleToggleKeeps}
            showJunks={showJunks}
            toggleJunks={handleToggleJunks}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={handleArmorType}
            toggleExotic={handleToggleExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={chests}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
            showKeeps={showKeeps}
            toggleKeeps={handleToggleKeeps}
            showJunks={showJunks}
            toggleJunks={handleToggleJunks}
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
            changeArmor={handleArmorType}
            toggleExotic={handleToggleExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={dupeLegs}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
            showKeeps={showKeeps}
            toggleKeeps={handleToggleKeeps}
            showJunks={showJunks}
            toggleJunks={handleToggleJunks}
          />
        )
      }
      else {
        return (
          <EvaluationInterface
            handleEvalType={handleEvalType}
            handleChange={handleChange}
            evaluateArmor={evaluateArmor}
            changeArmor={handleArmorType}
            toggleExotic={handleToggleExotic}
            armorType={armorType}
            exotic={exotic}
            evalType={evalType}
            userTier={userTier}
            chosen={legs}
            noLoadouts={noLoadouts}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
            showKeeps={showKeeps}
            toggleKeeps={handleToggleKeeps}
            showJunks={showJunks}
            toggleJunks={handleToggleJunks}
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

import React, { useState, useEffect } from 'react'
import { useStore } from '../store/store'
import "./ArmorEvaluator.css"
import EvaluationInterface from '../components/EvaluationInterface'
import ExoticLoop from '../evaluationFunctions/ExoticLoop'
import LegendaryArmorEvaluation from '../evaluationFunctions/LegendaryArmorEvaluation'


const ArmorEvaluator = () => {
  const userArmor = useStore((state) => state.userArmor)
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
  const [noLoadouts, setNoLoadouts] = useState([])
  const [showVendor, setShowVendor] = useState(true)
  const [userTier, setUserTier] = useState({
    totalTier: 30,
    mobility: 1,
    resilience: 1,
    recovery: 8,
    discipline: 1,
    intellect: 8,
    strength: 1,
    average: 16
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

    userArmor.filter((armor) => {
      if (armor[1].itemTier === "Legendary") {
        return armor
      }
      return false
    }).forEach((armor) => {
      if (armor[1].itemSubType === "Helmet") {
        helmetsArray.push(armor)
      }
      if (armor[1].itemSubType === "Gauntlets") {
        gauntletsArray.push(armor)
      }
      if (armor[1].itemSubType === "Chest Armor") {
        chestsArray.push(armor)
      }
      if (armor[1].itemSubType === "Leg Armor") {
        legsArray.push(armor)
      }
    })

    const sortArray = (array) => {
      array.sort((a, b) => {
        return (b[1].stats.intellect + b[1].stats.recovery) - (a[1].stats.intellect + a[1].stats.recovery)
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

    userArmor.filter((armor) => {
      if (armor[1].itemTier === "Exotic") {
        return armor
      }
      return false
    }).forEach((armor) => {
      if (armor[1].itemSubType === "Helmet") {
        exoticHelmetsArray.push(armor)
      }
      if (armor[1].itemSubType === "Gauntlets") {
        exoticGauntletsArray.push(armor)
      }
      if (armor[1].itemSubType === "Chest Armor") {
        exoticChestsArray.push(armor)
      }
      if (armor[1].itemSubType === "Leg Armor") {
        exoticLegsArray.push(armor)
      }
    })

    sortArray(exoticHelmetsArray)
    sortArray(exoticGauntletsArray)
    sortArray(exoticChestsArray)
    sortArray(exoticLegsArray)

    setExoticHelmets(exoticHelmetsArray)
    setExoticGauntlets(exoticGauntletsArray)
    setExoticChests(exoticChestsArray)
    setExoticLegs(exoticLegsArray)

  }, [userArmor, setHelmets, setGauntlets, setChests, setLegs])

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

  const evaluateArmor = () => {
    switch (armorType) {
      case 1:
        if (exotic) {
          ExoticLoop(exoticHelmets, setExoticHelmets, gauntlets, chests, legs, userTier, evalType)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 2:
        if (exotic) {
          ExoticLoop(exoticGauntlets, setExoticGauntlets, helmets, chests, legs, userTier, evalType)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 3:
        if (exotic) {
          ExoticLoop(exoticChests, setExoticChests, helmets, gauntlets, legs, userTier, evalType)
        }
        else {
          LegendaryArmorEvaluation(helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts)
        }
        break;
      case 4:
        if (exotic) {
          ExoticLoop(exoticLegs, setExoticLegs, helmets, gauntlets, chests, userTier, evalType)
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
            chosen={exoticHelmets}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
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
            chosen={exoticGauntlets}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
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
            chosen={exoticChests}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
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
            chosen={exoticLegs}
            showVendor={showVendor}
            toggleVendor={handleToggleVendor}
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

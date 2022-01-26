import React, { useState, useEffect } from 'react'
import { useStore } from '../store/store'
import "./ArmorEvaluator.css"
import EvaluationInterface from '../components/EvaluationInterface'
import GroupLoop from '../components/armorLoops/GroupLoop'
import ExoticLoop from '../components/armorLoops/ExoticLoop'
// import DoubleStatLegendary from '../OneStepEvaluation'
import LegendaryHelmetEvaluation from '../Test'

const ArmorEvaluator = () => {
  const userArmor = useStore((state) => state.userArmor)
  const [exotic, setExotic] = useState(false)
  const [armorType, setArmorType] = useState(1)
  const [evalType, setEvalType] = useState(1)
  const [helmets, setHelmets] = useState([])
  const [exoticHelmets, setExoticHelmets] = useState([])
  const [gauntlets, setGauntlets] = useState([])
  const [exoticGauntlets, setExoticGauntlets] = useState([])
  const [chests, setChests] = useState([])
  const [exoticChests, setExoticChests] = useState([])
  const [legs, setLegs] = useState([])
  const [exoticLegs, setExoticLegs] = useState([])
  const [noLoadouts, setNoLoadouts] = useState([])
  const [userTier, setUserTier] = useState({
    totalTier: 30,
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0,
    average: 0
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

  const evaluateArmor = () => {
    switch (armorType) {
      case 1:
        if (exotic) {
          ExoticLoop(exoticHelmets, setExoticHelmets, gauntlets, chests, legs, userTier, evalType)
        }
        else {
          if (evalType === 3) {
            // console.log("Helmet double stat loop")
            LegendaryHelmetEvaluation(helmets, setHelmets, exoticGauntlets, gauntlets, exoticChests, chests, exoticLegs, legs, userTier, setNoLoadouts)
          }
          else {
            GroupLoop(helmets, setHelmets, exoticGauntlets, gauntlets, exoticChests, chests, exoticLegs, legs, userTier, evalType)
          }
        }
        break;
      case 2:
        if (exotic) {
          ExoticLoop(exoticGauntlets, setExoticGauntlets, helmets, chests, legs, userTier, evalType)
        }
        else {
          if (evalType === 3) {
            LegendaryHelmetEvaluation(gauntlets, setGauntlets, exoticHelmets, helmets, exoticChests, chests, exoticLegs, legs, userTier, setNoLoadouts)
          }
          else {
            GroupLoop(gauntlets, setGauntlets, exoticHelmets, helmets, exoticChests, chests, exoticLegs, legs, userTier, evalType)
          }
        }
        break;
      case 3:
        if (exotic) {
          ExoticLoop(exoticChests, setExoticChests, helmets, gauntlets, legs, userTier, evalType)
        }
        else {
          if (evalType === 3) {
            LegendaryHelmetEvaluation(chests, setChests, exoticHelmets, helmets, exoticGauntlets, gauntlets, exoticLegs, legs, userTier, setNoLoadouts)
          }
          else {
            GroupLoop(chests, setChests, exoticHelmets, helmets, exoticGauntlets, gauntlets, exoticLegs, legs, userTier, evalType)
          }
        }
        break;
      case 4:
        if (exotic) {
          ExoticLoop(exoticLegs, setExoticLegs, helmets, gauntlets, chests, userTier, evalType)
        }
        else {
          if (evalType === 3) {
            LegendaryHelmetEvaluation(legs, setLegs, exoticHelmets, helmets, exoticGauntlets, gauntlets, exoticChests, chests, userTier, setNoLoadouts)
          }
          else {
            GroupLoop(legs, setLegs, exoticHelmets, helmets, exoticGauntlets, gauntlets, exoticChests, chests, userTier, evalType)
          }
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

import React, { useState, useEffect } from 'react'
import { useStore } from '../store/store'
import GroupLoop from '../components/armorLoops/GroupLoop'
import EvaluationInterface from '../components/EvaluationInterface'
import ExoticLoop from '../components/armorLoops/ExoticLoop'

const ArmorEvaluator = () => {
  const userArmor = useStore((state) => state.userArmor)
  const [armorType, setArmorType] = useState("Exotic Gauntlets")
  const [chained, setChained] = useState(false)
  const [helmets, setHelmets] = useState([])
  const [exoticHelmets, setExoticHelmets] = useState([])
  const [gauntlets, setGauntlets] = useState([])
  const [exoticGauntlets, setExoticGauntlets] = useState([])
  const [chests, setChests] = useState([])
  const [exoticChests, setExoticChests] = useState([])
  const [legs, setLegs] = useState([])
  const [exoticLegs, setExoticLegs] = useState([])
  const [userTier, setUserTier] = useState({
    totalTier: 30,
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0
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

  const handleChained = () => {
    setChained(!chained)
  }

  const handleChangeArmor = (e) => {
    setArmorType(e.target.value)
  }

  const evaluateArmor = () => {
    console.log(armorType)
    switch (armorType) {
      case "Helmets":
        GroupLoop(helmets, setHelmets, exoticGauntlets, gauntlets, exoticChests, chests, exoticLegs, legs, userTier, chained)
        break;
      case "Exotic Helmets":
        ExoticLoop(exoticHelmets, setExoticHelmets, gauntlets, chests, legs, userTier, chained)
        break;
      case "Gauntlets":
        GroupLoop(gauntlets, setGauntlets, exoticHelmets, helmets, exoticChests, chests, exoticLegs, legs, userTier, chained)
        break;
      case "Exotic Gauntlets":
        ExoticLoop(exoticGauntlets, setExoticGauntlets, helmets, chests, legs, userTier, chained)
        break;
      case "Chests":
        GroupLoop(chests, setChests, exoticHelmets, helmets, exoticGauntlets, gauntlets, exoticLegs, legs, userTier, chained)
        break;
      case "Exotic Chests":
        ExoticLoop(exoticChests, setExoticChests, helmets, gauntlets, legs, userTier, chained)
        break;
      case "Legs":
        GroupLoop(legs, setLegs, exoticHelmets, helmets, exoticGauntlets, gauntlets, exoticChests, chests, userTier, chained)
        break;
      case "Exotic Legs":
        ExoticLoop(exoticLegs, setExoticLegs, helmets, gauntlets, chests, userTier, chained)
        break;
      default:
        break;
    }
  }

  switch (armorType) {
    case "Helmets":
      return (
        <EvaluationInterface
          handleChained={handleChained}
          handleChange={handleChange}
          evaluateArmor={evaluateArmor}
          changeArmor={handleChangeArmor}
          chained={chained}
          userTier={userTier}
          chosen={helmets}
        />
      )
    case "Gauntlets":
      return (
        <EvaluationInterface
          handleChained={handleChained}
          handleChange={handleChange}
          evaluateArmor={evaluateArmor}
          changeArmor={handleChangeArmor}
          chained={chained}
          userTier={userTier}
          chosen={gauntlets}
        />
      )
    case "Chests":
      return (
        <EvaluationInterface
          handleChained={handleChained}
          handleChange={handleChange}
          evaluateArmor={evaluateArmor}
          changeArmor={handleChangeArmor}
          chained={chained}
          userTier={userTier}
          chosen={chests}
        />
      )
    case "Legs":
      return (
        <EvaluationInterface
          handleChained={handleChained}
          handleChange={handleChange}
          evaluateArmor={evaluateArmor}
          changeArmor={handleChangeArmor}
          chained={chained}
          userTier={userTier}
          chosen={legs}
        />
      )
    case "Exotic Helmets":
      return (
        <EvaluationInterface
          handleChained={handleChained}
          handleChange={handleChange}
          evaluateArmor={evaluateArmor}
          changeArmor={handleChangeArmor}
          chained={chained}
          userTier={userTier}
          chosen={exoticHelmets}
        />
      )
    case "Exotic Gauntlets":
      return (
        <EvaluationInterface
          handleChained={handleChained}
          handleChange={handleChange}
          evaluateArmor={evaluateArmor}
          changeArmor={handleChangeArmor}
          chained={chained}
          userTier={userTier}
          chosen={exoticGauntlets}
        />
      )
    case "Exotic Chests":
      return (
        <EvaluationInterface
          handleChained={handleChained}
          handleChange={handleChange}
          evaluateArmor={evaluateArmor}
          changeArmor={handleChangeArmor}
          chained={chained}
          userTier={userTier}
          chosen={exoticChests}
        />
      )
    case "Exotic Legs":
      return (
        <EvaluationInterface
          handleChained={handleChained}
          handleChange={handleChange}
          evaluateArmor={evaluateArmor}
          changeArmor={handleChangeArmor}
          chained={chained}
          userTier={userTier}
          chosen={exoticLegs}
        />
      )
    default:
      return (
        <div>
          This is where the buttons will be
        </div>
      )
  }
}

export default ArmorEvaluator

import React, { useState, useEffect } from 'react'
import { useStore } from '../store/store'
import ExoticLoop from '../evaluationFunctions/ExoticLoop'
import EvaluationInterface from '../components/EvaluationInterface'

const ExtoicPage = (props) => {
  const userArmor = useStore((state) => state.userArmor)
  const [chained, setChained] = useState(false)
  const [dupes, setDupes] = useState([])
  const [helmets, setHelmets] = useState([])
  const [gauntlets, setGauntlets] = useState([])
  const [chests, setChests] = useState([])
  const [legs, setLegs] = useState([])
  const [userTier, setUserTier] = useState({
    totalTier: 30,
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0
  })
  const hash = props.match.params.hash

  useEffect(() => {
    const dupesArray = []
    const helmetsArray = []
    const gauntletsArray = []
    const chestsArray = []
    const legsArray = []
    userArmor.forEach((armor) => {
      if (armor[1].itemHash.toString() === hash) {
        dupesArray.push(armor)
      }
    })
    setDupes(dupesArray)
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
  }, [hash, userArmor, setDupes])

  const handleChange = (e) => {
    setUserTier((state) => ({...state, [e.target.name]: parseInt(e.target.value)}))
  }

  const handleChained = () => {
    setChained(!chained)
  }

  const checkExotics = () => {
    const dupeType = dupes[0][1].itemSubType
    switch(dupeType) {
      case "Helmet":
        ExoticLoop(dupes, setDupes, gauntlets, chests, legs, userTier, chained)
        break;
      case "Gauntlets":
        ExoticLoop(dupes, setDupes, helmets, chests, legs, userTier, chained)
        break;
      case "Chest Armor":
        ExoticLoop(dupes, setDupes, helmets, gauntlets, legs, userTier, chained)
        break;
      case "Leg Armor":
        ExoticLoop(dupes, setDupes, helmets, gauntlets, chests, userTier, chained)
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <EvaluationInterface
        handleChained={handleChained}
        handleChange={handleChange}
        evaluateArmor={checkExotics}
        chained={chained}
        userTier={userTier}
        chosen={dupes}
      />
    </div>
  )
}

export default ExtoicPage

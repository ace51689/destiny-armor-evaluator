import React, { useState, useEffect } from 'react'
import { useStore } from '../store/store'

const ExtoicPage = (props) => {
  const userArmor = useStore((state) => state.userArmor)
  const [dupes, setDupes] = useState([])
  const [helmets, setHelmets] = useState([])
  const [gauntlets, setGauntlets] = useState([])
  const [chests, setChests] = useState([])
  const [legs, setLegs] = useState([])
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
  }, [hash, userArmor])

  const checkLoadouts = () => {
    if (dupes[0][1].itemSubType === "Gauntlets") {
      dupes.forEach((gauntlet) => {
        gauntlet[1].tierCount = 0
        gauntlet[1].highRecovBuilds = 0

        let gauntletMobility = gauntlet[1].stats.mobility
        let gauntletResilience = gauntlet[1].stats.resilience
        let gauntletRecovery = gauntlet[1].stats.recovery
        let gauntletDiscipline = gauntlet[1].stats.discipline
        let gauntletIntellect = gauntlet[1].stats.intellect
        let gauntletStrength = gauntlet[1].stats.strength

        if (!gauntlet[1].isMasterworked) {
          gauntletMobility += 2
          gauntletResilience += 2
          gauntletRecovery += 2
          gauntletDiscipline += 2
          gauntletIntellect += 2
          gauntletStrength += 2
        }

        helmets.forEach((helmet) => {
          let helmetMobility = helmet[1].stats.mobility
          let helmetResilience = helmet[1].stats.resilience
          let helmetRecovery = helmet[1].stats.recovery
          let helmetDiscipline = helmet[1].stats.discipline
          let helmetIntellect = helmet[1].stats.intellect
          let helmetStrength = helmet[1].stats.strength

          if (!helmet[1].isMasterworked) {
            helmetMobility += 2
            helmetResilience += 2
            helmetRecovery += 2
            helmetDiscipline += 2
            helmetIntellect += 2
            helmetStrength += 2
          }
    
          chests.forEach((chest) => {
            let chestMobility = chest[1].stats.mobility
            let chestResilience = chest[1].stats.resilience
            let chestRecovery = chest[1].stats.recovery
            let chestDiscipline = chest[1].stats.discipline
            let chestIntellect = chest[1].stats.intellect
            let chestStrength = chest[1].stats.strength

            if (!chest[1].isMasterworked) {
              chestMobility += 2
              chestResilience += 2
              chestRecovery += 2
              chestDiscipline += 2
              chestIntellect += 2
              chestStrength += 2
            }
            
            legs.forEach((leg) => {
              let legMobility = leg[1].stats.mobility
              let legResilience = leg[1].stats.resilience
              let legRecovery = leg[1].stats.recovery
              let legDiscipline = leg[1].stats.discipline
              let legIntellect = leg[1].stats.intellect
              let legStrength = leg[1].stats.strength
              
              if (!leg[1].isMasterworked) {
                legMobility += 2
                legResilience += 2
                legRecovery += 2
                legDiscipline += 2
                legIntellect += 2
                legStrength += 2
              }
              
              
              let mobility = Math.floor((gauntletMobility + helmetMobility + chestMobility + legMobility + 2) / 10)
              let resilience = Math.floor((gauntletResilience + helmetResilience + chestResilience + legResilience + 2) / 10)
              let recovery = Math.floor((gauntletRecovery + helmetRecovery + chestRecovery + legRecovery + 2) / 10)
              let discipline = Math.floor((gauntletDiscipline + helmetDiscipline + chestDiscipline + legDiscipline + 2) / 10)
              let intellect = Math.floor((gauntletIntellect + helmetIntellect + chestIntellect + legIntellect + 2) / 10)
              let strength = Math.floor((gauntletStrength + helmetStrength + chestStrength + legStrength + 2) / 10)

              const finalTier = mobility + resilience + recovery + discipline + intellect + strength

              if (finalTier >= 31) {
                gauntlet[1].tierCount += 1
                // console.log(`${gauntlet[1].name}, ${gauntlet[1].energyType}, Tier Count = ${gauntlet[1].tierCount}`)
              }
              if (recovery >= 10) {
                gauntlet[1].highRecovBuilds += 1
                console.log(`${gauntlet[1].name}, ${gauntlet[1].energyType}, Recov Count = ${gauntlet[1].highRecovBuilds}`)
              }
            })
            //Where all the loops end
          })
          //Where the gauntlets, helmets and chests loops end
        })
        //Where the gauntlet & helmet loops end
      })
      //Where all the loops end
    }
  }

  // if (dupes[0][1].itemSubType === "Helmets") {
    // dupes.forEach((helmet) => {
// } else {
//  helmets.forEach((helmet) => {
// }
    // })

  return (
    <div>
      Hey it' ya boi Exoitc Page
      <button
        onClick={checkLoadouts}
      >Evaluate for tier 30 plus loadouts</button>
    </div>
  )
}

export default ExtoicPage

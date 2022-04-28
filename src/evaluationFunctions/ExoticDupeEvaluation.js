import { getLoadoutStats, filterLoadouts, findingBestLoadouts, sortArray } from './LegendaryArmorEvaluation'


const findingTieLoadouts = (exoticLoadouts, exoticArray) => {
  const topLoadout = exoticLoadouts.shift()

  const filteredArmorArray = exoticLoadouts.filter((loadout) => {
    const stats = loadout.stats
    const mobility = Math.floor(topLoadout.stats.mobility) <= Math.floor(stats.mobility)
    const resilience = Math.floor(topLoadout.stats.resilience) <= Math.floor(stats.resilience)
    const recovery = Math.floor(topLoadout.stats.recovery) <= Math.floor(stats.recovery)
    const discipline = Math.floor(topLoadout.stats.discipline) <= Math.floor(stats.discipline)
    const intellect = Math.floor(topLoadout.stats.intellect) <= Math.floor(stats.intellect)
    const strength = Math.floor(topLoadout.stats.strength) <= Math.floor(stats.strength)

    if (intellect && recovery && discipline && resilience && strength && mobility) {
      return loadout
    }
    return false
  })

  if (filteredArmorArray.length === 0) {
    return [topLoadout]
  }
  else {
    filteredArmorArray.push(topLoadout)
    const userOwnedLoadouts = filteredArmorArray.filter(loadout => !loadout.containsVendor)
    console.log(userOwnedLoadouts)
    if (userOwnedLoadouts.length === 1) {
      return [userOwnedLoadouts[0]]
    }
    // console.log(userOwnedLoadouts)
    const finalExoticHashes = userOwnedLoadouts.map(loadout => loadout.exoticInstance)
    // console.log(finalExoticHashes)
    const finalExoticItems = exoticArray.filter(exotic => finalExoticHashes.includes(exotic.itemInstanceId))
    // console.log(exoticArray)
    finalExoticItems.sort((a, b) => b.powerLevel - a.powerLevel)
    finalExoticItems.sort((a, b) => b.energyCapacity - a.energyCapacity)
    const finalLoadout = userOwnedLoadouts.find(loadout => loadout.exoticInstance === finalExoticItems[0].itemInstanceId)

    return [finalLoadout]
  }
}


const findFinalLoadout = (loadouts, exoticArray) => {
  loadouts.sort((a, b) => a.stats.numberOfMods - b.stats.numberOfMods)
  const fewestModsToMax = loadouts[0].stats.numberOfMods
  const fewestModsToMaxArray = loadouts.filter(loadout => loadout.stats.numberOfMods === fewestModsToMax)

  if (fewestModsToMaxArray.length === 1) {
    return fewestModsToMaxArray
  }

  fewestModsToMaxArray.sort((a, b) => a.stats.intRecDiff - b.stats.intRecDiff)
  const closestIntRec = fewestModsToMaxArray[0].stats.intRecDiff
  const closestIntRecArray = fewestModsToMaxArray.filter(loadout => loadout.stats.intRecDiff === closestIntRec)

  if (closestIntRecArray.length === 1) {
    return closestIntRecArray
  }

  const finalLoadoutArray = sortArray(closestIntRecArray, 'intellect')
  const bestLoadout = findingTieLoadouts(finalLoadoutArray, exoticArray)
  return bestLoadout
}


const findBestLoadout = (loadouts, exoticArray) => {
  if (loadouts.every(loadout => loadout.stats.intRecDiff >= 1)) {
    console.log("Every loadout has an intRecDiff of one or more")
    // console.log(loadouts)
    if (loadouts.every(loadout => loadout.stats.intellect > loadout.stats.recovery)) {
      //Every loadout has more intellect than recovery
      return findFinalLoadout(loadouts, exoticArray)
    }
    else if (loadouts.every(loadout => loadout.stats.recovery > loadout.stats.intellect)) {
      //Every loadout has more recovery than intellect
      return findFinalLoadout(loadouts, exoticArray)
    }
    else {
      //The loadouts array contains some amount of inverses of Intellect and Recovery
      const intellectFocusedArray = loadouts.filter(loadout => loadout.stats.intellect > loadout.stats.recovery)
      const recoveryFocusedArray = loadouts.filter(loadout => loadout.stats.recovery > loadout.stats.intellect)

      const intellectSortedArray = sortArray(intellectFocusedArray, 'intellect')
      const recoverySortedArray = sortArray(recoveryFocusedArray, 'recovery')

      const sameExoticInstance = intellectSortedArray[0].exoticInstance === recoverySortedArray[0].exoticInstance
      if (sameExoticInstance) {
        console.log("Had both types of loadouts, the best two had the same exoticInstance")
        return [intellectSortedArray[0]]
      }
      else {
        console.log("Had both types of loadouts, the best two didn't have the same exoticInstance")
      }
    }
  }
  else {
    //Every loadout's difference between Intellect and Recovery is less than 1.
    return findFinalLoadout(loadouts, exoticArray)

  }
}


const findExoticToKeep = (exoticLoadouts, exoticArray) => {
  if (exoticLoadouts.length === 1) {
    console.log('Only one loadout entered function')
    console.log(exoticLoadouts)
  }
  else if (exoticLoadouts.some(loadout => loadout.stats.totalIntRec >= 19.5)) {
    console.log("Best was 20 or 19.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.some(loadout => loadout.stats.totalIntRec >= 18.5)) {
    console.log("Best was 19 or 18.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 17.5)) {
    console.log("Best was 18 or 17.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 16.5)) {
    console.log("Best was 17 or 16.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 15.5)) {
    console.log("Best was 16 or 15.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 14.5)) {
    console.log("Best was 15 or 14.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 13.5)) {
    console.log("Best was 14 or 13.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 12.5)) {
    console.log("Best was 13 or 12.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 11.5)) {
    console.log("Best was 12 or 11.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 10.5)) {
    console.log("Best was 11 or 10.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 9.5)) {
    console.log("Best was 10 or 9.5")
    const bestLoadout = findBestLoadout(exoticLoadouts, exoticArray)
    console.log(bestLoadout)
  }
  else {
    console.log("----------Final Else Block----------")
    console.log(exoticLoadouts)
  }
}


const calculateStats = (exoticArray, topArray, middleArray, bottomArray, userTier, noLoadouts, tieLoadouts) => {
  exoticArray.forEach((exotic) => {
    const exoticName = exotic[0].name
    const exoticType = exotic[0].itemSubType
    const exoticLoadouts = []

    exotic.forEach(item => {
      const exoticInstance = item.itemInstanceId

      let exoticMobility = item.baseStats.mobility + 2
      let exoticResilience = item.baseStats.resilience + 2
      let exoticRecovery = item.baseStats.recovery + 2
      let exoticDiscipline = item.baseStats.discipline + 2
      let exoticIntellect = item.baseStats.intellect + 2
      let exoticStrength = item.baseStats.strength + 2

      //Then we move on to the target of this evaluation function...
      topArray.forEach((top) => {

        let topMobility = top.baseStats.mobility + 2
        let topResilience = top.baseStats.resilience + 2
        let topRecovery = top.baseStats.recovery + 2
        let topDiscipline = top.baseStats.discipline + 2
        let topIntellect = top.baseStats.intellect + 2
        let topStrength = top.baseStats.strength + 2

        middleArray.forEach((middle) => {

          let middleMobility = middle.baseStats.mobility + 2
          let middleResilience = middle.baseStats.resilience + 2
          let middleRecovery = middle.baseStats.recovery + 2
          let middleDiscipline = middle.baseStats.discipline + 2
          let middleIntellect = middle.baseStats.intellect + 2
          let middleStrength = middle.baseStats.strength + 2

          bottomArray.forEach((bottom) => {

            let bottomMobility = bottom.baseStats.mobility + 2
            let bottomResilience = bottom.baseStats.resilience + 2
            let bottomRecovery = bottom.baseStats.recovery + 2
            let bottomDiscipline = bottom.baseStats.discipline + 2
            let bottomIntellect = bottom.baseStats.intellect + 2
            let bottomStrength = bottom.baseStats.strength + 2

            const statsArray = [
              (exoticMobility + topMobility + middleMobility + bottomMobility + 2) / 10,
              (exoticResilience + topResilience + middleResilience + bottomResilience + 2) / 10,
              (exoticRecovery + topRecovery + middleRecovery + bottomRecovery + 2) / 10,
              (exoticDiscipline + topDiscipline + middleDiscipline + bottomDiscipline + 2) / 10,
              (exoticIntellect + topIntellect + middleIntellect + bottomIntellect + 2) / 10,
              (exoticStrength + topStrength + middleStrength + bottomStrength + 2) / 10
            ]

            let totalTier = Math.floor(statsArray[0]) + Math.floor(statsArray[1]) + Math.floor(statsArray[2]) + Math.floor(statsArray[3]) + Math.floor(statsArray[4]) + Math.floor(statsArray[5])

            const statsObject = getLoadoutStats(statsArray)

            filterLoadouts(totalTier, userTier, statsObject, exoticLoadouts, top, middle, bottom, exoticName, exoticType, exoticInstance)

            // console.log(exoticLoadouts)

          })
        })
      })
    })

    if (exoticLoadouts.length === 0) {
      noLoadouts.push(exoticName)
    }

    else {
      // console.log(exoticLoadouts)
      const filteredArmorArray = findingBestLoadouts(exoticLoadouts)

      // console.log(filteredArmorArray)

      findExoticToKeep(filteredArmorArray, exotic)
      // assignSimpleLoadouts(filteredArmorArray, topArray, middleArray, bottomArray, tieLoadouts)

    }
  })
}

const resetEvaluation = (armorArray) => {
  armorArray.forEach((array) => {
    array.forEach((armor) => {
      armor.counter = 0
      armor.loadouts = []
    })
  })
}

export const ExoticDupeEvaluation = (exoticHelmets, setExoitcHelmets, gauntlets, chests, legs, userTier, setNoLoadouts) => {
  // console.log(exoticHelmets)
  const noLoadouts = []
  const tieLoadouts = []
  // const exoticLoadouts = []

  resetEvaluation(exoticHelmets)
  // resetEvaluation(exoticGauntlets)
  // resetEvaluation(exoticChests)
  // resetEvaluation(exoticLegs)

  calculateStats(exoticHelmets, gauntlets, chests, legs, userTier, noLoadouts, tieLoadouts)
  // console.log(exoticHelmets)


  console.log(exoticHelmets)
}
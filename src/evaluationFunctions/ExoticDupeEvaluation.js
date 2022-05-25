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
    // console.log(filteredArmorArray)
    const userOwnedLoadouts = filteredArmorArray.filter(loadout => !loadout.containsVendor)
    // console.log(userOwnedLoadouts)
    if (userOwnedLoadouts.length === 1) {
      return [userOwnedLoadouts[0]]
    }
    // console.log(userOwnedLoadouts)
    const finalExoticHashes = userOwnedLoadouts.map(loadout => loadout.exoticInstance)
    // console.log(finalExoticHashes)
    // console.log(exoticArray)
    const finalExoticItems = exoticArray.filter(exotic => finalExoticHashes.includes(exotic.itemInstanceId))
    // console.log(finalExoticItems)
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
  let closestIntRecArray
  if (closestIntRec < 1) {
    closestIntRecArray = fewestModsToMaxArray.filter(loadout => loadout.stats.intRecDiff < 1)
  }
  else {
    closestIntRecArray = fewestModsToMaxArray.filter(loadout => loadout.stats.intRecDiff === closestIntRec)
  }

  if (closestIntRecArray.length === 1) {
    return closestIntRecArray
  }

  const finalLoadoutArray = sortArray(closestIntRecArray, 'intellect')
  // console.log(exoticArray)
  const bestLoadout = findingTieLoadouts(finalLoadoutArray, exoticArray)
  return bestLoadout
}


const findBestLoadout = (loadouts, exoticArray) => {
  if (loadouts.every(loadout => loadout.stats.intRecDiff >= 1)) {
    console.log("Every loadout has an intRecDiff of one or more")
    // console.log(loadouts)
    if (loadouts.every(loadout => loadout.stats.intellect > loadout.stats.recovery)) {
      //Every loadout has more intellect than recovery
      const finalLoadout = findFinalLoadout(loadouts, exoticArray)
      return { exoticInstance: finalLoadout[0].exoticInstance, loadouts: finalLoadout }
    }
    else if (loadouts.every(loadout => loadout.stats.recovery > loadout.stats.intellect)) {
      //Every loadout has more recovery than intellect
      const finalLoadout = findFinalLoadout(loadouts, exoticArray)
      return { exoticInstance: finalLoadout[0].exoticInstance, loadouts: finalLoadout }
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
        return { exoticInstance: intellectSortedArray[0].exoticInstance, loadouts: [intellectSortedArray[0], recoverySortedArray[0]] }
      }
      else if (intellectSortedArray.length === 1 && recoverySortedArray.length === 1) {
        console.log("Had ONE of each type of loadout and the two didn't have the same exoticInstance ")
        return { exoticInstance: intellectSortedArray[0].exoticInstance, loadouts: [intellectSortedArray[0]] }
      }
      else {
        console.log("Had more than one of at least one type of loadout and the top two didnt have the same exoticInstance")
        // console.log(loadouts)
        // console.log(exoticArray)
        const allExoticInstances = loadouts.map(loadout => loadout.exoticInstance)
        const exoticInstances = allExoticInstances.filter((instance, index) => allExoticInstances.indexOf(instance) === index)
        // console.log(exoticInstances)
        const finalInstances = []
        exoticInstances.forEach(instance => {
          const hasIntellectLoadout = intellectSortedArray.some(loadout => loadout.exoticInstance === instance)
          const hasRecoveryLoadout = recoverySortedArray.some(loadout => loadout.exoticInstance === instance)
          if (hasIntellectLoadout && hasRecoveryLoadout) {
            finalInstances.push(instance)
          }
        })
        if (finalInstances.length === 1) {
          return { exoticInstance: finalInstances[0], loadouts: [intellectSortedArray[0], recoverySortedArray[0]] }
        }
        else {
          console.log("Neither focus included the same exotic instance")
          console.log(finalInstances)
        }
      }
    }
  }
  else {
    //Every loadout's difference between Intellect and Recovery is less than 1.
    const finalLoadout = findFinalLoadout(loadouts, exoticArray)
    return { exoticInstance: finalLoadout[0].exoticInstance, loadouts: finalLoadout }
  }
}


// const processExoticToKeep = (exoticInstance, exoticArray) => {
//   const updatedArray = exoticArray.map((exotic) => {
//     if (exotic.itemInstanceId === exoticInstance) {
//       return { ...exotic, counter: 1 }
//     }
//     return exotic
//   })

//   return updatedArray
// }


const findExoticToKeep = (exoticLoadouts, exotics, exoticArray, setExoticArray) => {
  if (exoticLoadouts.length === 1) {
    console.log('Only one loadout entered function')
    return { exoticInstance: exoticLoadouts[0].exoticInstance, loadouts: exoticLoadouts[0] }
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 19)) {
    console.log("Best was 19 or higher")
    const finalLoadout = findFinalLoadout(exoticLoadouts, exotics)
    return { exoticInstance: finalLoadout[0].exoticInstance, loadouts: finalLoadout }
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 18)) {
    console.log("Best was 18 or 18.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 17)) {
    console.log("Best was 17 or 17.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 16)) {
    console.log("Best was 16 or 16.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 15)) {
    console.log("Best was 15 or 15.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 14)) {
    console.log("Best was 14 or 14.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 13)) {
    console.log("Best was 13 or 13.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 12)) {
    console.log("Best was 12 or 12.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 11)) {
    console.log("Best was 11 or 11.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 10)) {
    console.log("Best was 10 or 10.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else if (exoticLoadouts.every(loadout => loadout.stats.totalIntRec >= 9)) {
    console.log("Best was 9 or 9.5")
    return findBestLoadout(exoticLoadouts, exotics)
  }
  else {
    console.log("----------Final Else Block----------")
    console.log(exoticLoadouts)
  }
}


const calculateStats = (exoticArray, topArray, middleArray, bottomArray, userTier, noLoadouts, tieLoadouts, setExoticArray) => {
  const finalExoticArray = []

  exoticArray.forEach((exotic) => {
    const exoticName = exotic[0].name
    const exoticHash = exotic[0].itemHash
    const exoticType = exotic[0].itemSubType
    const exoticLoadouts = []

    exotic.forEach(item => {
      // console.log(item)
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
      const finalLoadoutInfo = findExoticToKeep(filteredArmorArray, exotic, exoticArray, setExoticArray)
      const instanceToKeep = finalLoadoutInfo.exoticInstance
      // console.log(finalLoadoutInfo)
      exoticArray.forEach(array => {
        if (array[0].itemHash === exoticHash) {
          const updatedDupes = array.map(exotic => {
            // console.log(exotic)
            if (exotic.itemInstanceId === instanceToKeep) {
              return { ...exotic, counter: 1, loadouts: finalLoadoutInfo.loadouts }
            }
            return exotic
          })
          console.log(updatedDupes)
          finalExoticArray.push(updatedDupes)
        }
      })

      // assignSimpleLoadouts(filteredArmorArray, topArray, middleArray, bottomArray, tieLoadouts)

    }
  })
  // console.log(finalExoticArray)
  setExoticArray(finalExoticArray)
}

const resetEvaluation = (armorArray) => {
  armorArray.forEach((array) => {
    array.forEach((armor) => {
      armor.counter = 0
      armor.loadouts = []
    })
  })
}

// const setExoticArrays = (exoticArray, dupeExoticArray) => {
//   const copyExoticArray = [...exoticArray]
//   const releventDupeExotics = dupeExoticArray.forEach()

// }

// const filterExoticVendorDupes = (exoticsArray) => {
//   const xursExotic = exoticsArray[0].find(exotic => exotic.vendor !== undefined)
//   if (xursExotic === undefined) {
//     return exoticsArray
//   }
//   const xursStats = xursExotic.baseStats
//   const finalArray = exoticsArray[0].filter(exotic => {
//     const exoticStats = exotic.baseStats
//     const mobility = xursStats.mobility === exoticStats.mobility
//     const resilience = xursStats.resilience === exoticStats.resilience
//     const recovery = xursStats.recovery === exoticStats.recovery
//     const discipline = xursStats.discipline === exoticStats.discipline
//     const intellect = xursStats.intellect === exoticStats.intellect
//     const strength = xursStats.strength === exoticStats.strength

//     const match = mobility && resilience && recovery && discipline && intellect && strength
//     if (match && exotic.vendor === undefined) {
//       return exotic
//     }
//     else if (!match) {
//       return exotic
//     }
//     return false
//   })

//   return [finalArray]
// }

export const ExoticDupeEvaluation = (exoticHelmets, setExoticHelmets, helmets, exoticGauntlets, setExoticGauntlets, gauntlets, exoticChests, setExoticChests, chests, exoticLegs, setExoticLegs, legs, userTier, setNoLoadouts) => {
  const noLoadouts = []
  const tieLoadouts = []



  if (exoticHelmets.length > 0) {
    resetEvaluation(exoticHelmets)
    // const finalHelmetsArray = filterExoticVendorDupes(exoticHelmets)
    calculateStats(exoticHelmets, gauntlets, chests, legs, userTier, noLoadouts, tieLoadouts, setExoticHelmets)
  }
  if (exoticGauntlets.length > 0) {
    resetEvaluation(exoticGauntlets)
    // const finalGauntletsArray = filterExoticVendorDupes(exoticGauntlets)
    calculateStats(exoticGauntlets, helmets, chests, legs, userTier, noLoadouts, tieLoadouts, setExoticGauntlets)
  }
  if (exoticChests.length > 0) {
    resetEvaluation(exoticChests)
    // const finalChestsArray = filterExoticVendorDupes(exoticChests)
    calculateStats(exoticChests, helmets, gauntlets, legs, userTier, noLoadouts, tieLoadouts, setExoticChests)
  }
  if (exoticLegs.length > 0) {
    resetEvaluation(exoticLegs)
    // const finalLegsArray = filterExoticVendorDupes(exoticLegs)
    calculateStats(exoticLegs, helmets, gauntlets, chests, userTier, noLoadouts, tieLoadouts, setExoticLegs)
  }
}
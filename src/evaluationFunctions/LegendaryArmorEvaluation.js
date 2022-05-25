export const findingBestLoadouts = (armorArray) => {
  armorArray.sort((a, b) => {
    return b.stats.totalIntRec - a.stats.totalIntRec
  })

  let n = armorArray[0].stats.totalIntRec

  //Original: if n !== Math.floor(n) THEN n -= 0.5
  if (n !== Math.floor(n)) {
    n -= 0.5
  }

  return armorArray.filter((loadout) => {
    if (loadout.stats.totalIntRec >= n) {
      return loadout
    }
    return false
  })
}

export const filterLoadouts = (totalTier, userTier, statsObject, loadoutArray, top, middle, bottom, exoticName, exoticType, exoticInstance) => {
  // const instanceIds = { "topId": top.itemInstanceId, "middleId": middle.itemInstanceId, "bottomId": bottom.itemInstanceId }
  const instanceIds = [top.itemInstanceId, middle.itemInstanceId, bottom.itemInstanceId]
  const allMasterworked = top.isMasterworked && middle.isMasterworked && bottom.isMasterworked

  if (totalTier >= userTier.totalTier) {
    if (statsObject["recovery"] >= userTier.recovery) {
      if (statsObject["intellect"] >= userTier.intellect) {
        if (statsObject["recovery"] + statsObject["intellect"] >= userTier.average) {
          let containsVendor
          if (top.vendor || middle.vendor || bottom.vendor) {
            containsVendor = true
          }
          else {
            containsVendor = false
          }
          loadoutArray.push({
            "loadout": `Tier ${totalTier}: ${exoticName} - ${top.name} - ${middle.name} - ${bottom.name}`,
            "stats": statsObject,
            "instanceIds": instanceIds,
            "exoticName": exoticName,
            "exoticType": exoticType,
            "exoticInstance": exoticInstance,
            "armorCounter": [top.counter, middle.counter, bottom.counter],
            "containsVendor": containsVendor,
            "allMasterworked": allMasterworked
          })
        }
      }
    }
  }
}

export const getLoadoutStats = (statsArray) => {
  const tierArray = []

  statsArray.forEach((stat) => {
    let tier = stat
    let totalTier = Math.floor(tier)
    let totalUp = totalTier + 1
    let totalHalf = tier + 0.5
    if (totalHalf >= totalUp) {
      if (totalTier + 0.5 >= 10) {
        tierArray.push(10)
      } else {
        tierArray.push(totalTier + 0.5)
      }
    } else {
      if (totalTier >= 10) {
        tierArray.push(10)
      } else {
        tierArray.push(totalTier)
      }
    }
  })

  const statsObject = { "mobility": tierArray[0], "resilience": tierArray[1], "recovery": tierArray[2], "discipline": tierArray[3], "intellect": tierArray[4], "strength": tierArray[5] }

  statsObject.totalIntRec = statsObject.intellect + statsObject.recovery

  statsObject.intRecDiff = Math.abs(statsObject.intellect - statsObject.recovery)

  statsObject.numberOfMods = (10 - Math.floor(statsObject.intellect)) + (10 - Math.floor(statsObject.recovery))

  let i = statsObject.intellect
  let r = statsObject.recovery

  let points = 0
  if (statsObject.intellect !== Math.floor(statsObject.intellect)) {
    points += 2
    i += 0.5
  }

  if (statsObject.recovery !== Math.floor(statsObject.recovery)) {
    points += 2
    r += 0.5
  }
  points += (10 - i) * 5
  points += (10 - r) * 4

  statsObject.pointsFromMax = points

  statsObject.practicalTotal = tierArray.reduce((a, b) => {
    return a + b
  })

  return statsObject
}

const addLoadout = (chosen, loadout, choiceId, exoticName) => {
  chosen.find((choice) => {
    if (choice.itemInstanceId === choiceId) {
      choice.counter += 1
      choice.loadouts.push(loadout)
      return true
    }
    return false
  })
}

const assignVariables = (exoticArray) => {
  let bestLoadout
  exoticArray.every((loadout, index) => {
    if (index === 0) {
      bestLoadout = loadout
      return false
    }
    return true
  })
  return bestLoadout
}

export const sortArray = (array, type) => {
  array
    .sort((a, b) => b.stats.mobility - a.stats.mobility)
    .sort((a, b) => b.stats.strength - a.stats.strength)
    .sort((a, b) => b.stats.resilience - a.stats.resilience)
    .sort((a, b) => b.stats.discipline - a.stats.discipline)
  if (type === "intellect") {
    array
      .sort((a, b) => b.stats.recovery - a.stats.recovery)
      .sort((a, b) => b.stats.intellect - a.stats.intellect)
  }
  if (type === "recovery") {
    array
      .sort((a, b) => b.stats.intellect - a.stats.intellect)
      .sort((a, b) => b.stats.recovery - a.stats.recovery)
  }

  return array
}

const findingTieLoadouts = (array, type) => {
  const topLoadout = array.shift()


  const filteredArmorArray = array.filter((loadout) => {
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
    if (filteredArmorArray.every((loadout) => loadout.armorCounter.includes(0))) {
      //Reduce armorCounter to sum of all numbers and keep the loadout with the heighest sum
      filteredArmorArray.forEach((loadout) => {
        const armorCountSum = loadout.armorCounter.reduce((a, b) => a + b)
        loadout.totalCount = armorCountSum
      })

      //Sort by the combined armor count
      filteredArmorArray.sort((a, b) => b.totalCount - a.totalCount)
      const highestTotalCount = filteredArmorArray[0].totalCount

      //Filter out any loadouts that have a lower armor count than the loadout with the highest armor count
      const sortedArmorArray = filteredArmorArray.filter(loadout => loadout.totalCount === highestTotalCount)
      const finalArmorArray = sortArray(sortedArmorArray, type)

      if (finalArmorArray.every(loadout => loadout.stats.pointsFromMax === finalArmorArray[0].stats.pointsFromMax)) {
        finalArmorArray.sort((a, b) => b.stats.practicalTotal - a.stats.practicalTotal)
      }
      else {
        finalArmorArray.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
      }
      return finalArmorArray
    }
    else if (filteredArmorArray.some((loadout) => loadout.armorCounter.includes(0))) {
      //Fliter out loadouts with an armorCounter that includes 0, then sort and return filteredArmorArray      
      const sortedArmorArray = filteredArmorArray.filter(loadout => !loadout.armorCounter.includes(0))
      const finalArmorArray = sortArray(sortedArmorArray, type)

      if (finalArmorArray.every(loadout => loadout.stats.pointsFromMax === finalArmorArray[0].stats.pointsFromMax)) {
        finalArmorArray.sort((a, b) => b.stats.practicalTotal - a.stats.practicalTotal)
      }
      else {
        finalArmorArray.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
      }

      return finalArmorArray
    }
    else {
      //No armorCounter arrays include 0 
      const finalArmorArray = sortArray(filteredArmorArray, type)

      if (finalArmorArray.every(loadout => loadout.stats.pointsFromMax === finalArmorArray[0].stats.pointsFromMax)) {
        finalArmorArray.sort((a, b) => b.stats.practicalTotal - a.stats.practicalTotal)
      }
      else {
        finalArmorArray.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
      }

      return finalArmorArray
    }
  }
}

const processOneLoadout = (array, topArray, middleArray, bottomArray) => {
  // console.log(array)
  const onlyLoadout = assignVariables(array)
  const topId = onlyLoadout.instanceIds[0]
  const middleId = onlyLoadout.instanceIds[1]
  const bottomId = onlyLoadout.instanceIds[2]
  addLoadout(topArray, onlyLoadout, topId, onlyLoadout.exoticName)
  addLoadout(middleArray, onlyLoadout, middleId, onlyLoadout.exoticName)
  addLoadout(bottomArray, onlyLoadout, bottomId, onlyLoadout.exoticName)
}

// const zeroArmorCounterGuard = (array, topArray, middleArray, bottomArray, tieLoadouts) => {
//   //Add the best intellect focused loadout:
//   const finalArmorArray = findingTieLoadouts(array)
//   if (finalArmorArray === false) {
//     tieLoadouts.push(array)
//   }
//   else {
//     processOneLoadout(finalArmorArray, topArray, middleArray, bottomArray)
//   }
// }

//---------------------------------------------------------------------------------------------------------------------------------------
//TODO: create a function that handles checking if a loadouts array has inverse loadouts of >= 1 intRecDiff.
const checkForLargeDifference = (loadouts) => {
  if (loadouts.every(loadout => loadout.stats.intRecDiff >= 1)) {
    const highIntellectLoadout = loadouts.some(loadout => loadout.stats.intellect > loadout.stats.recovery)
    const highRecoveryLoadout = loadouts.some(loadout => loadout.stats.recovery > loadout.stats.intellect)
    if (highIntellectLoadout && highRecoveryLoadout) {
      return true
    }
  }
  return false
}

const findInverseLoadouts = (loadouts) => {
  const intellectFocusedArray = loadouts.filter(loadout => loadout.stats.intellect > loadout.stats.recovery)
  let filteredIntellectArray
  if (intellectFocusedArray.some(loadout => loadout.stats.intRecDiff <= 1.5)) {
    filteredIntellectArray = intellectFocusedArray.filter(loadout => loadout.stats.intRecDiff <= 1.5)
  }
  else {
    filteredIntellectArray = [...intellectFocusedArray]
  }
  

  const recoveryFocusedArray = loadouts.filter(loadout => loadout.stats.recovery > loadout.stats.intellect)
  let filteredRecoveryArray
  if (recoveryFocusedArray.some(loadout => loadout.stats.intRecDiff <= 1.5)) {
    filteredRecoveryArray = recoveryFocusedArray.filter(loadout => loadout.stats.intRecDiff <= 1.5)
  }
  else {
    filteredRecoveryArray = [...recoveryFocusedArray]
  }
  
  const intellectSortedArray = sortArray(filteredIntellectArray, 'intellect')
  const recoverySortedArray = sortArray(filteredRecoveryArray, 'recovery')
  
  const finalIntellectArray = findingTieLoadouts(intellectSortedArray, 'intellect')
  const finalRecoveryArray = findingTieLoadouts(recoverySortedArray, 'recovery')

  return {
    intellectLoadout: finalIntellectArray,
    recoveryLoadout: finalRecoveryArray
  }
}

//TODO: create a function that handles finding the fewest mods to max and filtering out loadouts that require more mods to max.
const findFewestModsToMax = (loadouts) => {
  loadouts.sort((a, b) => a.stats.numberOfMods - b.stats.numberOfMods)
  const fewestModsToMax = loadouts[0].stats.numberOfMods
  const fewestModsToMaxArray = loadouts.filter(loadout => loadout.stats.numberOfMods === fewestModsToMax)
  return fewestModsToMaxArray
}

//TODO: create a function that handles finding the smallest intRecDiff and filtering out loadouts that have larger intRecDiffs.
const findSmallestIntRecDiff = (loadouts) => {
  loadouts.sort((a, b) => a.stats.intRecDiff - b.stats.intRecDiff)
  const smallestIntRecDiff = loadouts[0].stats.intRecDiff
  let smallestIntRecDiffArray
  if (smallestIntRecDiff < 1) {
    smallestIntRecDiffArray = loadouts.filter(loadout => loadout.stats.intRecDiff < 1)
  }
  else {
    smallestIntRecDiffArray = loadouts.filter(loadout => loadout.stats.intRecDiff === smallestIntRecDiff)
  }
  return smallestIntRecDiffArray
}

// TODO: create a function that handles finding the smallest pointsToMax and filtering out loadouts that require more points to max.
const findsmallestPointsFromMax = (loadouts) => {
  loadouts.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
  const smallestPointsFromMax = loadouts[0].stats.pointsFromMax
  const smallestPointsFromMaxArray = loadouts.filter(loadout => loadout.stats.pointsFromMax === smallestPointsFromMax)
  return smallestPointsFromMaxArray
}

// const findHighestTotalIntRec = (loadouts) => {
  //   loadouts.sort((a, b) => b.stats.totalIntRec - a.stats.totalIntRec)
  //   const highestTotalIntRec = loadouts[0].stats.totalIntRec
  //   const highestTotalIntRecArray = loadouts.filter(loadout => loadout.stats.totalIntRec === highestTotalIntRec)
  //   return highestTotalIntRecArray
  // }
  
  const findZeroArmorCountLoadouts = (loadouts) => {
    if (loadouts[0].armorCounter.includes(0)) {
      return true
    }
    return false
}

const findLoadoutsToKeep = (loadoutsArray, topArray, middleArray, bottomArray, tieLoadouts) => {
  // console.log(loadoutsArray[0].exoticName)
  // console.log(loadoutsArray)
  if (loadoutsArray.length === 1) {
    //If there's only one loadout that meets the user's criteria:
    // console.log(loadoutsArray)
    processOneLoadout(loadoutsArray, topArray, middleArray, bottomArray)
  }
  else if (loadoutsArray.every(loadout => loadout.stats.totalIntRec >= 19)) {
    // console.log("The totalIntRec was 19 or higher:")
    //If any loadout in the array has a totalIntRec of 19 or higher:
    //Find the smallest number of mods to max
    const fewestModsToMaxArray = findFewestModsToMax(loadoutsArray)
    //Find the smallest difference:
    const smallestIntRecDiffArray = findSmallestIntRecDiff(fewestModsToMaxArray)
    //Check for a large difference:
    //Sort by intellect
    const finalArray = sortArray(smallestIntRecDiffArray, 'intellect')
    //process that loadout.
    const bestLoadout = findingTieLoadouts(finalArray, 'intellect')
    // const unusedArmor = findZeroArmorCountLoadouts(bestLoadout)
    // if (unusedArmor) {
    //   tieLoadouts.push(loadoutsArray)
    // }
    // else {
    processOneLoadout(bestLoadout, topArray, middleArray, bottomArray)
    // }
  }
  else if (loadoutsArray.every(loadout => loadout.stats.totalIntRec !== Math.floor(loadout.stats.totalIntRec))) {
    //If every loadout in the array has a totalIntRec that ends in a .5:
    //No need to filter by number of mods to max, all that end in .5 need the same number of mods to max
    //Check for a large difference:
    const largeDifference = checkForLargeDifference(loadoutsArray)
    if (largeDifference) {
      const finalLoadouts = findInverseLoadouts(loadoutsArray)
      const unusedIntellect = findZeroArmorCountLoadouts(finalLoadouts.intellectLoadout)
      const unusedRecovery = findZeroArmorCountLoadouts(finalLoadouts.recoveryLoadout)
      if (unusedIntellect || unusedRecovery) {
        tieLoadouts.push(loadoutsArray)
      }
      else {
        processOneLoadout(finalLoadouts.intellectLoadout, topArray, middleArray, bottomArray)
        processOneLoadout(finalLoadouts.recoveryLoadout, topArray, middleArray, bottomArray)
      }
    }
    else {
      const smallestIntRecDiffArray = findSmallestIntRecDiff(loadoutsArray)
      //Sort by intellect
      const finalArray = sortArray(smallestIntRecDiffArray, 'intellect')
      //process that loadout.
      const bestLoadout = findingTieLoadouts(finalArray, 'intellect')
      // console.log(bestLoadout)
      const unusedArmor = findZeroArmorCountLoadouts(bestLoadout)
      if (unusedArmor) {
        tieLoadouts.push(loadoutsArray)
      }
      else {
        processOneLoadout(bestLoadout, topArray, middleArray, bottomArray)
      }
    }

  }
  else {
    //If every loadout in the array has varying totalIntRec stats:
    const fewestModsToMaxArray = findFewestModsToMax(loadoutsArray)
    const largeDifference = checkForLargeDifference(fewestModsToMaxArray)
    if (largeDifference) {
      const finalLoadouts = findInverseLoadouts(fewestModsToMaxArray)
      const unusedIntellect = findZeroArmorCountLoadouts(finalLoadouts.intellectLoadout)
      const unusedRecovery = findZeroArmorCountLoadouts(finalLoadouts.recoveryLoadout)
      if (unusedIntellect || unusedRecovery) {
        tieLoadouts.push(loadoutsArray)
      }
      else {
        processOneLoadout(finalLoadouts.intellectLoadout, topArray, middleArray, bottomArray)
        processOneLoadout(finalLoadouts.recoveryLoadout, topArray, middleArray, bottomArray)
      }
    }
    else {
      // console.log(fewestModsToMaxArray)
      const smallestIntRecDiffArray = findSmallestIntRecDiff(fewestModsToMaxArray)
      const finalArray = sortArray(smallestIntRecDiffArray, 'intellect')
      // console.log(finalArray)
      const bestLoadout = findingTieLoadouts(finalArray)
      // console.log(bestLoadout)
      const unusedArmor = findZeroArmorCountLoadouts(bestLoadout)
      if (unusedArmor) {
        tieLoadouts.push(loadoutsArray)
      }
      else {
        processOneLoadout(bestLoadout, topArray, middleArray, bottomArray)
      }
    }
  }
}
//---------------------------------------------------------------------------------------------------------------------------------------

export const calculateStats = (exoticArray, topArray, middleArray, bottomArray, userTier, noLoadouts, tieLoadouts) => {
  exoticArray.forEach((exotic) => {

    if (exotic.ignore) {
      return false
    }

    const exoticLoadouts = []
    const exoticName = exotic.name
    const exoticType = exotic.itemSubType
    const exoticInstance = exotic.itemInstanceId

    let exoticMobility = exotic.baseStats.mobility + 2
    let exoticResilience = exotic.baseStats.resilience + 2
    let exoticRecovery = exotic.baseStats.recovery + 2
    let exoticDiscipline = exotic.baseStats.discipline + 2
    let exoticIntellect = exotic.baseStats.intellect + 2
    let exoticStrength = exotic.baseStats.strength + 2

    //Then we move on to the target of this evaluation function...
    topArray.forEach((top) => {

      if (top.ignore) {
        return false
      }

      let topMobility = top.baseStats.mobility + 2
      let topResilience = top.baseStats.resilience + 2
      let topRecovery = top.baseStats.recovery + 2
      let topDiscipline = top.baseStats.discipline + 2
      let topIntellect = top.baseStats.intellect + 2
      let topStrength = top.baseStats.strength + 2

      middleArray.forEach((middle) => {

        if (middle.ignore) {
          return false
        }

        let middleMobility = middle.baseStats.mobility + 2
        let middleResilience = middle.baseStats.resilience + 2
        let middleRecovery = middle.baseStats.recovery + 2
        let middleDiscipline = middle.baseStats.discipline + 2
        let middleIntellect = middle.baseStats.intellect + 2
        let middleStrength = middle.baseStats.strength + 2

        bottomArray.forEach((bottom) => {

          if (bottom.ignore) {
            return false
          }

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

        })

      })
    })

    if (exoticLoadouts.length === 0) {
      noLoadouts.push(exoticName)
    }

    else {

      const filteredArmorArray = findingBestLoadouts(exoticLoadouts)

      findLoadoutsToKeep(filteredArmorArray, topArray, middleArray, bottomArray, tieLoadouts)

    }
  })
}

export const organizeAndSetArray = (array, setArray) => {
  array.forEach((item) => {
    item.loadouts.sort((a, b) => {
      return b.stats.totalIntRec - a.stats.totalIntRec
    })
  })

  array.sort((a, b) => {
    return b.counter - a.counter
  })

  const copyArray = [...array]
  setArray(copyArray)
}

const forceSetArmorCounter = (loadouts) => {
  loadouts.forEach(loadout => {
    loadout.armorCounter = [1, 1, 1]
  })

  return loadouts
}

export const processingLeftoverLoadouts = (exoticLoadout, topArray, middleArray, bottomArray, armorInfoArray, tieLoadouts) => {

  exoticLoadout.forEach((loadout) => {
    const instanceIds = loadout.instanceIds
    const topArmor = topArray.filter((choice) => choice.itemInstanceId === instanceIds[0])
    const middleArmor = middleArray.filter((choice) => choice.itemInstanceId === instanceIds[1])
    const bottomArmor = bottomArray.filter((choice) => choice.itemInstanceId === instanceIds[2])
    // loadout.armorCounter = [topArmor[0].counter, middleArmor[0].counter, bottomArmor[0].counter]
    armorInfoArray.push({ "instanceIds": instanceIds, "armorCounter": [topArmor[0].counter, middleArmor[0].counter, bottomArmor[0].counter] })
  })


  exoticLoadout.forEach(loadout => {
    const updatedLoadoutInfo = armorInfoArray.find(info => info.instanceIds === loadout.instanceIds)
    loadout.armorCounter = updatedLoadoutInfo.armorCounter
  })


  if (armorInfoArray.every(info => !info.armorCounter.includes(0))) {
    findLoadoutsToKeep(exoticLoadout, topArray, middleArray, bottomArray, tieLoadouts)
  }
  else if (armorInfoArray.every(info => info.armorCounter.includes(0))) {
    const finalLoadout = forceSetArmorCounter(exoticLoadout)
    findLoadoutsToKeep(finalLoadout, topArray, middleArray, bottomArray, tieLoadouts)
  }
  else {
    if (checkForLargeDifference(exoticLoadout)) {
      // console.log(exoticLoadout)
      // const filteredArray = exoticLoadout.filter(loadout => !loadout.armorCounter.includes(0))
      const intellectLoadouts = exoticLoadout.filter(loadout => loadout.stats.intellect > loadout.stats.recovery)
      const recoveryLoadouts = exoticLoadout.filter(loadout => loadout.stats.recovery > loadout.stats.intellect)
      const zeroIntellect = intellectLoadouts.every(loadout => loadout.armorCounter.includes(0))
      const zeroRecovery = recoveryLoadouts.every(loadout => loadout.armorCounter.includes(0))
      if (!zeroIntellect && !zeroRecovery) {
        // Both arrays have loadouts with non-zero armor counters
        const finalArray = exoticLoadout.filter(loadout => !loadout.armorCounter.includes(0))
        findLoadoutsToKeep(finalArray, topArray, middleArray, bottomArray, tieLoadouts)

      }
      else if (zeroIntellect && !zeroRecovery) {
        // Intellect array only has armor counters containing zero
        const filteredRecoveryLoadouts = recoveryLoadouts.filter(loadout => !loadout.armorCounter.includes(0))
        const someMasterworked = intellectLoadouts.some(loadout => loadout.allMasterworked)
        if (someMasterworked) {
          const finalIntellectLoadouts = intellectLoadouts.filter(loadout => loadout.allMasterworked)
          const combinedArray = [...finalIntellectLoadouts, ...filteredRecoveryLoadouts]
          const finalArray = forceSetArmorCounter(combinedArray)
          findLoadoutsToKeep(finalArray, topArray, middleArray, bottomArray, tieLoadouts)
        }
        else {
          const combinedArray = [...intellectLoadouts, ...filteredRecoveryLoadouts]
          const finalArray = forceSetArmorCounter(combinedArray)
          findLoadoutsToKeep(finalArray, topArray, middleArray, bottomArray, tieLoadouts)
        }
      }
      else if (!zeroIntellect && zeroRecovery) {
        // Recovery array only has armor counters containing zero
        const filteredIntellectLoadouts = intellectLoadouts.filter(loadout => !loadout.armorCounter.includes(0))
        const someMasterworked = recoveryLoadouts.some(loadout => loadout.allMasterworked)
        if (someMasterworked) {
          const finalRecoveryLoadouts = recoveryLoadouts.filter(loadout => loadout.allMasterworked)
          const combinedArray = [...finalRecoveryLoadouts, ...filteredIntellectLoadouts]
          const finalArray = forceSetArmorCounter(combinedArray)
          findLoadoutsToKeep(finalArray, topArray, middleArray, bottomArray, tieLoadouts)
        }
        else {
          const combinedArray = [...recoveryLoadouts, ...filteredIntellectLoadouts]
          const finalArray = forceSetArmorCounter(combinedArray)
          findLoadoutsToKeep(finalArray, topArray, middleArray, bottomArray, tieLoadouts)
        }
      }
      else {
        // Both arrays only have loadouts with armor counters containing zero
        console.log(exoticLoadout[0].exoticName)
      }
    }
    else {
      const finalArray = exoticLoadout.filter(loadout => !loadout.armorCounter.includes(0))
      findLoadoutsToKeep(finalArray, topArray, middleArray, bottomArray, tieLoadouts)
    }
  }
}



//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// A function to compare individual stats 1:1
// Returns a boolean
const compareStat = (originalStats, comparisonStats, statType, comparisonType) => {
  // If the parent functions calls for equality:
  if (comparisonType === "equal") {
    // Compare the stats
    const dupeStat = originalStats[statType] === comparisonStats[statType]
    // Return the boolean
    return dupeStat
  }
  // If the parent function calls for equal or greater comparison:
  if (comparisonType === "equalOrGreater") {
    // Compare the stats
    const dupeStat = originalStats[statType] <= comparisonStats[statType]
    // Return the boolean
    return dupeStat
  }
}


// A function to find items with duplicate stats
// Returns a boolean 
const findDuplicateItem = (originalStats, comparisonItem) => {
  // Define a stats path for the comparison item:
  const comparisonStats = comparisonItem.baseStats
  // Define a boolean variable for each stat comparison:
  const dupeMobility = compareStat(originalStats, comparisonStats, 'mobility', 'equal')
  const dupeResilience = compareStat(originalStats, comparisonStats, 'resilience', 'equal')
  const dupeRecovery = compareStat(originalStats, comparisonStats, 'recovery', 'equal')
  const dupeDiscipline = compareStat(originalStats, comparisonStats, 'discipline', 'equal')
  const dupeIntellect = compareStat(originalStats, comparisonStats, 'intellect', 'equal')
  const dupeStrength = compareStat(originalStats, comparisonStats, 'strength', 'equal')
  // Define a boolean variable for item hash comparison
  // If all stats are identical return true:
  if (dupeMobility && dupeResilience && dupeRecovery && dupeDiscipline && dupeIntellect && dupeStrength) {
    return true
  }
  // If as little as one stat is not identical return false:
  return false
}


// A function that finds vendor armor that is currently owned by the user
// Changes the ignore property on the vendor armor item to true
const filterOutVendorDupes = (legendaryArray, exoticArray) => {
  // Create a copy of the legendary array
  const copyArray = [...legendaryArray, ...exoticArray]
  // Create an array of vendor items
  const vendorItems = copyArray.filter((item) => item.vendor !== undefined)
  // Create an array of user items
  const ownedItems = copyArray.filter((item) => item.vendor === undefined)
  // Create an array of user item's item hashes
  const ownedHashes = ownedItems.map(item => item.itemHash)
  // For each vendor item:
  vendorItems.forEach(vendorItem => {
    // If the vendor item's item hash is included in the array of owned item hashes
    if (ownedHashes.includes(vendorItem.itemHash)) {
      // Create an array of owned items that match the vendor item's hash
      const ownedDupes = ownedItems.filter(owned => owned.itemHash === vendorItem.itemHash)
      // For every owned duplicate
      ownedDupes.every(dupe => {
        // Check to see if the base stats are itentical:
        const exactMatch = findDuplicateItem(vendorItem.baseStats, dupe)
        // If the base stats are itentical
        if (exactMatch) {
          // Set the vendor items ignore property to true
          vendorItem.ignore = true
          // Return false to exit the every iteration
          return false
        }
        // If the base stats aren't identical return true to continue
        return true
      })
    }
  })
}


// A function that resets certian armor properties before evaluation
// Resets armor counter to 0, and empties out armor's loadout array
export const resetEvaluation = (armorArray, exoticArray) => {
  // For each armor item
  armorArray.forEach((armor) => {
    // Reset it's counter to 0
    armor.counter = 0
    // Empty it's loadouts array
    armor.loadouts = []
  })
  // Find vendor duplicates and set thier ignore property to true
  filterOutVendorDupes(armorArray, exoticArray)
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const filterOutVendorExotics = (exoticArray) => {
  const copyArray = [...exoticArray]
  copyArray.forEach(exotic => {
    if (exotic.vendor !== undefined) {
      exotic.ignore = true
    }
  })

  return copyArray
  // return exoticArray.filter((exotic) => exotic.vendor === undefined)
}

const LegendaryArmorEvaluation = (helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts) => {
  const noLoadouts = []
  const tieLoadouts = []
  
  //Reset counters and necessary arrays to 0 and empty respectfully
  resetEvaluation(helmets, exoticHelmets)
  resetEvaluation(gauntlets, exoticGauntlets)
  resetEvaluation(chests, exoticChests)
  resetEvaluation(legs, exoticLegs)
  
  const filteredExoticHelmets = filterOutVendorExotics(exoticHelmets)
  const filteredExoticGauntlets = filterOutVendorExotics(exoticGauntlets)
  const filteredExoticChests = filterOutVendorExotics(exoticChests)
  const filteredExoticLegs = filterOutVendorExotics(exoticLegs)

  //First we start with Exotic Helmets...
  calculateStats(filteredExoticHelmets, gauntlets, chests, legs, userTier, noLoadouts, tieLoadouts)

  //Then with Exotic Gauntlets...
  calculateStats(filteredExoticGauntlets, helmets, chests, legs, userTier, noLoadouts, tieLoadouts)

  //Next we go through all the Exotic Chests...
  calculateStats(filteredExoticChests, helmets, gauntlets, legs, userTier, noLoadouts, tieLoadouts)

  //Lastly we go through the Exotic Legs...
  calculateStats(filteredExoticLegs, helmets, gauntlets, chests, userTier, noLoadouts, tieLoadouts)

  //Here is where we'll eventually setArmor and maybe some other housekeeping stuff...

  if (tieLoadouts.length !== 0) {
    tieLoadouts.forEach((exoticLoadout) => {
      const armorInfoArray = []
      if (exoticLoadout[0].exoticType === "Helmet") {
        processingLeftoverLoadouts(exoticLoadout, gauntlets, chests, legs, armorInfoArray, tieLoadouts)
      }
      if (exoticLoadout[0].exoticType === "Gauntlets") {
        processingLeftoverLoadouts(exoticLoadout, helmets, chests, legs, armorInfoArray, tieLoadouts)
      }
      if (exoticLoadout[0].exoticType === "Chest Armor") {
        processingLeftoverLoadouts(exoticLoadout, helmets, gauntlets, legs, armorInfoArray, tieLoadouts)
      }
      if (exoticLoadout[0].exoticType === "Leg Armor") {
        processingLeftoverLoadouts(exoticLoadout, helmets, gauntlets, chests, armorInfoArray, tieLoadouts)
      }
    })
  }

  //Sort and set each Armor array...
  organizeAndSetArray(helmets, setHelmets)
  organizeAndSetArray(gauntlets, setGauntlets)
  organizeAndSetArray(chests, setChests)
  organizeAndSetArray(legs, setLegs)

  setNoLoadouts(noLoadouts)
}

export default LegendaryArmorEvaluation
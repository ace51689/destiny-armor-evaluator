export const findingBestLoadouts = (armorArray) => {
  armorArray.sort((a, b) => {
    return b.stats.totalIntRec - a.stats.totalIntRec
  })

  let n = armorArray[0].stats.totalIntRec

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

export const filterLoadouts = (totalTier, userInput, statsObject, loadoutArray, top, middle, bottom, exotic) => {
  const topStat = userInput.topStat
  const bottomStat = userInput.bottomStat

  if (totalTier >= userInput.totalTier) {
    if (statsObject[topStat.type] >= topStat.value) {
      if (statsObject[bottomStat.type] >= bottomStat.value) {
        const instanceIds = [top.itemInstanceId, middle.itemInstanceId, bottom.itemInstanceId]
        const allMasterworked = top.isMasterworked && middle.isMasterworked && bottom.isMasterworked

        const names = {
          top: top.owned ? top.name : `${top.name}*`,
          middle: middle.owned ? middle.name : `${middle.name}*`,
          bottom: bottom.owned ? bottom.name : `${bottom.name}*`,
          exotic: exotic.owned ? exotic.name : `${exotic.name}*`
        }

        let numberMasterworked = 0
        if (top.isMasterworked) {
          numberMasterworked += 1
        }
        if (middle.isMasterworked) {
          numberMasterworked += 1
        }
        if (bottom.isMasterworked) {
          numberMasterworked += 1
        }

        let containsVendor = 0
        if (!top.owned) {
          containsVendor += 1
        }
        if (!middle.owned) {
          containsVendor += 1
        }
        if (!bottom.owned) {
          containsVendor += 1
        }

        loadoutArray.push({
          "loadout": `Tier ${totalTier}: ${names.exotic} - ${names.top} - ${names.middle} - ${names.bottom}`,
          "stats": statsObject,
          "instanceIds": instanceIds,
          "exoticName": exotic.name,
          "exoticType": exotic.itemSubType,
          "exoticInstance": exotic.itemInstanceId,
          "armorCounter": [top.counter, middle.counter, bottom.counter],
          "containsVendor": containsVendor,
          "allMasterworked": allMasterworked,
          "numberMasterworked": numberMasterworked
        })
      }
    }
  }
}


const findPointsToMax = (tierValue, statType) => {
  let finalTier = tierValue
  const threePointStats = ['mobility', 'resilience', 'discipline', 'strength']
  let minorMod
  let majorMod
  if (threePointStats.includes(statType)) {
    minorMod = 1
    majorMod = 3
  }
  else if (statType === "recovery") {
    minorMod = 2
    majorMod = 4
  }
  else if (statType === "intellect") {
    minorMod = 2
    majorMod = 5
  }

  let points = 0
  if (tierValue !== Math.floor(tierValue)) {
    finalTier += 0.5
    points += minorMod
  }

  const pointsToMax = points += (10 - finalTier) * majorMod
  return pointsToMax
}


export const getLoadoutStats = (statsArray, userInput) => {
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

  const topStatTier = statsObject[userInput.topStat.type]
  const bottomStatTier = statsObject[userInput.bottomStat.type]

  statsObject.totalIntRec = topStatTier + bottomStatTier

  statsObject.intRecDiff = Math.abs(topStatTier - bottomStatTier)

  statsObject.numberOfMods = (10 - Math.floor(topStatTier)) + (10 - Math.floor(bottomStatTier))

  const topStatPointsToMax = findPointsToMax(topStatTier, userInput.topStat.type)
  const bottomStatPointsToMax = findPointsToMax(bottomStatTier, userInput.bottomStat.type)

  statsObject.pointsFromMax = topStatPointsToMax + bottomStatPointsToMax

  statsObject.practicalTotal = tierArray.reduce((a, b) => {
    return a + b
  })

  return statsObject
}

const addLoadout = (chosen, loadout, choiceId) => {
  chosen.find((choice) => {
    // console.log(choice)
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


export const determinePriority = (userInput) => {
  const topStatType = userInput.topStat.type
  const bottomStatType = userInput.bottomStat.type
  const statCosts = {
    mobility: 3,
    resilience: 3,
    recovery: 4,
    discipline: 3,
    intellect: 5,
    strength: 3,
  }

  if (statCosts[topStatType] < statCosts[bottomStatType]) {
    return "bottomStat"
  }
  if (statCosts[topStatType] > statCosts[bottomStatType]) {
    return "topStat"
  }
  else {
    return "practicalTotal"
  }
}

export const sortArray = (array, type, userInput) => {
  const tieBreakOne = userInput.tieBreakOne
  const tieBreakTwo = userInput.tieBreakTwo
  const topStat = userInput.topStat.type
  const bottomStat = userInput.bottomStat.type
  array
    .sort((a, b) => b.stats[tieBreakTwo] - a.stats[tieBreakTwo])
    .sort((a, b) => b.stats[tieBreakOne] - a.stats[tieBreakOne])
  if (type === "topStat") {
    array
      .sort((a, b) => b.stats[bottomStat] - a.stats[bottomStat])
      .sort((a, b) => b.stats[topStat] - a.stats[topStat])
  }
  if (type === "bottomStat") {
    array
      .sort((a, b) => b.stats[topStat] - a.stats[topStat])
      .sort((a, b) => b.stats[bottomStat] - a.stats[bottomStat])
  }
  if (type === "practicalTotal") {
    array
      .sort((a, b) => b.stats.practicalTotal - a.stats.practicalTotal)
  }

  return array
}

const findingTieLoadouts = (array, type, userInput) => {
  const topLoadout = array.shift()
  
  if (topLoadout.exoticName === "Eternal Warrior") {
    console.log(topLoadout)
    console.log(array)
  }

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
      const finalArmorArray = sortArray(sortedArmorArray, type, userInput)

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
      const finalArmorArray = sortArray(sortedArmorArray, type, userInput)

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
      const finalArmorArray = sortArray(filteredArmorArray, type, userInput)

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

const processOneLoadout = (array, topArray, middleArray, bottomArray, exoticArray) => {
  // console.log(array)
  const onlyLoadout = assignVariables(array)
  const topId = onlyLoadout.instanceIds[0]
  const middleId = onlyLoadout.instanceIds[1]
  const bottomId = onlyLoadout.instanceIds[2]
  const exoticId = onlyLoadout.exoticInstance
  addLoadout(topArray, onlyLoadout, topId)
  addLoadout(middleArray, onlyLoadout, middleId)
  addLoadout(bottomArray, onlyLoadout, bottomId)
  addLoadout(exoticArray, onlyLoadout, exoticId)
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
const checkForLargeDifference = (loadouts, userInput) => {
  const topStatType = userInput.topStat.type
  const bottomStatType = userInput.bottomStat.type
  if (loadouts.every(loadout => loadout.stats.intRecDiff >= 1)) {
    const highTopStatLoadout = loadouts.some(loadout => loadout.stats[topStatType] > loadout.stats[bottomStatType])
    const highBottomStatLoadout = loadouts.some(loadout => loadout.stats[bottomStatType] > loadout.stats[topStatType])
    if (highTopStatLoadout && highBottomStatLoadout) {
      return true
    }
  }
  return false
}

const findInverseLoadouts = (loadouts, userInput) => {
  const topStatType = userInput.topStat.type
  const bottomStatType = userInput.bottomStat.type

  const topStatFocusedArray = loadouts.filter(loadout => loadout.stats[topStatType] > loadout.stats[bottomStatType])
  let filteredTopStatArray
  if (topStatFocusedArray.some(loadout => loadout.stats.intRecDiff <= 1.5)) {
    filteredTopStatArray = topStatFocusedArray.filter(loadout => loadout.stats.intRecDiff <= 1.5)
  }
  else {
    filteredTopStatArray = [...topStatFocusedArray]
  }

  const bottomStatFocusedArray = loadouts.filter(loadout => loadout.stats[bottomStatType] > loadout.stats[topStatType])
  let filteredBottomStatArray
  if (bottomStatFocusedArray.some(loadout => loadout.stats.intRecDiff <= 1.5)) {
    filteredBottomStatArray = bottomStatFocusedArray.filter(loadout => loadout.stats.intRecDiff <= 1.5)
  }
  else {
    filteredBottomStatArray = [...bottomStatFocusedArray]
  }

  const topStatSortedArray = sortArray(filteredTopStatArray, "topStat", userInput)
  const bottomStatSortedArray = sortArray(filteredBottomStatArray, "bottomStat", userInput)

  const finalTopStatArray = findingTieLoadouts(topStatSortedArray, "topStat", userInput)
  const finalBottomStatArray = findingTieLoadouts(bottomStatSortedArray, "bottomStat", userInput)

  return {
    recoveryLoadout: finalTopStatArray,
    intellectLoadout: finalBottomStatArray,
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
// const findsmallestPointsFromMax = (loadouts) => {
//   loadouts.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
//   const smallestPointsFromMax = loadouts[0].stats.pointsFromMax
//   const smallestPointsFromMaxArray = loadouts.filter(loadout => loadout.stats.pointsFromMax === smallestPointsFromMax)
//   return smallestPointsFromMaxArray
// }

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

const findLoadoutsToKeep = (userInput, loadoutsArray, topArray, middleArray, bottomArray, tieLoadouts, exoticArray) => {
  // console.log(loadoutsArray[0].exoticName)
  if (loadoutsArray[0].exoticName === "Mk. 44 Stand Asides") {
    console.log(loadoutsArray)
  }
  if (loadoutsArray.length === 1) {
    //If there's only one loadout that meets the user's criteria:
    // console.log(loadoutsArray)
    processOneLoadout(loadoutsArray, topArray, middleArray, bottomArray, exoticArray)
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
    const sortType = determinePriority(userInput)
    const finalArray = sortArray(smallestIntRecDiffArray, sortType, userInput)
    //process that loadout.
    const bestLoadout = findingTieLoadouts(finalArray, sortType, userInput)
    // const unusedArmor = findZeroArmorCountLoadouts(bestLoadout)
    // if (unusedArmor) {
    //   tieLoadouts.push(loadoutsArray)
    // }
    // else {
    processOneLoadout(bestLoadout, topArray, middleArray, bottomArray, exoticArray)
    // }
  }
  else if (loadoutsArray.every(loadout => loadout.stats.totalIntRec !== Math.floor(loadout.stats.totalIntRec))) {
    //If every loadout in the array has a totalIntRec that ends in a .5:
    //No need to filter by number of mods to max, all that end in .5 need the same number of mods to max
    //Check for a large difference:
    const largeDifference = checkForLargeDifference(loadoutsArray, userInput)
    if (largeDifference) {
      const finalLoadouts = findInverseLoadouts(loadoutsArray, userInput)
      const unusedIntellect = findZeroArmorCountLoadouts(finalLoadouts.intellectLoadout)
      const unusedRecovery = findZeroArmorCountLoadouts(finalLoadouts.recoveryLoadout)
      if (unusedIntellect || unusedRecovery) {
        tieLoadouts.push(loadoutsArray)
      }
      else {
        processOneLoadout(finalLoadouts.intellectLoadout, topArray, middleArray, bottomArray, exoticArray)
        processOneLoadout(finalLoadouts.recoveryLoadout, topArray, middleArray, bottomArray, exoticArray)
      }
    }
    else {
      const smallestIntRecDiffArray = findSmallestIntRecDiff(loadoutsArray)
      //Sort by intellect
      const sortType = determinePriority(userInput)
      const finalArray = sortArray(smallestIntRecDiffArray, sortType, userInput)
      //process that loadout.
      const bestLoadout = findingTieLoadouts(finalArray, sortType, userInput)
      // console.log(bestLoadout)
      const unusedArmor = findZeroArmorCountLoadouts(bestLoadout)
      if (unusedArmor) {
        tieLoadouts.push(loadoutsArray)
      }
      else {
        processOneLoadout(bestLoadout, topArray, middleArray, bottomArray, exoticArray)
      }
    }

  }
  else {
    //If every loadout in the array has varying totalIntRec stats:
    const fewestModsToMaxArray = findFewestModsToMax(loadoutsArray)
    const largeDifference = checkForLargeDifference(fewestModsToMaxArray, userInput)
    if (largeDifference) {
      const finalLoadouts = findInverseLoadouts(fewestModsToMaxArray, userInput)
      const unusedIntellect = findZeroArmorCountLoadouts(finalLoadouts.intellectLoadout)
      const unusedRecovery = findZeroArmorCountLoadouts(finalLoadouts.recoveryLoadout)
      if (unusedIntellect || unusedRecovery) {
        tieLoadouts.push(loadoutsArray)
      }
      else {
        processOneLoadout(finalLoadouts.intellectLoadout, topArray, middleArray, bottomArray, exoticArray)
        processOneLoadout(finalLoadouts.recoveryLoadout, topArray, middleArray, bottomArray, exoticArray)
      }
    }
    else {
      // console.log(fewestModsToMaxArray)
      const smallestIntRecDiffArray = findSmallestIntRecDiff(fewestModsToMaxArray)
      const sortType = determinePriority(userInput)
      const finalArray = sortArray(smallestIntRecDiffArray, sortType, userInput)
      // console.log(finalArray)
      const bestLoadout = findingTieLoadouts(finalArray, sortType, userInput)
      // console.log(bestLoadout)
      const unusedArmor = findZeroArmorCountLoadouts(bestLoadout)
      if (unusedArmor) {
        tieLoadouts.push(loadoutsArray)
      }
      else {
        processOneLoadout(bestLoadout, topArray, middleArray, bottomArray, exoticArray)
      }
    }
  }
}
//---------------------------------------------------------------------------------------------------------------------------------------

export const calculateStats = (exoticArray, topArray, middleArray, bottomArray, userInput, noLoadouts, tieLoadouts) => {
  exoticArray.forEach((exotic) => {

    if (exotic.ignore) {
      return false
    }

    const exoticLoadouts = []

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

          const statsObject = getLoadoutStats(statsArray, userInput)

          filterLoadouts(totalTier, userInput, statsObject, exoticLoadouts, top, middle, bottom, exotic)

        })

      })
    })

    if (exoticLoadouts.length === 0) {
      noLoadouts.push(exotic.name)
    }

    else {

      const filteredArmorArray = findingBestLoadouts(exoticLoadouts)

      findLoadoutsToKeep(userInput, filteredArmorArray, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)

    }
  })
}

export const organizeAndSetArray = (array, setArray, type) => {
  if (type === "legendary") {
    array.forEach((item) => {
      item.loadouts.sort((a, b) => {
        return b.stats.totalIntRec - a.stats.totalIntRec
      })
    })
  
    array.sort((a, b) => {
      return b.counter - a.counter
    })
  }
  if (type === "exotic") {
    array.sort((a, b) => a.itemHash - b.itemHash)
  }

  const copyArray = [...array]
  setArray(copyArray)
}

const forceSetArmorCounter = (loadouts) => {
  loadouts.forEach(loadout => {
    loadout.armorCounter = [1, 1, 1]
  })

  return loadouts
}

export const processingLeftoverLoadouts = (userInput, exoticLoadout, topArray, middleArray, bottomArray, armorInfoArray, tieLoadouts, exoticArray) => {
  const topStatType = userInput.topStat.type
  const bottomStatType = userInput.bottomStat.type

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
    findLoadoutsToKeep(userInput, exoticLoadout, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)
  }
  else if (armorInfoArray.every(info => info.armorCounter.includes(0))) {
    const finalLoadout = forceSetArmorCounter(exoticLoadout)
    findLoadoutsToKeep(userInput, finalLoadout, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)
  }
  else {
    if (checkForLargeDifference(exoticLoadout, userInput)) {
      // console.log(exoticLoadout)
      // const filteredArray = exoticLoadout.filter(loadout => !loadout.armorCounter.includes(0))
      const intellectLoadouts = exoticLoadout.filter(loadout => loadout.stats[bottomStatType] > loadout.stats[topStatType])
      const recoveryLoadouts = exoticLoadout.filter(loadout => loadout.stats[topStatType] > loadout.stats[bottomStatType])
      const zeroIntellect = intellectLoadouts.every(loadout => loadout.armorCounter.includes(0))
      const zeroRecovery = recoveryLoadouts.every(loadout => loadout.armorCounter.includes(0))
      if (!zeroIntellect && !zeroRecovery) {
        // Both arrays have loadouts with non-zero armor counters
        const finalArray = exoticLoadout.filter(loadout => !loadout.armorCounter.includes(0))
        findLoadoutsToKeep(userInput, finalArray, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)

      }
      else if (zeroIntellect && !zeroRecovery) {
        // Intellect array only has armor counters containing zero
        const filteredRecoveryLoadouts = recoveryLoadouts.filter(loadout => !loadout.armorCounter.includes(0))
        const someMasterworked = intellectLoadouts.some(loadout => loadout.allMasterworked)
        if (someMasterworked) {
          const finalIntellectLoadouts = intellectLoadouts.filter(loadout => loadout.allMasterworked)
          const combinedArray = [...finalIntellectLoadouts, ...filteredRecoveryLoadouts]
          const finalArray = forceSetArmorCounter(combinedArray)
          findLoadoutsToKeep(userInput, finalArray, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)
        }
        else {
          const combinedArray = [...intellectLoadouts, ...filteredRecoveryLoadouts]
          const finalArray = forceSetArmorCounter(combinedArray)
          findLoadoutsToKeep(userInput, finalArray, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)
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
          findLoadoutsToKeep(userInput, finalArray, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)
        }
        else {
          const combinedArray = [...recoveryLoadouts, ...filteredIntellectLoadouts]
          const finalArray = forceSetArmorCounter(combinedArray)
          findLoadoutsToKeep(userInput, finalArray, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)
        }
      }
      else {
        // Both arrays only have loadouts with armor counters containing zero
        console.log(exoticLoadout[0].exoticName)
      }
    }
    else {
      const finalArray = exoticLoadout.filter(loadout => !loadout.armorCounter.includes(0))
      findLoadoutsToKeep(userInput, finalArray, topArray, middleArray, bottomArray, tieLoadouts, exoticArray)
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
  const dupeRecovery = compareStat(originalStats, comparisonStats, "recovery", 'equal')
  const dupeDiscipline = compareStat(originalStats, comparisonStats, 'discipline', 'equal')
  const dupeIntellect = compareStat(originalStats, comparisonStats, "intellect", 'equal')
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
export const resetEvaluation = (armorArray, exoticArray, userInput) => {
  // For each armor item
  armorArray.forEach((armor) => {
    // Reset it's counter to 0
    armor.counter = 0
    // Empty it's loadouts array
    armor.loadouts = []
  })

  exoticArray.forEach((exotic) => {
    exotic.counter = 0
    exotic.loadouts = []
  })

  const topStatType = userInput.topStat.type
  const bottomStatType = userInput.bottomStat.type
  armorArray
    .sort((a, b) => b.baseStats[userInput.tieBreakTwo] - a.baseStats[userInput.tieBreakTwo])
    .sort((a, b) => b.baseStats[userInput.tieBreakOne] - a.baseStats[userInput.tieBreakOne])
    .sort((a, b) => (b.baseStats[topStatType] + b.baseStats[bottomStatType]) - (a.baseStats[topStatType] + a.baseStats[bottomStatType]))

  exoticArray
    .sort((a, b) => b.baseStats[userInput.tieBreakTwo] - a.baseStats[userInput.tieBreakTwo])
    .sort((a, b) => b.baseStats[userInput.tieBreakOne] - a.baseStats[userInput.tieBreakOne])
    .sort((a, b) => (b.baseStats[topStatType] + b.baseStats[bottomStatType]) - (a.baseStats[topStatType] + a.baseStats[bottomStatType]))

  // Find vendor duplicates and set thier ignore property to true
  filterOutVendorDupes(armorArray, exoticArray)
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const filterOutVendorExotics = (exoticArray, ignoreXur) => {
  const copyArray = [...exoticArray]
  copyArray.forEach(exotic => {
    if (exotic.vendor !== undefined && ignoreXur) {
      exotic.ignore = true
    }
    else if (exotic.vendor !== undefined) {
      exotic.ignore = false
    }
  })

  return copyArray
  // return exoticArray.filter((exotic) => exotic.vendor === undefined)
}

const LegendaryArmorEvaluation = (
  helmets, exoticHelmets, setHelmets, setExoticHelmets, gauntlets, exoticGauntlets, setGauntlets, setExoticGauntlets,
  chests, exoticChests, setChests, setExoticChests, legs, exoticLegs, setLegs, setExoticLegs, userInput, setNoLoadouts, ignoreXur
) => {
  const noLoadouts = []
  const tieLoadouts = []

  //Reset counters and necessary arrays to 0 and empty respectfully
  resetEvaluation(helmets, exoticHelmets, userInput)
  resetEvaluation(gauntlets, exoticGauntlets, userInput)
  resetEvaluation(chests, exoticChests, userInput)
  resetEvaluation(legs, exoticLegs, userInput)

  const filteredExoticHelmets = filterOutVendorExotics(exoticHelmets, ignoreXur)
  const filteredExoticGauntlets = filterOutVendorExotics(exoticGauntlets, ignoreXur)
  const filteredExoticChests = filterOutVendorExotics(exoticChests, ignoreXur)
  const filteredExoticLegs = filterOutVendorExotics(exoticLegs, ignoreXur)

  //First we start with Exotic Helmets...
  calculateStats(filteredExoticHelmets, gauntlets, chests, legs, userInput, noLoadouts, tieLoadouts)

  //Then with Exotic Gauntlets...
  calculateStats(filteredExoticGauntlets, helmets, chests, legs, userInput, noLoadouts, tieLoadouts)

  //Next we go through all the Exotic Chests...
  calculateStats(filteredExoticChests, helmets, gauntlets, legs, userInput, noLoadouts, tieLoadouts)

  //Lastly we go through the Exotic Legs...
  calculateStats(filteredExoticLegs, helmets, gauntlets, chests, userInput, noLoadouts, tieLoadouts)

  //Here is where we'll eventually setArmor and maybe some other housekeeping stuff...

  if (tieLoadouts.length !== 0) {
    tieLoadouts.forEach((exoticLoadout) => {
      const armorInfoArray = []
      if (exoticLoadout[0].exoticType === "Helmet") {
        processingLeftoverLoadouts(userInput, exoticLoadout, gauntlets, chests, legs, armorInfoArray, tieLoadouts, exoticHelmets)
      }
      if (exoticLoadout[0].exoticType === "Gauntlets") {
        processingLeftoverLoadouts(userInput, exoticLoadout, helmets, chests, legs, armorInfoArray, tieLoadouts, exoticGauntlets)
      }
      if (exoticLoadout[0].exoticType === "Chest Armor") {
        processingLeftoverLoadouts(userInput, exoticLoadout, helmets, gauntlets, legs, armorInfoArray, tieLoadouts, exoticChests)
      }
      if (exoticLoadout[0].exoticType === "Leg Armor") {
        processingLeftoverLoadouts(userInput, exoticLoadout, helmets, gauntlets, chests, armorInfoArray, tieLoadouts, exoticLegs)
      }
    })
  }

  //Sort and set each Armor array...
  organizeAndSetArray(helmets, setHelmets, "legendary")
  organizeAndSetArray(gauntlets, setGauntlets, "legendary")
  organizeAndSetArray(chests, setChests, "legendary")
  organizeAndSetArray(legs, setLegs, "legendary")
  organizeAndSetArray(exoticHelmets, setExoticHelmets, "exotic")
  organizeAndSetArray(exoticGauntlets, setExoticGauntlets, "exotic")
  organizeAndSetArray(exoticChests, setExoticChests, "exotic")
  organizeAndSetArray(exoticLegs, setExoticLegs, "exotic")

  setNoLoadouts(noLoadouts)
}

export default LegendaryArmorEvaluation
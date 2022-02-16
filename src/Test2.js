const findingBestLoadouts = (armorArray) => {
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

export const filterLoadouts = (totalTier, userTier, statsObject, loadoutArray, top, middle, bottom, exoticName, exoticType) => {
  // const instanceIds = { "topId": top.itemInstanceId, "middleId": middle.itemInstanceId, "bottomId": bottom.itemInstanceId }
  const instanceIds = [top.itemInstanceId, middle.itemInstanceId, bottom.itemInstanceId]

  if (totalTier >= userTier.totalTier) {
    if (statsObject["recovery"] >= userTier.recovery) {
      if (statsObject["intellect"] >= userTier.intellect) {
        if (statsObject["recovery"] + statsObject["intellect"] >= userTier.average) {
          loadoutArray.push({
            "loadout": `Tier ${totalTier}: ${exoticName} - ${top.name} - ${middle.name} - ${bottom.name}`,
            "stats": statsObject,
            "instanceIds": instanceIds,
            "exoticName": exoticName,
            "exoticType": exoticType,
            "armorCounter": [top.counter, middle.counter, bottom.counter]
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
    if (choice[1].itemInstanceId === choiceId) {
      choice[1].counter += 1
      choice[1].loadouts.push(loadout)
      if (choice[1].pairedExotics !== undefined) {
        if (!choice[1].pairedExotics.includes(exoticName)) {
          choice[1].pairedExotics.push(exoticName)
        }
      }
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

const sortArray = (array, type) => {
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
    const finalArmorArray = sortArray(filteredArmorArray, type)
    finalArmorArray.sort((a, b) => b.stats.practicalTotal - a.stats.practicalTotal)
    return finalArmorArray
  }
}

const processOneLoadout = (array, topArray, middleArray, bottomArray) => {
  const onlyLoadout = assignVariables(array)
  const topId = onlyLoadout.instanceIds[0]
  const middleId = onlyLoadout.instanceIds[1]
  const bottomId = onlyLoadout.instanceIds[2]
  addLoadout(topArray, onlyLoadout, topId, onlyLoadout.exoticName)
  addLoadout(middleArray, onlyLoadout, middleId, onlyLoadout.exoticName)
  addLoadout(bottomArray, onlyLoadout, bottomId, onlyLoadout.exoticName)
}

const zeroArmorCounterGuard = (array, topArray, middleArray, bottomArray, tieLoadouts) => {
  if (array.every(loadout => loadout.armorCounter.includes(0)) || array[0].armorCounter.includes(0)) {
    tieLoadouts.push(array)
  }

  else {
    //Add the best intellect focused loadout:
    const finalArmorArray = findingTieLoadouts(array)
    if (finalArmorArray === false) {
      tieLoadouts.push(array)
    }
    else {
      processOneLoadout(finalArmorArray, topArray, middleArray, bottomArray)
    }
  }
}

const findSmallestDifference = (array) => {
  array.sort((a, b) => a.stats.numberOfMods - b.stats.numberOfMods)
  //Get the lowest number of mods needed to reach 10 INT - 10 REC:
  const fewestNumberOfMods = array[0].stats.numberOfMods
  //Keep loadouts that have the lowest number of mods needed to max INT & REC:
  const fewestNumberOfModsArray = array.filter(loadout => loadout.stats.numberOfMods === fewestNumberOfMods)
  //Sort the array lowest intRecDiff:
  fewestNumberOfModsArray.sort((a, b) => a.stats.intRecDiff - b.stats.intRecDiff)
  //Get the lowest intRecDiff:
  const lowestDifference = fewestNumberOfModsArray[0].stats.intRecDiff
  //Keep loadouts that have the lowest intRecDiff:
  return fewestNumberOfModsArray.filter(loadout => loadout.stats.intRecDiff === lowestDifference)
}


//A function that processes all of our exotic loadouts, using different conditionals:
const assignSimpleLoadouts = (array, topArray, middleArray, bottomArray, tieLoadouts) => {
  //If there is only one loadout in the array:
  if (array.length === 1) {
    //Add that one loadout:
    processOneLoadout(array, topArray, middleArray, bottomArray)
  }

  //If any loadout in the array has a totalIntRec of 19.5 or greater:
  else if (array.some(loadout => loadout.stats.totalIntRec >= 19.5)) {
    //Filter out any totals under 19.5:
    const filteredArmorArray = array.filter(loadout => loadout.stats.totalIntRec >= 19.5)
    //Sort by intellect:
    const sortedArmorArray = sortArray(filteredArmorArray, "intellect")
    //Add the best loadout:
    const finalArmorArray = findingTieLoadouts(sortedArmorArray, "intellect")
    if (finalArmorArray === false) {
      tieLoadouts.push(array)
    }
    else {
      processOneLoadout(finalArmorArray, topArray, middleArray, bottomArray)
    }
  }

  //If any loadout in the array has a totalIntRec of 19:
  else if (array.some(loadout => loadout.stats.totalIntRec === 19)) {
    //If every loadout has a combo of 9.5 and 9.5:
    if (array.every(loadout => loadout.stats.intellect !== 10 && loadout.stats.recovery !== 10)) {
      //Sort the array:
      const sortedArmorArray = sortArray(array)
      zeroArmorCounterGuard(sortedArmorArray, topArray, middleArray, bottomArray, tieLoadouts)
    }
    //If every loadout has a combo of 10 and 9:
    else if (array.every(loadout => loadout.stats.intellect === 10 || loadout.stats.recovery === 10)) {
      //Sort the array by intellect:
      const sortedArmorArray = sortArray(array, "intellect")
      zeroArmorCounterGuard(sortedArmorArray, topArray, middleArray, bottomArray, tieLoadouts)
    }
    //If there are loadouts of both 9.5-9.5 AND 10-9:
    else {
      //Filter out the 9.5-9.5 loadouts:
      const finalArray = array.filter(loadout => loadout.stats.intellect === 10 || loadout.stats.recovery === 10)
      //sort by intellect:
      const sortedArmorArray = sortArray(finalArray, "intellect")
      //Send to zeroArmorCounterGuard to check for unused armor pieces:
      zeroArmorCounterGuard(sortedArmorArray, topArray, middleArray, bottomArray, tieLoadouts)
    }
  }

  //If every loadout in the array has an intRecDiff less than one (i.e. 0.5 or 0):
  else if (array.every(loadout => loadout.stats.intRecDiff < 1)) {
    //If every loadout in the array has an armorCounter of 0:
    if (array.every(loadout => loadout.armorCounter.includes(0))) {
      //Send the array to the end of evaluation:
      tieLoadouts.push(array)
    }
    //If at least one loadout has an armorCounter over 0:
    else {
      //Sort the array by lowest pointsFromMax:
      const pointsFromMaxArray = array.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
      //Find the lowest pointsFromMax:
      const closestToMax = pointsFromMaxArray[0].stats.pointsFromMax
      //If every loadout in the array has the same pointsFromMax (in this case all combos should have identical INT-REC, i.e. 9-9, 8-8, etc.):
      if (array.every(loadout => loadout.stats.pointsFromMax === closestToMax)) {
        //Sort the array:
        const sortedArmorArray = sortArray(pointsFromMaxArray)
        // If the best loadout has an armorCounter of 0:
        if (sortedArmorArray[0].armorCounter.includes(0)) {
          //Send the array to the end of evaluation:
          tieLoadouts.push(array)
        }
        // If the best loadout has an armorCounter of one or more:
        else {
          //Check for identical loadouts:
          const finalArmorArray = findingTieLoadouts(sortedArmorArray)
          if (finalArmorArray === false) {
            tieLoadouts.push(array)
          }
          // Add the best loadout:
          else {
            processOneLoadout(finalArmorArray, topArray, middleArray, bottomArray)
          }
        }
      }
      //If all the loadouts have different pointsFromMax:  
      else {
        //Filter the array, keeping all loadouts with the lowest pointsFromMax:
        const filteredArmorArray = pointsFromMaxArray.filter(loadout => loadout.stats.pointsFromMax === closestToMax)
        //Sort the array:
        const sortedArmorArray = sortArray(filteredArmorArray)
        // If the best loadout has an armorCounter of 0:
        if (sortedArmorArray[0].armorCounter.includes(0)) {
          // Send the array to the end of evaluation:
          tieLoadouts.push(array)
        }
        // If the best loadout has an armorCounter of one or more:
        else {
          //Check for identical loadouts:
          const finalArmorArray = findingTieLoadouts(sortedArmorArray)
          if (finalArmorArray === false) {
            tieLoadouts.push(array)
          }
          // Add the best loadout:
          else {
            processOneLoadout(finalArmorArray, topArray, middleArray, bottomArray)
          }
        }
      }
    }
  }

  //If every loadout has an intRecDiff of 1 or more:
  else if (array.every(loadout => loadout.stats.intRecDiff >= 1)) {
    //IF every loadout in the array has an armorCounter of 0:
    if (array.every(loadout => loadout.armorCounter.includes(0))) {
      //Send the array to the end of evaluation:
      tieLoadouts.push(array)
    }
    //If at least one loadout in the array has an armorCounter of one or more:
    else {
      //If every loadout has more intellect than recovery:
      if (array.every(loadout => loadout.stats.intellect > loadout.stats.recovery)) {
        //Sort the array:
        const intellectFocusedArray = sortArray(array, "intellect")
        //If the best loadout has an armorCounter of 0:
        if (intellectFocusedArray[0].armorCounter.includes(0)) {
          //Send the array to the end for evaluation:
          tieLoadouts.push(intellectFocusedArray)
        }
        //If the best loadout has an armorCounter of 1 or more:
        else {
          //Find the loadouts with the smallest difference between INT and REC:
          const smallestDifferenceArray = findSmallestDifference(intellectFocusedArray)
          //Check for identical loadouts:
          const finalIntellectArray = findingTieLoadouts(smallestDifferenceArray, "intellect")
          if (finalIntellectArray === false) {
            tieLoadouts.push(intellectFocusedArray)
          }
          //Add the best loadout:
          else {
            processOneLoadout(finalIntellectArray, topArray, middleArray, bottomArray)
          }
        }
      }
      //If every loadout has more recovery than intellect:
      else if (array.every(loadout => loadout.stats.intellect < loadout.stats.recovery)) {
        //Sort the array:
        const recoveryFocusedArray = sortArray(array, "recovery")
        //If the best loadout has an armorCounter of 0:
        if (recoveryFocusedArray[0].armorCounter.includes(0)) {
          //Send the array to the end for evaluation:
          tieLoadouts.push(recoveryFocusedArray)
        }
        //If the best loadout has an armorCounter of 1 or more:
        else {
          //Find the loadouts with the smallest difference between INT and REC:
          const smallestDifferenceArray = findSmallestDifference(recoveryFocusedArray)
          //Check for identical loadouts:
          const finalRecoveryArray = findingTieLoadouts(smallestDifferenceArray, "recovery")
          if (finalRecoveryArray === false) {
            tieLoadouts.push(recoveryFocusedArray)
          }
          //Add the best loadout:
          else {
            processOneLoadout(finalRecoveryArray, topArray, middleArray, bottomArray)
          }
        }
      }
      //If there are both high intellect and high recovery loadouts:
      else {
        //Create copies of the array, one for each focus:
        const intellectFocusedArray = array.map(loadout => loadout)
        const recoveryFocusedArray = array.map(loadout => loadout)
        //Sort each array by the respectave focus:
        sortArray(intellectFocusedArray, "intellect")
        sortArray(recoveryFocusedArray, "recovery")
        //Create a variable for each top loadout's armorCounter
        const topIntellectLoadoutCounter = intellectFocusedArray[0].armorCounter
        const topRecoveryLoadoutCounter = recoveryFocusedArray[0].armorCounter
        //If either top loadout has an armorCounter of 0
        if (topIntellectLoadoutCounter.includes(0) || topRecoveryLoadoutCounter.includes(0)) {
          //Send the whole array to the end for evaluation:
          tieLoadouts.push(array)
        }
        //If each top loadout has an armorCounter of 1 or more:
        else {
          //Check for identical loadouts:
          const finalIntellectArray = findingTieLoadouts(intellectFocusedArray, "intellect")
          const finalRecoveryArray = findingTieLoadouts(recoveryFocusedArray, "recovery")
          if (finalIntellectArray === false || finalRecoveryArray === false) {
            tieLoadouts.push(array)
          }
          //Add the best loadouts:
          else {
            processOneLoadout(finalIntellectArray, topArray, middleArray, bottomArray)
            processOneLoadout(finalRecoveryArray, topArray, middleArray, bottomArray)
          }
        }
      }
    }
  }

  //Any leftover loadouts are processed here:
  else {
    //Keep loadouts that have the lowest intRecDiff:
    const filteredDifferenceArray = findSmallestDifference(array)
    //Sort the array with intellect focus:
    const sortedArmorArray = sortArray(filteredDifferenceArray, "intellect")
    //If the best loadout has an armorCounter of 0:
    if (sortedArmorArray[0].armorCounter.includes(0)) {
      //Sent the whole array to the end for evaluation:
      tieLoadouts.push(array)
    }
    //If the best loadout has an armorCounter of 1 or more:
    else {
      const finalArmorArray = findingTieLoadouts(sortedArmorArray, "intellect")
      if (finalArmorArray === false) {
        tieLoadouts.push(array)
      }
      //Add the best loadout:
      else {
        processOneLoadout(finalArmorArray, topArray, middleArray, bottomArray)
      }
    }
  }
}

export const calculateStats = (exoticArray, topArray, middleArray, bottomArray, userTier, noLoadouts, tieLoadouts) => {
  exoticArray.forEach((exotic) => {
    const exoticLoadouts = []
    const exoticName = exotic[1].name
    const exoticType = exotic[1].itemSubType

    let exoticMobility = exotic[1].stats.mobility + 2
    let exoticResilience = exotic[1].stats.resilience + 2
    let exoticRecovery = exotic[1].stats.recovery + 2
    let exoticDiscipline = exotic[1].stats.discipline + 2
    let exoticIntellect = exotic[1].stats.intellect + 2
    let exoticStrength = exotic[1].stats.strength + 2

    //Then we move on to the target of this evaluation function...
    topArray.forEach((top) => {

      let topMobility = top[1].stats.mobility + 2
      let topResilience = top[1].stats.resilience + 2
      let topRecovery = top[1].stats.recovery + 2
      let topDiscipline = top[1].stats.discipline + 2
      let topIntellect = top[1].stats.intellect + 2
      let topStrength = top[1].stats.strength + 2

      middleArray.forEach((middle) => {

        let middleMobility = middle[1].stats.mobility + 2
        let middleResilience = middle[1].stats.resilience + 2
        let middleRecovery = middle[1].stats.recovery + 2
        let middleDiscipline = middle[1].stats.discipline + 2
        let middleIntellect = middle[1].stats.intellect + 2
        let middleStrength = middle[1].stats.strength + 2

        bottomArray.forEach((bottom) => {

          let bottomMobility = bottom[1].stats.mobility + 2
          let bottomResilience = bottom[1].stats.resilience + 2
          let bottomRecovery = bottom[1].stats.recovery + 2
          let bottomDiscipline = bottom[1].stats.discipline + 2
          let bottomIntellect = bottom[1].stats.intellect + 2
          let bottomStrength = bottom[1].stats.strength + 2

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

          filterLoadouts(totalTier, userTier, statsObject, exoticLoadouts, top[1], middle[1], bottom[1], exoticName, exoticType)

        })

      })
    })

    if (exoticLoadouts.length === 0) {
      noLoadouts.push(exoticName)
    }

    else {

      const filteredArmorArray = findingBestLoadouts(exoticLoadouts)

      assignSimpleLoadouts(filteredArmorArray, topArray, middleArray, bottomArray, tieLoadouts)

    }
  })
}

export const resetEvaluation = (armorArray) => {
  armorArray.forEach((armor) => {
    armor[1].counter = 0
    armor[1].loadouts = []
    armor[1].pairedExotics = []
  })
}

export const organizeAndSetArray = (array, setArray) => {
  array.forEach((item) => {
    item[1].loadouts.sort((a, b) => {
      return b.stats.totalIntRec - a.stats.totalIntRec
    })
  })

  array.sort((a, b) => {
    return b[1].counter - a[1].counter
  })

  const copyArray = [...array]
  setArray(copyArray)
}

export const processingLeftoverLoadouts = (exoticLoadout, topArray, middleArray, bottomArray, armorInfoArray, tieLoadouts) => {

  exoticLoadout.forEach((loadout) => {
    const instanceIds = loadout.instanceIds
    const topArmor = topArray.filter((choice) => choice[1].itemInstanceId === instanceIds[0])
    const middleArmor = middleArray.filter((choice) => choice[1].itemInstanceId === instanceIds[1])
    const bottomArmor = bottomArray.filter((choice) => choice[1].itemInstanceId === instanceIds[2])
    armorInfoArray.push({ "instanceIds": instanceIds, "armorCounter": [topArmor[0][1].counter, middleArmor[0][1].counter, bottomArmor[0][1].counter] })
  })


  const filteredArmorInfoArray = armorInfoArray.filter((info) => !info.armorCounter.includes(0))


  if (filteredArmorInfoArray.length === 0) {
    exoticLoadout.forEach((loadout) => {
      loadout.armorCounter = [1, 1, 1]
    })

    assignSimpleLoadouts(exoticLoadout, topArray, middleArray, bottomArray, tieLoadouts)

  }

  else {
    const instanceIdsArray = []
    filteredArmorInfoArray.forEach((info) => {
      instanceIdsArray.push(info.instanceIds)
    })

    const filteredExoticLoadouts = []

    filteredArmorInfoArray.forEach(info => {
      exoticLoadout.forEach(loadout => {
        if (info.instanceIds === loadout.instanceIds) {
          filteredExoticLoadouts.push(loadout)
        }
      })
    })

    filteredArmorInfoArray.forEach((info) => {
      filteredExoticLoadouts.forEach((loadout) => {
        if (loadout.instanceIds === info.instanceIds) {
          loadout.armorCounter = info.armorCounter
        }
      })
    })

    assignSimpleLoadouts(filteredExoticLoadouts, topArray, middleArray, bottomArray, tieLoadouts)

  }
}

const LegendaryHelmetEvaluation = (helmets, exoticHelmets, setHelmets, gauntlets, exoticGauntlets, setGauntlets, chests, exoticChests, setChests, legs, exoticLegs, setLegs, userTier, setNoLoadouts) => {
  const noLoadouts = []
  const tieLoadouts = []

  //Reset counters and necessary arrays to 0 and empty respectfully
  resetEvaluation(helmets)
  resetEvaluation(gauntlets)
  resetEvaluation(chests)
  resetEvaluation(legs)

  //Firts we start with Exotic Helmets...
  calculateStats(exoticHelmets, gauntlets, chests, legs, userTier, noLoadouts, tieLoadouts)

  //First we start with Exotic Gauntlets...
  calculateStats(exoticGauntlets, helmets, chests, legs, userTier, noLoadouts, tieLoadouts)

  //Next we go through all the Exotic Chests...
  calculateStats(exoticChests, helmets, gauntlets, legs, userTier, noLoadouts, tieLoadouts)

  //Lastly we go through the Exotic Legs...
  calculateStats(exoticLegs, helmets, gauntlets, chests, userTier, noLoadouts, tieLoadouts)

  //Here is where we'll eventually setHelmets and maybe some other housekeeping stuff...
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

  //Sort and set each Armor array...
  organizeAndSetArray(helmets, setHelmets)
  organizeAndSetArray(gauntlets, setGauntlets)
  organizeAndSetArray(chests, setChests)
  organizeAndSetArray(legs, setLegs)

  setNoLoadouts(noLoadouts)
}

export default LegendaryHelmetEvaluation
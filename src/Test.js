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

const filterLoadouts = (totalTier, userTier, statsObject, loadoutArray, topName, middleName, bottomName, chosen, exoticName) => {
  if (totalTier >= userTier.totalTier) {
    if (statsObject["recovery"] >= userTier.recovery) {
      if (statsObject["intellect"] >= userTier.intellect) {
        if (statsObject["recovery"] + statsObject["intellect"] >= userTier.average) {
          loadoutArray.push({
            "loadout": `Tier ${totalTier}: ${topName} - ${middleName} - ${bottomName}`,
            "stats": statsObject,
            "helmetId": chosen.itemInstanceId,
            "exoticName": exoticName,
            "armorCounter": chosen.counter
          })
        }
      }
    }
  }
}

const getLoadoutStats = (statsArray) => {
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
      if (!choice[1].pairedExotics.includes(exoticName)) {
        choice[1].pairedExotics.push(exoticName)
      }
      return true
    }
    return false
  })
}

const assignVariables = (exoticArray) => {
  let helmetId
  let bestLoadout
  let bestStats
  let exoticName
  exoticArray.every((loadout, index) => {
    if (index === 0) {
      bestLoadout = loadout
      bestStats = loadout.stats
      exoticName = loadout.exoticName
      helmetId = loadout.helmetId
      return false
    }
    return true
  })
  return {
    'armorId': helmetId,
    'loadout': bestLoadout,
    'stats': bestStats,
    'exoticName': exoticName
  }
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

const processOneLoadout = (array, chosen) => {
  const onlyLoadout = assignVariables(array)
  addLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.exoticName)
}

const zeroArmorCounterGuard = (array, chosen, tieLoadouts) => {
  if (array.every(loadout => loadout.armorCounter === 0) || array[0].armorCounter === 0) {
    tieLoadouts.push(array)
  }

  else {
    //Add the best intellect focused loadout:
    const finalArmorArray = findingTieLoadouts(array)
    if (finalArmorArray === false) {
      tieLoadouts.push(array)
    }
    else {
      processOneLoadout(finalArmorArray, chosen)
    }
  }
}


//A function that processes all of our exotic loadouts, using different conditionals:
const assignSimpleLoadouts = (array, chosen, tieLoadouts) => {
  const exoticName = array[0].exoticName
  console.log(exoticName)
  //If there is only one loadout in the array:
  if (array.length === 1) {
    //Add that one loadout:
    processOneLoadout(array, chosen)
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
      processOneLoadout(finalArmorArray, chosen, tieLoadouts)
    }
  }

  //If any loadout in the array has a totalIntRec of 19:
  else if (array.some(loadout => loadout.stats.totalIntRec === 19)) {
    //If every loadout has a combo of 9.5 and 9.5:
    if (array.every(loadout => loadout.stats.intellect !== 10 && loadout.stats.recovery !== 10)) {
      //Sort the array:
      const sortedArmorArray = sortArray(array)
      zeroArmorCounterGuard(sortedArmorArray, chosen, tieLoadouts)
    }
    //If every loadout has a combo of 10 and 9:
    else if (array.every(loadout => loadout.stats.intellect === 10 || loadout.stats.recovery === 10)) {
      //Sort the array by intellect:
      const sortedArmorArray = sortArray(array, "intellect")
      zeroArmorCounterGuard(sortedArmorArray, chosen, tieLoadouts)
    }
    //If there are loadouts of both 9.5-9.5 AND 10-9:
    else {
      //Filter out the 9.5-9.5 loadouts:
      const finalArray = array.filter(loadout => loadout.stats.intellect === 10 || loadout.stats.recovery === 10)
      //sort by intellect:
      const sortedArmorArray = sortArray(finalArray, "intellect")
      //Send to zeroArmorCounterGuard to check for unused armor pieces:
      zeroArmorCounterGuard(sortedArmorArray, chosen, tieLoadouts)
    }
  }

  //If every loadout in the array has an intRecDiff less than one (i.e. 0.5 or 0):
  else if (array.every(loadout => loadout.stats.intRecDiff < 1)) {
    //If every loadout in the array has an armorCounter of 0:
    if (array.every(loadout => loadout.armorCounter === 0)) {
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
        if (sortedArmorArray[0].armorCounter === 0) {
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
            processOneLoadout(finalArmorArray, chosen)
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
        if (sortedArmorArray[0].armorCounter === 0) {
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
            processOneLoadout(finalArmorArray, chosen)
          }
        }
      }
    }
  }

  //If every loadout has an intRecDiff of 1 or more:
  else if (array.every(loadout => loadout.stats.intRecDiff >= 1)) {
    //IF every loadout in the array has an armorCounter of 0:
    if (array.every(loadout => loadout.armorCounter === 0)) {
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
        if (intellectFocusedArray[0].armorCounter === 0) {
          //Send the array to the end for evaluation:
          tieLoadouts.push(intellectFocusedArray)
        }
        //If the best loadout has an armorCounter of 1 or more:
        else {
          //Check for identical loadouts:
          const finalIntellectArray = findingTieLoadouts(intellectFocusedArray, "intellect")
          if (finalIntellectArray === false) {
            tieLoadouts.push(intellectFocusedArray)
          }
          //Add the best loadout:
          else {
            processOneLoadout(finalIntellectArray, chosen)
          }
        }
      }
      //If every loadout has more recovery than intellect:
      else if (array.every(loadout => loadout.stats.intellect < loadout.stats.recovery)) {
        //Sort the array:
        const recoveryFocusedArray = sortArray(array, "recovery")
        //If the best loadout has an armorCounter of 0:
        if (recoveryFocusedArray[0].armorCounter === 0) {
          //Send the array to the end for evaluation:
          tieLoadouts.push(recoveryFocusedArray)
        }
        //If the best loadout has an armorCounter of 1 or more:
        else {
          //Check for identical loadouts:
          const finalRecoveryArray = findingTieLoadouts(recoveryFocusedArray, "recovery")
          if (finalRecoveryArray === false) {
            tieLoadouts.push(recoveryFocusedArray)
          }
          //Add the best loadout:
          else {
            processOneLoadout(finalRecoveryArray, chosen)
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
        if (topIntellectLoadoutCounter === 0 || topRecoveryLoadoutCounter === 0) {
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
            processOneLoadout(finalIntellectArray, chosen)
            processOneLoadout(finalRecoveryArray, chosen)
          }
        }
      }
    }
  }

  //Any leftover loadouts are processed here:
  else {
    //Sort by number of mods needed to reach 10 INT - 10 REC:
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
    const filteredDifferenceArray = fewestNumberOfModsArray.filter(loadout => loadout.stats.intRecDiff === lowestDifference)
    //Sort the array with intellect focus:
    const sortedArmorArray = sortArray(filteredDifferenceArray, "intellect")
    //If the best loadout has an armorCounter of 0:
    if (sortedArmorArray[0].armorCounter === 0) {
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
        processOneLoadout(finalArmorArray, chosen)
      }
    }
  }
}

const calculateStats = (exoticArray, chosenArray, topArray, bottomArray, userTier, noLoadouts, tieLoadouts) => {
  exoticArray.forEach((exotic) => {
    const exoticLoadouts = []
    const exoticName = exotic[1].name

    let gauntletMobility = exotic[1].stats.mobility + 2
    let gauntletResilience = exotic[1].stats.resilience + 2
    let gauntletRecovery = exotic[1].stats.recovery + 2
    let gauntletDiscipline = exotic[1].stats.discipline + 2
    let gauntletIntellect = exotic[1].stats.intellect + 2
    let gauntletStrength = exotic[1].stats.strength + 2

    //Then we move on to the target of this evaluation function...
    chosenArray.forEach((choice) => {

      let helmetMobility = choice[1].stats.mobility + 2
      let helmetResilience = choice[1].stats.resilience + 2
      let helmetRecovery = choice[1].stats.recovery + 2
      let helmetDiscipline = choice[1].stats.discipline + 2
      let helmetIntellect = choice[1].stats.intellect + 2
      let helmetStrength = choice[1].stats.strength + 2

      topArray.forEach((top) => {
        const topName = top[1].name

        let chestMobility = top[1].stats.mobility + 2
        let chestResilience = top[1].stats.resilience + 2
        let chestRecovery = top[1].stats.recovery + 2
        let chestDiscipline = top[1].stats.discipline + 2
        let chestIntellect = top[1].stats.intellect + 2
        let chestStrength = top[1].stats.strength + 2

        bottomArray.forEach((bottom) => {
          const bottomName = bottom[1].name

          let legMobility = bottom[1].stats.mobility + 2
          let legResilience = bottom[1].stats.resilience + 2
          let legRecovery = bottom[1].stats.recovery + 2
          let legDiscipline = bottom[1].stats.discipline + 2
          let legIntellect = bottom[1].stats.intellect + 2
          let legStrength = bottom[1].stats.strength + 2

          const statsArray = [
            (gauntletMobility + helmetMobility + chestMobility + legMobility + 2) / 10,
            (gauntletResilience + helmetResilience + chestResilience + legResilience + 2) / 10,
            (gauntletRecovery + helmetRecovery + chestRecovery + legRecovery + 2) / 10,
            (gauntletDiscipline + helmetDiscipline + chestDiscipline + legDiscipline + 2) / 10,
            (gauntletIntellect + helmetIntellect + chestIntellect + legIntellect + 2) / 10,
            (gauntletStrength + helmetStrength + chestStrength + legStrength + 2) / 10
          ]

          let totalTier = Math.floor(statsArray[0]) + Math.floor(statsArray[1]) + Math.floor(statsArray[2]) + Math.floor(statsArray[3]) + Math.floor(statsArray[4]) + Math.floor(statsArray[5])

          const statsObject = getLoadoutStats(statsArray)

          if (exotic[1].itemSubType === "Gauntlets" && choice[1].itemSubType === "Helmet") {
            filterLoadouts(totalTier, userTier, statsObject, exoticLoadouts, exoticName, topName, bottomName, choice[1], exoticName)
          }
          else if (exotic[1].itemSubType === "Chest Armor" && choice[1].itemSubType === "Leg Armor") {
            filterLoadouts(totalTier, userTier, statsObject, exoticLoadouts, topName, bottomName, exoticName, choice[1], exoticName)
          }
          else if (exotic[1].itemSubType === "Helmet") {
            filterLoadouts(totalTier, userTier, statsObject, exoticLoadouts, exoticName, topName, bottomName, choice[1], exoticName)
          }
          else if (exotic[1].itemSubType === "Leg Armor") {
            filterLoadouts(totalTier, userTier, statsObject, exoticLoadouts, topName, bottomName, exoticName, choice[1], exoticName)
          }
          else {
            filterLoadouts(totalTier, userTier, statsObject, exoticLoadouts, topName, exoticName, bottomName, choice[1], exoticName)
          }
        })
      })
    })

    if (exoticLoadouts.length === 0) {
      noLoadouts.push(exoticName)
    }

    else {

      const filteredArmorArray = findingBestLoadouts(exoticLoadouts)

      assignSimpleLoadouts(filteredArmorArray, chosenArray, tieLoadouts)

    }
  })
}

const LegendaryHelmetEvaluation = (chosen, setChosen, exoticTop, top, exoticMiddle, middle, exoticBottom, bottom, userTier, setNoLoadouts) => {
  const noLoadouts = []
  const tieLoadouts = []

  chosen.forEach((helmet) => {
    helmet[1].counter = 0
    helmet[1].loadouts = []
    helmet[1].pairedExotics = []
  })

  //First we start with Exotic Gauntlets...
  calculateStats(exoticTop, chosen, middle, bottom, userTier, noLoadouts, tieLoadouts)

  //Next we go through all the exotic middle...
  calculateStats(exoticMiddle, chosen, top, bottom, userTier, noLoadouts, tieLoadouts)

  //Lastly we go through the exotic bottom...
  calculateStats(exoticBottom, chosen, top, middle, userTier, noLoadouts, tieLoadouts)

  //Here is where we'll eventually setHelmets and maybe some other housekeeping stuff...
  tieLoadouts.forEach((exoticLoadout) => {
    const armorInfoArray = []
    exoticLoadout.forEach((loadout) => {
      const instanceId = loadout.helmetId
      const armor = chosen.filter((choice) => choice[1].itemInstanceId === instanceId)
      const armorCounter = armor[0][1].counter
      if (!armorInfoArray.some((item) => item.instanceId === instanceId)) {
        armorInfoArray.push({ "instanceId": instanceId, "armorCounter": armorCounter })
      }
    })

    const filteredArmorInfoArray = armorInfoArray.filter((info) => info.armorCounter !== 0)

    if (filteredArmorInfoArray.length === 0) {
      exoticLoadout.forEach((loadout) => {
        loadout.armorCounter = 1
      })

      assignSimpleLoadouts(exoticLoadout, chosen, tieLoadouts)

    }

    else {
      const instanceIds = []
      filteredArmorInfoArray.forEach((info) => {
        instanceIds.push(info.instanceId)
      })

      const filteredExoticLoadouts = exoticLoadout.filter((loadout) => instanceIds.includes(loadout.helmetId))

      filteredArmorInfoArray.forEach((info) => {
        filteredExoticLoadouts.forEach((loadout) => {
          if (loadout.helmetId === info.instanceId) {
            loadout.armorCounter = info.armorCounter
          }
        })
      })

      assignSimpleLoadouts(filteredExoticLoadouts, chosen, tieLoadouts)

    }
  })

  chosen.forEach((choice) => {
    choice[1].loadouts.sort((a, b) => {
      return b.stats.totalIntRec - a.stats.totalIntRec
    })
  })

  chosen.sort((a, b) => {
    return b[1].counter - a[1].counter
  })

  const copyHelmets = [...chosen]
  setChosen(copyHelmets)
  setNoLoadouts(noLoadouts)
}

export default LegendaryHelmetEvaluation
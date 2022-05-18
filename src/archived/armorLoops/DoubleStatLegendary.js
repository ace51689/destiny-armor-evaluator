const DoubleStatLegendary = (chosen, setChosen, exoticTop, top, exoticMiddle, middle, exoticBottom, bottom, userTier) => {
  //Inital loop of our chosen armor type---------------------------------------------------------------------------------------------------
  chosen.forEach((choice) => {
    choice[1].counter = 0
    choice[1].pairedItems = []
    choice[1].pairedExotics = []
    const combinations = []

    let choiceMobility = choice[1].stats.mobility + 2
    let choiceResilience = choice[1].stats.resilience + 2
    let choiceRecovery = choice[1].stats.recovery + 2
    let choiceDiscipline = choice[1].stats.discipline + 2
    let choiceIntellect = choice[1].stats.intellect + 2
    let choiceStrength = choice[1].stats.strength + 2

    //First sub group of loops --------------------------------------------------------------------------------------------------------------
    exoticTop.forEach((top) => {

      let topMobility = top[1].stats.mobility + 2
      let topResilience = top[1].stats.resilience + 2
      let topRecovery = top[1].stats.recovery + 2
      let topDiscipline = top[1].stats.discipline + 2
      let topIntellect = top[1].stats.intellect + 2
      let topStrength = top[1].stats.strength + 2

      middle.forEach((middle) => {

        let middleMobility = middle[1].stats.mobility + 2
        let middleResilience = middle[1].stats.resilience + 2
        let middleRecovery = middle[1].stats.recovery + 2
        let middleDiscipline = middle[1].stats.discipline + 2
        let middleIntellect = middle[1].stats.intellect + 2
        let middleStrength = middle[1].stats.strength + 2

        bottom.forEach((bottom) => {

          let bottomMobility = bottom[1].stats.mobility + 2
          let bottomResilience = bottom[1].stats.resilience + 2
          let bottomRecovery = bottom[1].stats.recovery + 2
          let bottomDiscipline = bottom[1].stats.discipline + 2
          let bottomIntellect = bottom[1].stats.intellect + 2
          let bottomStrength = bottom[1].stats.strength + 2

          //This is where we'll have to do some of the evaluations, at the end of each sub group--------------------------------------------
          const statsArr = [
            (choiceMobility + topMobility + middleMobility + bottomMobility + 2) / 10,
            (choiceResilience + topResilience + middleResilience + bottomResilience + 2) / 10,
            (choiceRecovery + topRecovery + middleRecovery + bottomRecovery + 2) / 10,
            (choiceDiscipline + topDiscipline + middleDiscipline + bottomDiscipline + 2) / 10,
            (choiceIntellect + topIntellect + middleIntellect + bottomIntellect + 2) / 10,
            (choiceStrength + topStrength + middleStrength + bottomStrength + 2) / 10
          ]

          console.log(statsArr)

          let totalTier = Math.floor(statsArr[0]) + Math.floor(statsArr[1]) + Math.floor(statsArr[2]) + Math.floor(statsArr[3]) + Math.floor(statsArr[4]) + Math.floor(statsArr[5])

          const tierArr = []

          statsArr.forEach((stat) => {
            let tier = stat
            let totalTier = Math.floor(tier)
            let totalUp = totalTier + 1
            let totalHalf = tier + 0.5
            if (totalHalf >= totalUp) {
              tierArr.push(totalTier + 0.5)
            } else {
              tierArr.push(totalTier)
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const finalCombination = (873 / statsObj["mobility"]) + (1059 / statsObj["resilience"]) + (879 / statsObj["recovery"]) + (1060 / statsObj["discipline"]) + (964 / statsObj["intellect"]) + (847 / statsObj["strength"])

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  choice[1].counter += 1
                  const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
                  const stats = { "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  choice[1].pairedItems.push([loadout, stats])
                  combinations.push(finalCombination)
                  if (!choice[1].pairedExotics.includes(`${top[1].name}`)) {
                    choice[1].pairedExotics.push(`${top[1].name}`)
                  }
                }
              }
            }
          }
        })
      })
    })

    //Second sub group of loops --------------------------------------------------------------------------------------------------------------
    top.forEach((top) => {

      let topMobility = top[1].stats.mobility + 2
      let topResilience = top[1].stats.resilience + 2
      let topRecovery = top[1].stats.recovery + 2
      let topDiscipline = top[1].stats.discipline + 2
      let topIntellect = top[1].stats.intellect + 2
      let topStrength = top[1].stats.strength + 2

      exoticMiddle.forEach((middle) => {

        let middleMobility = middle[1].stats.mobility + 2
        let middleResilience = middle[1].stats.resilience + 2
        let middleRecovery = middle[1].stats.recovery + 2
        let middleDiscipline = middle[1].stats.discipline + 2
        let middleIntellect = middle[1].stats.intellect + 2
        let middleStrength = middle[1].stats.strength + 2

        bottom.forEach((bottom) => {

          let bottomMobility = bottom[1].stats.mobility + 2
          let bottomResilience = bottom[1].stats.resilience + 2
          let bottomRecovery = bottom[1].stats.recovery + 2
          let bottomDiscipline = bottom[1].stats.discipline + 2
          let bottomIntellect = bottom[1].stats.intellect + 2
          let bottomStrength = bottom[1].stats.strength + 2

          //This is where we'll have to likely do some of the evaluations, at the end of each sub group---------------------------------------
          const statsArr = [
            (choiceMobility + topMobility + middleMobility + bottomMobility + 2) / 10,
            (choiceResilience + topResilience + middleResilience + bottomResilience + 2) / 10,
            (choiceRecovery + topRecovery + middleRecovery + bottomRecovery + 2) / 10,
            (choiceDiscipline + topDiscipline + middleDiscipline + bottomDiscipline + 2) / 10,
            (choiceIntellect + topIntellect + middleIntellect + bottomIntellect + 2) / 10,
            (choiceStrength + topStrength + middleStrength + bottomStrength + 2) / 10
          ]

          let totalTier = Math.floor(statsArr[0]) + Math.floor(statsArr[1]) + Math.floor(statsArr[2]) + Math.floor(statsArr[3]) + Math.floor(statsArr[4]) + Math.floor(statsArr[5])

          const tierArr = []

          statsArr.forEach((stat) => {
            let tier = stat
            let totalTier = Math.floor(tier)
            let totalUp = totalTier + 1
            let totalHalf = tier + 0.5
            if (totalHalf >= totalUp) {
              tierArr.push(totalTier + 0.5)
            } else {
              tierArr.push(totalTier)
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const finalCombination = (873 / statsObj["mobility"]) + (1059 / statsObj["resilience"]) + (879 / statsObj["recovery"]) + (1060 / statsObj["discipline"]) + (964 / statsObj["intellect"]) + (847 / statsObj["strength"])

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  choice[1].counter += 1
                  const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
                  const stats = { "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  choice[1].pairedItems.push([loadout, stats])
                  combinations.push(finalCombination)
                  if (!choice[1].pairedExotics.includes(`${middle[1].name}`)) {
                    choice[1].pairedExotics.push(`${middle[1].name}`)
                  }
                }
              }
            }
          }
        })
      })
    })
    //Third sub group of loops --------------------------------------------------------------------------------------------------------------
    top.forEach((top) => {

      let topMobility = top[1].stats.mobility + 2
      let topResilience = top[1].stats.resilience + 2
      let topRecovery = top[1].stats.recovery + 2
      let topDiscipline = top[1].stats.discipline + 2
      let topIntellect = top[1].stats.intellect + 2
      let topStrength = top[1].stats.strength + 2

      middle.forEach((middle) => {

        let middleMobility = middle[1].stats.mobility + 2
        let middleResilience = middle[1].stats.resilience + 2
        let middleRecovery = middle[1].stats.recovery + 2
        let middleDiscipline = middle[1].stats.discipline + 2
        let middleIntellect = middle[1].stats.intellect + 2
        let middleStrength = middle[1].stats.strength + 2

        exoticBottom.forEach((bottom) => {

          let bottomMobility = bottom[1].stats.mobility + 2
          let bottomResilience = bottom[1].stats.resilience + 2
          let bottomRecovery = bottom[1].stats.recovery + 2
          let bottomDiscipline = bottom[1].stats.discipline + 2
          let bottomIntellect = bottom[1].stats.intellect + 2
          let bottomStrength = bottom[1].stats.strength + 2

          //This is where we'll have to likely do some of the evaluations, at the end of each sub group---------------------------------------
          const statsArr = [
            (choiceMobility + topMobility + middleMobility + bottomMobility + 2) / 10,
            (choiceResilience + topResilience + middleResilience + bottomResilience + 2) / 10,
            (choiceRecovery + topRecovery + middleRecovery + bottomRecovery + 2) / 10,
            (choiceDiscipline + topDiscipline + middleDiscipline + bottomDiscipline + 2) / 10,
            (choiceIntellect + topIntellect + middleIntellect + bottomIntellect + 2) / 10,
            (choiceStrength + topStrength + middleStrength + bottomStrength + 2) / 10
          ]

          let totalTier = Math.floor(statsArr[0]) + Math.floor(statsArr[1]) + Math.floor(statsArr[2]) + Math.floor(statsArr[3]) + Math.floor(statsArr[4]) + Math.floor(statsArr[5])

          const tierArr = []

          statsArr.forEach((stat) => {
            let tier = stat
            let totalTier = Math.floor(tier)
            let totalUp = totalTier + 1
            let totalHalf = tier + 0.5
            if (totalHalf >= totalUp) {
              tierArr.push(totalTier + 0.5)
            } else {
              tierArr.push(totalTier)
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const finalCombination = (873 / statsObj["mobility"]) + (1059 / statsObj["resilience"]) + (879 / statsObj["recovery"]) + (1060 / statsObj["discipline"]) + (964 / statsObj["intellect"]) + (847 / statsObj["strength"])

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  choice[1].counter += 1
                  const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
                  const stats = { "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  choice[1].pairedItems.push([loadout, stats])
                  combinations.push(finalCombination)
                  if (!choice[1].pairedExotics.includes(`${bottom[1].name}`)) {
                    choice[1].pairedExotics.push(`${bottom[1].name}`)
                  }
                }
              }
            }
          }
        })
      })
    })
    const uniqueCombosSet = new Set(combinations)
    choice[1].uniqueCombos = uniqueCombosSet.size

    function sortHelper() {
      
    }

    choice[1].pairedItems.sort((item) => {
      return item[1].intellect
    })
  })

  const copyArmor = [...chosen]
  // console.log(copyArmor)
  setChosen(copyArmor)

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
      //Sort the array by lowest pointsFromMax:
      const pointsFromMaxArray = array.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
      //Find the lowest pointsFromMax:
      const closestToMax = pointsFromMaxArray[0].stats.pointsFromMax
      //If every loadout in the array has the same pointsFromMax (in this case all combos should have identical INT-REC, i.e. 9-9, 8-8, etc.):
      if (array.every(loadout => loadout.stats.pointsFromMax === closestToMax)) {
        //Sort the array:
        const sortedArmorArray = sortArray(pointsFromMaxArray)
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
      //If all the loadouts have different pointsFromMax:  
      else {
        //Filter the array, keeping all loadouts with the lowest pointsFromMax:
        const filteredArmorArray = pointsFromMaxArray.filter(loadout => loadout.stats.pointsFromMax === closestToMax)
        //Sort the array:
        const sortedArmorArray = sortArray(filteredArmorArray)
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

    //If every loadout has an intRecDiff of 1 or more:
    else if (array.every(loadout => loadout.stats.intRecDiff >= 1)) {
      //If every loadout has more intellect than recovery:
      if (array.every(loadout => loadout.stats.intellect > loadout.stats.recovery)) {
        //Sort the array:
        const intellectFocusedArray = sortArray(array, "intellect")
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
      //If every loadout has more recovery than intellect:
      else if (array.every(loadout => loadout.stats.intellect < loadout.stats.recovery)) {
        //Sort the array:
        const recoveryFocusedArray = sortArray(array, "recovery")
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
      //If there are both high intellect and high recovery loadouts:
      else {
        //Create copies of the array, one for each focus:
        array.sort((a, b) => a.stats.intRecDiff - b.stats.intRecDiff)
        const intRecThreshold = array[0].stats.intRecDiff + 0.5

        const testArray = array.filter(loadout => loadout.stats.intRecDiff <= intRecThreshold)

        if (testArray.length === 1) {
          const intellectFocusedArray = array
          const recoveryFocusedArray = array

          //Sort each array by the respectave focus:
          sortArray(intellectFocusedArray, "intellect")
          sortArray(recoveryFocusedArray, "recovery")

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
        else {
          const intellectFocusedArray = array.filter(loadout => loadout.stats.intRecDiff <= intRecThreshold)
          const recoveryFocusedArray = array.filter(loadout => loadout.stats.intRecDiff <= intRecThreshold)

          //Sort each array by the respectave focus:
          sortArray(intellectFocusedArray, "intellect")
          sortArray(recoveryFocusedArray, "recovery")

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

    //Any leftover loadouts are processed here:
    else {
      //Keep loadouts that have the lowest intRecDiff:
      const filteredDifferenceArray = findSmallestDifference(array)

      //Sort the array with intellect focus:
      const sortedArmorArray = sortArray(filteredDifferenceArray, "intellect")
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

export default DoubleStatLegendary
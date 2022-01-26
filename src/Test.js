const addIntellectLoadout = (chosen, loadout, choiceId, exoticName) => {
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

const addRecoveryLoadout = (chosen, loadout, choiceId, exoticName) => {
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
      helmetId = loadout.helmetId
      exoticName = loadout.exoticName
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

const findingTieLoadouts = (loadout, topLoadout) => {
  const stats = loadout.stats
  const mobility = topLoadout.stats.mobility === stats.mobility
  const resilience = topLoadout.stats.resilience === stats.resilience
  const recovery = topLoadout.stats.recovery === stats.recovery
  const discipline = topLoadout.stats.discipline === stats.discipline
  const intellect = topLoadout.stats.intellect === stats.intellect
  const strength = topLoadout.stats.strength === stats.strength

  if (intellect && recovery && discipline && resilience && strength && mobility) {
    return true
  }
  return false
}

const assignSimpleLoadouts = (array, chosen, tieLoadouts) => {
  const exoticName = array[0].exoticName
  const testTotal = array[0].stats.totalIntRec
  const sameTotal = array.every(loadout => loadout.stats.totalIntRec === testTotal)

  if (sameTotal) {

    const testInt = array[0].stats.intellect
    const testRec = array[0].stats.recovery
    const allTheSame = array.every(loadout => loadout.stats.intellect === testInt) && array.every(loadout => loadout.stats.recovery === testRec)

    const testDifference = array[0].stats.intRecDiff
    const sameDifference = array.every(loadout => loadout.stats.intRecDiff === testDifference)

    if (array.length === 1) {
      if (exoticName === "Actium War Rig") {
        console.log(exoticName)
        console.log("SAME TOTAL; 1st filter only yeilded one result:")
      }
      //check to see if their is only one loadout in the array, if so then add that one loadout
      const onlyLoadout = assignVariables(array)
      // console.log(`Keeping:`)
      // console.log(onlyLoadout)
      addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, exoticName)
    }

    else if (allTheSame) {
      if (exoticName === "Actium War Rig") {
        console.log(exoticName)
        console.log("SAME TOTAL; All loadouts after the 1st filter have the same INT and REC:")
      }
      // //If there is more then one loadout with the same INT and REC then sort stats in reverse order of importance...
      // //...and add the top loadout
      // const onlyLoadout = assignVariables(sortArray(array))
      // console.log("Filtered Array:")
      // console.log(array)
      // console.log(`Keeping:`)
      // console.log(onlyLoadout)
      // addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, exoticName)
      tieLoadouts.push(array)
    }

    else if (sameDifference) {
      //If all of the combinations are inverses of eachother...
      if (testTotal === 19) {
        //If the combo is both variations of 10 & 9, just keep the 10 Int - 9 Rec combination.
        const intellectLoadout = assignVariables(sortArray(array, "intellect"))
        if (exoticName === "Actium War Rig") {
          console.log(exoticName)
          console.log("SAME TOTAL; All loadouts after the 1st filter are inverses of eachother")
          console.log("The combo is a variation of 10 & 9, keeping the best 10 INT - 9 REC combo only:")
        }
        // console.log("Filtered Array:")
        // console.log(array)
        // console.log(`Keeping:`)
        // console.log(intellectLoadout)
        addIntellectLoadout(chosen, intellectLoadout.loadout, intellectLoadout.armorId, exoticName)
      }
      else {
        // All other variations of combinations keep one of each focus
        const intellectFocusedArray = sortArray(array, "intellect")
        const intellectLoadout = assignVariables(intellectFocusedArray)
        addIntellectLoadout(chosen, intellectLoadout.loadout, intellectLoadout.armorId, exoticName)
        
        const recoveryFocusedArray = sortArray(array, "recovery")
        const recoveryLoadout = assignVariables(recoveryFocusedArray)
        addRecoveryLoadout(chosen, recoveryLoadout.loadout, recoveryLoadout.armorId, exoticName)
        if (exoticName === "Actium War Rig") {
          console.log(exoticName)
          console.log("SAME TOTAL; All loadouts after the 1st filter are inverses of eachother")
          console.log("Keep one of each focus:")
          console.log("Filtered Array:")
          console.log(array)
          console.log(`Keeping (INT):`)
          console.log(intellectLoadout)
          console.log(`Keeping (REC):`)
          console.log(recoveryLoadout)
        }
      }
    }
  }
  else {
    tieLoadouts.push(array)
  }
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
  exoticTop.forEach((gauntlet) => {
    const gauntletArray = []

    let gauntletMobility = gauntlet[1].stats.mobility + 2
    let gauntletResilience = gauntlet[1].stats.resilience + 2
    let gauntletRecovery = gauntlet[1].stats.recovery + 2
    let gauntletDiscipline = gauntlet[1].stats.discipline + 2
    let gauntletIntellect = gauntlet[1].stats.intellect + 2
    let gauntletStrength = gauntlet[1].stats.strength + 2

    //Then we move on to the target of this evaluation function...
    chosen.forEach((helmet) => {

      let helmetMobility = helmet[1].stats.mobility + 2
      let helmetResilience = helmet[1].stats.resilience + 2
      let helmetRecovery = helmet[1].stats.recovery + 2
      let helmetDiscipline = helmet[1].stats.discipline + 2
      let helmetIntellect = helmet[1].stats.intellect + 2
      let helmetStrength = helmet[1].stats.strength + 2

      middle.forEach((chest) => {

        let chestMobility = chest[1].stats.mobility + 2
        let chestResilience = chest[1].stats.resilience + 2
        let chestRecovery = chest[1].stats.recovery + 2
        let chestDiscipline = chest[1].stats.discipline + 2
        let chestIntellect = chest[1].stats.intellect + 2
        let chestStrength = chest[1].stats.strength + 2

        bottom.forEach((leg) => {

          let legMobility = leg[1].stats.mobility + 2
          let legResilience = leg[1].stats.resilience + 2
          let legRecovery = leg[1].stats.recovery + 2
          let legDiscipline = leg[1].stats.discipline + 2
          let legIntellect = leg[1].stats.intellect + 2
          let legStrength = leg[1].stats.strength + 2

          const statsArr = [
            (gauntletMobility + helmetMobility + chestMobility + legMobility + 2) / 10,
            (gauntletResilience + helmetResilience + chestResilience + legResilience + 2) / 10,
            (gauntletRecovery + helmetRecovery + chestRecovery + legRecovery + 2) / 10,
            (gauntletDiscipline + helmetDiscipline + chestDiscipline + legDiscipline + 2) / 10,
            (gauntletIntellect + helmetIntellect + chestIntellect + legIntellect + 2) / 10,
            (gauntletStrength + helmetStrength + chestStrength + legStrength + 2) / 10
          ]

          let totalTier = Math.floor(statsArr[0]) + Math.floor(statsArr[1]) + Math.floor(statsArr[2]) + Math.floor(statsArr[3]) + Math.floor(statsArr[4]) + Math.floor(statsArr[5])

          const tierArr = []

          statsArr.forEach((stat) => {
            let tier = stat
            let totalTier = Math.floor(tier)
            let totalUp = totalTier + 1
            let totalHalf = tier + 0.5
            if (totalHalf >= totalUp) {
              if (totalTier + 0.5 >= 10) {
                tierArr.push(10)
              } else {
                tierArr.push(totalTier + 0.5)
              }
            } else {
              if (totalTier >= 10) {
                tierArr.push(10)
              } else {
                tierArr.push(totalTier)
              }
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const practicalTotal = tierArr.reduce((a, b) => {
            return a + b
          })

          const score = (statsObj.mobility) + (statsObj.resilience * 3) + (statsObj.discipline * 4) + (statsObj.strength * 2)

          const totalIntellectRecovery = statsObj.intellect + statsObj.recovery

          const intellectRecoveryDifference = Math.abs(statsObj.intellect - statsObj.recovery)

          const numberOfMods = (10 - Math.floor(statsObj.intellect)) + (10 - Math.floor(statsObj.recovery))

          let i = statsObj.intellect
          let r = statsObj.recovery

          let points = 0
          if (statsObj.intellect !== Math.floor(statsObj.intellect)) {
            points += 2
            i += 0.5
          }

          if (statsObj.recovery !== Math.floor(statsObj.recovery)) {
            points += 2
            r += 0.5
          }
          points += (10 - i) * 5
          points += (10 - r) * 4

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  const loadout = `Tier ${totalTier}: ${gauntlet[1].name} - ${chest[1].name} - ${leg[1].name}`
                  const stats = { "numberOfMods": numberOfMods, "pointsFromMax": points, "totalIntRec": totalIntellectRecovery, "intRecDiff": intellectRecoveryDifference, "totalTier": totalTier, "score": score, "practicalTotal": practicalTotal, "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  gauntletArray.push({ "loadout": loadout, "stats": stats, "helmetId": helmet[1].itemInstanceId, "exoticName": gauntlet[1].name, "armorCounter": helmet[1].counter })
                }
              }
            }
          }
        })
      })
    })

    if (gauntletArray.length === 0) {
      noLoadouts.push(gauntlet[1].name)
    } else {

      gauntletArray.sort((a, b) => {
        return b.stats.totalIntRec - a.stats.totalIntRec
      })

      let n = gauntletArray[0].stats.totalIntRec

      if (n !== Math.floor(n)) {
        n -= 0.5
      }

      const filteredGauntletArray = gauntletArray.filter((loadout) => {
        if (loadout.stats.totalIntRec >= n) {
          return loadout
        }
        return false
      })

      assignSimpleLoadouts(filteredGauntletArray, chosen, tieLoadouts)

    }
  })

  //Next we go through all the exotic middle...
  exoticMiddle.forEach((chest) => {
    const chestArray = []

    let chestMobility = chest[1].stats.mobility + 2
    let chestResilience = chest[1].stats.resilience + 2
    let chestRecovery = chest[1].stats.recovery + 2
    let chestDiscipline = chest[1].stats.discipline + 2
    let chestIntellect = chest[1].stats.intellect + 2
    let chestStrength = chest[1].stats.strength + 2

    chosen.forEach((helmet) => {

      let helmetMobility = helmet[1].stats.mobility + 2
      let helmetResilience = helmet[1].stats.resilience + 2
      let helmetRecovery = helmet[1].stats.recovery + 2
      let helmetDiscipline = helmet[1].stats.discipline + 2
      let helmetIntellect = helmet[1].stats.intellect + 2
      let helmetStrength = helmet[1].stats.strength + 2

      top.forEach((gauntlet) => {

        let gauntletMobility = gauntlet[1].stats.mobility + 2
        let gauntletResilience = gauntlet[1].stats.resilience + 2
        let gauntletRecovery = gauntlet[1].stats.recovery + 2
        let gauntletDiscipline = gauntlet[1].stats.discipline + 2
        let gauntletIntellect = gauntlet[1].stats.intellect + 2
        let gauntletStrength = gauntlet[1].stats.strength + 2

        bottom.forEach((leg) => {

          let legMobility = leg[1].stats.mobility + 2
          let legResilience = leg[1].stats.resilience + 2
          let legRecovery = leg[1].stats.recovery + 2
          let legDiscipline = leg[1].stats.discipline + 2
          let legIntellect = leg[1].stats.intellect + 2
          let legStrength = leg[1].stats.strength + 2

          const statsArr = [
            (gauntletMobility + helmetMobility + chestMobility + legMobility + 2) / 10,
            (gauntletResilience + helmetResilience + chestResilience + legResilience + 2) / 10,
            (gauntletRecovery + helmetRecovery + chestRecovery + legRecovery + 2) / 10,
            (gauntletDiscipline + helmetDiscipline + chestDiscipline + legDiscipline + 2) / 10,
            (gauntletIntellect + helmetIntellect + chestIntellect + legIntellect + 2) / 10,
            (gauntletStrength + helmetStrength + chestStrength + legStrength + 2) / 10
          ]

          let totalTier = Math.floor(statsArr[0]) + Math.floor(statsArr[1]) + Math.floor(statsArr[2]) + Math.floor(statsArr[3]) + Math.floor(statsArr[4]) + Math.floor(statsArr[5])

          const tierArr = []

          statsArr.forEach((stat) => {
            let tier = stat // 11
            let totalTier = Math.floor(tier)
            let totalUp = totalTier + 1
            let totalHalf = tier + 0.5
            if (totalHalf >= totalUp) {
              if (totalTier + 0.5 >= 10) {
                tierArr.push(10)
              } else {
                tierArr.push(totalTier + 0.5)
              }
            } else {
              if (totalTier >= 10) {
                tierArr.push(10)
              } else {
                tierArr.push(totalTier)
              }
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const practicalTotal = tierArr.reduce((a, b) => {
            return a + b
          })

          const score = (statsObj.mobility) + (statsObj.resilience * 3) + (statsObj.discipline * 4) + (statsObj.strength * 2)

          const totalIntellectRecovery = statsObj.intellect + statsObj.recovery

          const intellectRecoveryDifference = Math.abs(statsObj.intellect - statsObj.recovery)

          const numberOfMods = (10 - Math.floor(statsObj.intellect)) + (10 - Math.floor(statsObj.recovery))

          let i = statsObj.intellect
          let r = statsObj.recovery

          let points = 0
          if (statsObj.intellect !== Math.floor(statsObj.intellect)) {
            points += 2
            i += 0.5
          }

          if (statsObj.recovery !== Math.floor(statsObj.recovery)) {
            points += 2
            r += 0.5
          }
          points += (10 - i) * 5
          points += (10 - r) * 4

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  const loadout = `Tier ${totalTier}: ${gauntlet[1].name} - ${chest[1].name} - ${leg[1].name}`
                  const stats = { "numberOfMods": numberOfMods, "pointsFromMax": points, "totalIntRec": totalIntellectRecovery, "intRecDiff": intellectRecoveryDifference, "totalTier": totalTier, "score": score, "practicalTotal": practicalTotal, "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  chestArray.push({ "loadout": loadout, "stats": stats, "helmetId": helmet[1].itemInstanceId, "exoticName": chest[1].name, "armorCounter": helmet[1].counter })
                }
              }
            }
          }
        })
      })
    })

    if (chestArray.length === 0) {
      noLoadouts.push(chest[1].name)
    } else {

      chestArray.sort((a, b) => {
        return b.stats.totalIntRec - a.stats.totalIntRec
      })

      let n = chestArray[0].stats.totalIntRec

      if (n !== Math.floor(n)) {
        n -= 0.5
      }

      const filteredChestArray = chestArray.filter((loadout) => {
        if (loadout.stats.totalIntRec >= n) {
          return loadout
        }
        return false
      })

      assignSimpleLoadouts(filteredChestArray, chosen, tieLoadouts)

    }
  })

  //Lastly we go through the exotic bottom...
  exoticBottom.forEach((leg) => {
    const legArray = []

    let legMobility = leg[1].stats.mobility + 2
    let legResilience = leg[1].stats.resilience + 2
    let legRecovery = leg[1].stats.recovery + 2
    let legDiscipline = leg[1].stats.discipline + 2
    let legIntellect = leg[1].stats.intellect + 2
    let legStrength = leg[1].stats.strength + 2

    chosen.forEach((helmet) => {

      let helmetMobility = helmet[1].stats.mobility + 2
      let helmetResilience = helmet[1].stats.resilience + 2
      let helmetRecovery = helmet[1].stats.recovery + 2
      let helmetDiscipline = helmet[1].stats.discipline + 2
      let helmetIntellect = helmet[1].stats.intellect + 2
      let helmetStrength = helmet[1].stats.strength + 2

      top.forEach((gauntlet) => {

        let gauntletMobility = gauntlet[1].stats.mobility + 2
        let gauntletResilience = gauntlet[1].stats.resilience + 2
        let gauntletRecovery = gauntlet[1].stats.recovery + 2
        let gauntletDiscipline = gauntlet[1].stats.discipline + 2
        let gauntletIntellect = gauntlet[1].stats.intellect + 2
        let gauntletStrength = gauntlet[1].stats.strength + 2

        middle.forEach((chest) => {

          let chestMobility = chest[1].stats.mobility + 2
          let chestResilience = chest[1].stats.resilience + 2
          let chestRecovery = chest[1].stats.recovery + 2
          let chestDiscipline = chest[1].stats.discipline + 2
          let chestIntellect = chest[1].stats.intellect + 2
          let chestStrength = chest[1].stats.strength + 2

          const statsArr = [
            (gauntletMobility + helmetMobility + chestMobility + legMobility + 2) / 10,
            (gauntletResilience + helmetResilience + chestResilience + legResilience + 2) / 10,
            (gauntletRecovery + helmetRecovery + chestRecovery + legRecovery + 2) / 10,
            (gauntletDiscipline + helmetDiscipline + chestDiscipline + legDiscipline + 2) / 10,
            (gauntletIntellect + helmetIntellect + chestIntellect + legIntellect + 2) / 10,
            (gauntletStrength + helmetStrength + chestStrength + legStrength + 2) / 10
          ]

          let totalTier = Math.floor(statsArr[0]) + Math.floor(statsArr[1]) + Math.floor(statsArr[2]) + Math.floor(statsArr[3]) + Math.floor(statsArr[4]) + Math.floor(statsArr[5])

          const tierArr = []

          statsArr.forEach((stat) => {
            let tier = stat
            let totalTier = Math.floor(tier)
            let totalUp = totalTier + 1
            let totalHalf = tier + 0.5
            if (totalHalf >= totalUp) {
              if (totalTier + 0.5 >= 10) {
                tierArr.push(10)
              } else {
                tierArr.push(totalTier + 0.5)
              }
            } else {
              if (totalTier >= 10) {
                tierArr.push(10)
              } else {
                tierArr.push(totalTier)
              }
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const practicalTotal = tierArr.reduce((a, b) => {
            return a + b
          })

          const score = (statsObj.mobility) + (statsObj.resilience * 3) + (statsObj.discipline * 4) + (statsObj.strength * 2)

          const totalIntellectRecovery = statsObj.intellect + statsObj.recovery

          const intellectRecoveryDifference = Math.abs(statsObj.intellect - statsObj.recovery)

          const numberOfMods = (10 - Math.floor(statsObj.intellect)) + (10 - Math.floor(statsObj.recovery))

          let i = statsObj.intellect
          let r = statsObj.recovery

          let points = 0
          if (statsObj.intellect !== Math.floor(statsObj.intellect)) {
            points += 2
            i += 0.5
          }

          if (statsObj.recovery !== Math.floor(statsObj.recovery)) {
            points += 2
            r += 0.5
          }
          points += (10 - i) * 5
          points += (10 - r) * 4

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  const loadout = `Tier ${totalTier}: ${gauntlet[1].name} - ${chest[1].name} - ${leg[1].name}`
                  const stats = { "numberOfMods": numberOfMods, "pointsFromMax": points, "totalIntRec": totalIntellectRecovery, "intRecDiff": intellectRecoveryDifference, "totalTier": totalTier, "score": score, "practicalTotal": practicalTotal, "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  legArray.push({ "loadout": loadout, "stats": stats, "helmetId": helmet[1].itemInstanceId, "exoticName": leg[1].name })
                }
              }
            }
          }
        })
      })
    })

    if (legArray.length === 0) {
      noLoadouts.push(leg[1].name)
    } else {

      legArray.sort((a, b) => {
        return b.stats.totalIntRec - a.stats.totalIntRec
      })

      let n = legArray[0].stats.totalIntRec


      if (n !== Math.floor(n)) {
        n -= 0.5
      }

      const filteredLegArray = legArray.filter((loadout) => {
        if (loadout.stats.totalIntRec >= n) {
          return loadout
        }
        return false
      })

      assignSimpleLoadouts(filteredLegArray, chosen, tieLoadouts)

    }
  })

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
    armorInfoArray.sort((a, b) => b.armorCounter - a.armorCounter)
    // const highArmorCount = armorInfoArray[0].armorCounter
    const filteredArmorInfoArray = armorInfoArray.filter((info) => info.armorCounter !== 0)
    
    if (filteredArmorInfoArray.length === 0) {
      console.log(exoticLoadout[0].exoticName)
      console.log("!!!!!!!!!!There are no armor pieces with a counter over 0!!!!!!!!!!")
      const testTotal = exoticLoadout[0].stats.totalIntRec



      if (exoticLoadout.every((loadout) => loadout.stats.totalIntRec === testTotal)) {

        const testInt = exoticLoadout[0].stats.intellect
        const testRec = exoticLoadout[0].stats.recovery
        const allTheSame = exoticLoadout.every(loadout => loadout.stats.intellect === testInt) && exoticLoadout.every(loadout => loadout.stats.recovery === testRec)

        if (allTheSame) {
          console.log(exoticLoadout[0].exoticName)
          //If there is more then one loadout with the same INT and REC then sort stats in reverse order of importance...
          //...and add the top loadout
          const onlyLoadout = assignVariables(sortArray(exoticLoadout))
          console.log("SAME TOTAL; All loadouts after the 1st filter have the same INT and REC:")
          console.log("Filtered Array:")
          console.log(exoticLoadout)
          console.log(`Keeping:`)
          console.log(onlyLoadout)
          addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
        }
        else {
          let differenceBasedArray
          if (testTotal % 2 === 0) {
            differenceBasedArray = exoticLoadout.filter((loadout) => {
              if (loadout.stats.intRecDiff % 2 === 0) {
                return loadout
              }
              return false
            })
          }

          else {
            differenceBasedArray = exoticLoadout.filter((loadout) => {
              if (loadout.stats.intRecDiff % 2 !== 0) {
                return loadout
              }
              return false
            })
          }

          if (differenceBasedArray.length === 1) {
            const onlyLoadout = assignVariables(differenceBasedArray)
            addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
          }

          else if (testTotal === 19) {
            const intellectLoadout = assignVariables(sortArray(differenceBasedArray, "intellect"))
            addIntellectLoadout(chosen, intellectLoadout.loadout, intellectLoadout.armorId, intellectLoadout.loadout.exoticName)
          }

          else {
            differenceBasedArray.sort((a, b) => a.stats.intRecDiff - b.stats.intRecDiff)
            const lowestDifference = differenceBasedArray[0].stats.intRecDiff
            if (lowestDifference === 0 || lowestDifference === 1) {
              const lowestDifferenceArray = differenceBasedArray.filter((loadout) => {
                if (loadout.stats.intRecDiff === lowestDifference) {
                  return loadout
                }
                return false
              })

              const onlyLoadout = assignVariables(sortArray(lowestDifferenceArray, "intellect"))
              addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
            }
            else {
              differenceBasedArray.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
              const lowestPointsFromMax = differenceBasedArray[0].stats.pointsFromMax
              const lowestPointsFromMaxArray = differenceBasedArray.filter((loadout) => {
                if (loadout.stats.pointsFromMax === lowestPointsFromMax) {
                  return loadout
                }
                return false
              })

              const onlyLoadout = assignVariables(sortArray(lowestPointsFromMaxArray))
              addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
            }
          }
        }
      }
      else {
        exoticLoadout.sort((a, b) => a.stats.intRecDiff - b.stats.intRecDiff)
        const testDifferenceFloored = Math.floor(exoticLoadout[0].stats.intRecDiff)
        const flooredDifferenceArray = exoticLoadout.filter((loadout) => Math.floor(loadout.stats.intRecDiff) === testDifferenceFloored)

        if (flooredDifferenceArray.length === 1) {
          const onlyLoadout = assignVariables(flooredDifferenceArray)
          addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
        }

        else if (testDifferenceFloored < 1) {
          flooredDifferenceArray.sort((a, b) => b.stats.totalIntRec - a.stats.totalIntRec)
          const highestIntellectRecovery = flooredDifferenceArray[0].stats.totalIntRec
          const highestTotalArray = flooredDifferenceArray.filter((loadout) => loadout.stats.totalIntRec === highestIntellectRecovery)
          const onlyLoadout = assignVariables(sortArray(highestTotalArray, "intellect"))
          addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
        }

        else {
          const testInt = Math.floor(flooredDifferenceArray[0].stats.intellect)
          const testRec = Math.floor(flooredDifferenceArray[0].stats.recovery)
          const allTheSame = flooredDifferenceArray.every(loadout => loadout.stats.intellect === testInt) && flooredDifferenceArray.every(loadout => loadout.stats.recovery === testRec)
          if (allTheSame) {
            const onlyLoadout = assignVariables(sortArray(flooredDifferenceArray, "intellect"))
            addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
          }
          else {
            const intellectFocusedArray = sortArray(flooredDifferenceArray, "intellect")
            const intellectLoadout = assignVariables(intellectFocusedArray)
            addIntellectLoadout(chosen, intellectLoadout.loadout, intellectLoadout.armorId, intellectLoadout.loadout.exoticName)

            const recoveryFocusedArray = sortArray(flooredDifferenceArray, "recovery")
            const recoveryLoadout = assignVariables(recoveryFocusedArray)
            addRecoveryLoadout(chosen, recoveryLoadout.loadout, recoveryLoadout.armorId, recoveryLoadout.loadout.exoticName)
          }
        }
      }
    }
    else {
      console.log(exoticLoadout[0].exoticName)
      console.log("There is at least one armor piece with a count of at least 1.")
      const instanceIds = []
      filteredArmorInfoArray.forEach((info) => {
        instanceIds.push(info.instanceId)
      })
      console.log(`Number of compatable armor pieces: ${instanceIds.length}`)
      const filteredExoticLoadouts = exoticLoadout.filter((loadout) => instanceIds.includes(loadout.helmetId))

      const testTotal = filteredExoticLoadouts[0].stats.totalIntRec

      if (filteredExoticLoadouts.length === 1) {
        console.log("Only one loadout remaining:")
        const onlyLoadout = assignVariables(filteredExoticLoadouts)
        console.log("Filtered Array:")
        console.log(filteredExoticLoadouts)
        console.log("Keeping:")
        console.log(onlyLoadout)
        addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
      }

      //Do stuf here?

      else if (filteredExoticLoadouts.every((loadout) => loadout.stats.totalIntRec === testTotal)) {

        const testInt = filteredExoticLoadouts[0].stats.intellect
        const testRec = filteredExoticLoadouts[0].stats.recovery
        const allTheSame = filteredExoticLoadouts.every(loadout => loadout.stats.intellect === testInt) && filteredExoticLoadouts.every(loadout => loadout.stats.recovery === testRec)

        if (allTheSame) {
          console.log(exoticLoadout[0].exoticName)
          //If there is more then one loadout with the same INT and REC then sort stats in reverse order of importance...
          //...and add the top loadout
          const sortedArray = sortArray(filteredExoticLoadouts)
          const topLoadout = sortedArray.shift()

          console.log(topLoadout)
          console.log(filteredExoticLoadouts)

          const multipleTopLoadouts = sortedArray.filter((loadout) => {
            if (findingTieLoadouts(loadout, topLoadout)) {
              return loadout
            }
            return false
          })

          console.log(multipleTopLoadouts)

          if (multipleTopLoadouts.length !== 0) {
            console.log(armorInfoArray)
            multipleTopLoadouts.push(topLoadout)
            console.log(multipleTopLoadouts)
            const armorInstanceId = armorInfoArray[0].instanceId
            const finalLoadoutsArray = multipleTopLoadouts.filter((loadout) => loadout.helmetId === armorInstanceId)
            console.log(finalLoadoutsArray)
            const onlyLoadout = assignVariables(sortArray(finalLoadoutsArray))
            addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
          }
          else {
            console.log("Hello Dunemarchers")
            const onlyLoadout = assignVariables([topLoadout])
            addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
          }
        }
        else {
          console.log("SAME TOTAL; different INT-REC differences.")
          let differenceBasedArray
          if (testTotal % 2 === 0) {
            differenceBasedArray = filteredExoticLoadouts.filter((loadout) => {
              if (loadout.stats.intRecDiff % 2 === 0) {
                return loadout
              }
              return false
            })
          }

          else {
            differenceBasedArray = filteredExoticLoadouts.filter((loadout) => {
              if (loadout.stats.intRecDiff % 2 !== 0) {
                return loadout
              }
              return false
            })
          }

          if (differenceBasedArray.length === 1) {
            console.log("Only one loadout remaining:")
            const onlyLoadout = assignVariables(differenceBasedArray)
            console.log(`Keeping:`)
            console.log(onlyLoadout)
            addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
          }

          else if (testTotal === 19) {
            console.log("Total INT - REC of 19")
            const intellectLoadout = assignVariables(sortArray(differenceBasedArray, "intellect"))
            console.log("Filtered Array:")
            console.log(differenceBasedArray)
            console.log(`Keeping:`)
            console.log(intellectLoadout)
            addIntellectLoadout(chosen, intellectLoadout.loadout, intellectLoadout.armorId, intellectLoadout.loadout.exoticName)
          }

          else {
            differenceBasedArray.sort((a, b) => a.stats.intRecDiff - b.stats.intRecDiff)
            const lowestDifference = differenceBasedArray[0].stats.intRecDiff
            if (lowestDifference === 0 || lowestDifference === 1) {
              const lowestDifferenceArray = differenceBasedArray.filter((loadout) => {
                if (loadout.stats.intRecDiff === lowestDifference) {
                  return loadout
                }
                return false
              })

              console.log("Keeping the best overall loadout with the lowest difference:")
              console.log("Filtered Array:")
              console.log(lowestDifferenceArray)
              const onlyLoadout = assignVariables(sortArray(lowestDifferenceArray, "intellect"))
              console.log(`Keeping:`)
              console.log(onlyLoadout)
              addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
            }
            else {
              differenceBasedArray.sort((a, b) => a.stats.pointsFromMax - b.stats.pointsFromMax)
              const lowestPointsFromMax = differenceBasedArray[0].stats.pointsFromMax
              const lowestPointsFromMaxArray = differenceBasedArray.filter((loadout) => {
                if (loadout.stats.pointsFromMax === lowestPointsFromMax) {
                  return loadout
                }
                return false
              })
              console.log("Keeping the best loadout with the lowest energy needed to 10-10")
              console.log("Filtered Array")
              console.log(lowestPointsFromMaxArray)
              const onlyLoadout = assignVariables(sortArray(lowestPointsFromMaxArray))
              console.log(`Keeping:`)
              console.log(onlyLoadout)
              addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
            }
          }
        }
      }

      else {
        console.log("Different totals")
        filteredExoticLoadouts.sort((a, b) => a.stats.intRecDiff - b.stats.intRecDiff)
        const testDifferenceFloored = Math.floor(filteredExoticLoadouts[0].stats.intRecDiff)
        const flooredDifferenceArray = filteredExoticLoadouts.filter((loadout) => Math.floor(loadout.stats.intRecDiff) === testDifferenceFloored)

        if (flooredDifferenceArray.length === 1) {
          console.log("Only one loadout in the filtered array")
          const onlyLoadout = assignVariables(flooredDifferenceArray)
          console.log(`Keeping:`)
          console.log(onlyLoadout)
          addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
        }

        else if (testDifferenceFloored < 1) {
          flooredDifferenceArray.sort((a, b) => b.stats.totalIntRec - a.stats.totalIntRec)
          const highestIntellectRecovery = flooredDifferenceArray[0].stats.totalIntRec
          const highestTotalArray = flooredDifferenceArray.filter((loadout) => loadout.stats.totalIntRec === highestIntellectRecovery)
          console.log("Filtered Array should return loadouts with a difference less than one, AND the heighest total INT-REC")
          console.log("Filtered Array:")
          console.log(highestTotalArray)
          const onlyLoadout = assignVariables(sortArray(highestTotalArray, "intellect"))
          console.log(`Keeping:`)
          console.log(onlyLoadout)
          addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
        }

        else {
          const testInt = Math.floor(flooredDifferenceArray[0].stats.intellect)
          const testRec = Math.floor(flooredDifferenceArray[0].stats.recovery)
          const allTheSame = flooredDifferenceArray.every(loadout => Math.floor(loadout.stats.intellect === testInt)) && flooredDifferenceArray.every(loadout => Math.floor(loadout.stats.recovery) === testRec)
          if (allTheSame) {
            console.log("All the loadouts have a difference of one or greater AND are all the same INT-REC")
            console.log("Filtered Array")
            console.log(flooredDifferenceArray)
            const onlyLoadout = assignVariables(sortArray(flooredDifferenceArray, "intellect"))
            console.log(`Keeping:`)
            console.log(onlyLoadout)
            addIntellectLoadout(chosen, onlyLoadout.loadout, onlyLoadout.armorId, onlyLoadout.loadout.exoticName)
          }
          else {
            console.log("All loadouts have a difference of one or greater AND SHOULD have inverse INT-REC combos.")
            console.log("Filtered Array:")
            console.log(flooredDifferenceArray)
            const intellectFocusedArray = sortArray(flooredDifferenceArray, "intellect")
            const intellectLoadout = assignVariables(intellectFocusedArray)
            addIntellectLoadout(chosen, intellectLoadout.loadout, intellectLoadout.armorId, intellectLoadout.loadout.exoticName)

            const recoveryFocusedArray = sortArray(flooredDifferenceArray, "recovery")
            const recoveryLoadout = assignVariables(recoveryFocusedArray)
            addRecoveryLoadout(chosen, recoveryLoadout.loadout, recoveryLoadout.armorId, recoveryLoadout.loadout.exoticName)
            console.log(`Keeping (INT):`)
            console.log(intellectLoadout)
            console.log(`Keeping (REC):`)
            console.log(recoveryLoadout)
          }
        }
      }
    }
  })

  chosen.forEach((choice) => {
    choice[1].loadouts.sort((a, b) => {
      return b.stats.score - a.stats.score
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
const LegendaryHelmetEvaluation = (helmets, setHelmets, exoticGauntlets, gauntlets, exoticChests, chests, exoticLegs, legs, userTier, setNoLoadouts) => {
  const noLoadouts = []

  helmets.forEach((helmet) => {
    helmet[1].counter = 0
    helmet[1].loadouts = []
    helmet[1].pairedExotics = []
  })

  //First we start with Exotic Gauntlets...
  exoticGauntlets.forEach((gauntlet) => {
    const gauntletArray = []

    let gauntletMobility = gauntlet[1].stats.mobility + 2
    let gauntletResilience = gauntlet[1].stats.resilience + 2
    let gauntletRecovery = gauntlet[1].stats.recovery + 2
    let gauntletDiscipline = gauntlet[1].stats.discipline + 2
    let gauntletIntellect = gauntlet[1].stats.intellect + 2
    let gauntletStrength = gauntlet[1].stats.strength + 2

    //Then we move on to the target of this evaluation function...
    helmets.forEach((helmet) => {

      let helmetMobility = helmet[1].stats.mobility + 2
      let helmetResilience = helmet[1].stats.resilience + 2
      let helmetRecovery = helmet[1].stats.recovery + 2
      let helmetDiscipline = helmet[1].stats.discipline + 2
      let helmetIntellect = helmet[1].stats.intellect + 2
      let helmetStrength = helmet[1].stats.strength + 2

      chests.forEach((chest) => {

        let chestMobility = chest[1].stats.mobility + 2
        let chestResilience = chest[1].stats.resilience + 2
        let chestRecovery = chest[1].stats.recovery + 2
        let chestDiscipline = chest[1].stats.discipline + 2
        let chestIntellect = chest[1].stats.intellect + 2
        let chestStrength = chest[1].stats.strength + 2

        legs.forEach((leg) => {

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
              tierArr.push(totalTier + 0.5)
            } else {
              tierArr.push(totalTier)
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const practicalTotal = tierArr.reduce((a, b) => {
            return a + b
          })

          const score = (statsObj.mobility * 3) + (statsObj.resilience * 3) + (statsObj.discipline * 3) + (statsObj.strength * 3) + (statsObj.recovery * 4) + (statsObj.intellect * 5)

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  const loadout = `Tier ${totalTier}: ${gauntlet[1].name} - ${chest[1].name} - ${leg[1].name}`
                  const stats = { "score": score, "total": practicalTotal, "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  gauntletArray.push({ "loadout": loadout, "stats": stats, "helmetId": helmet[1].itemInstanceId })
                }
              }
            }
          }
        })
      })
    })

    if (gauntletArray.length === 0) {
      noLoadouts.push(gauntlet[1].name)
    }

    gauntletArray.sort((a, b) => {
      const aTotalMobilityStrength = a.stats.mobility + a.stats.strength
      const bTotalMobilityStrength = b.stats.mobility + b.stats.strength

      return bTotalMobilityStrength - aTotalMobilityStrength
    })

    gauntletArray.sort((a, b) => {
      const aTotalResilienceDiscipline = a.stats.resilience + a.stats.discipline
      const bTotalResilienceDiscipline = b.stats.resilience + b.stats.discipline

      return bTotalResilienceDiscipline - aTotalResilienceDiscipline
    })

    gauntletArray.sort((a, b) => {
      return b.stats.recovery - a.stats.recovery
    })

    gauntletArray.sort((a, b) => {
      return b.stats.intellect - a.stats.intellect
    })

    gauntletArray.sort((a, b) => {
      return b.stats.score - a.stats.score
    })

    let helmetId
    let exoticLoadout
    gauntletArray.every((loadout, index) => {
      if (index === 0) {
        helmetId = loadout.helmetId
        exoticLoadout = loadout
        return false
      }
      return true
    })

    helmets.find((helmet) => {
      if (helmet[1].itemInstanceId === helmetId) {
        helmet[1].counter += 1
        helmet[1].loadouts.push(exoticLoadout)
        if (!helmet[1].pairedExotics.includes(gauntlet[1].name)) {
          helmet[1].pairedExotics.push(gauntlet[1].name)
        }
        return true
      }
      return false
    })

    gauntletArray.sort((a, b) => {
      return b.stats.intellect - a.stats.intellect
    })

    gauntletArray.sort((a, b) => {
      return b.stats.recovery - a.stats.recovery
    })

    gauntletArray.every((loadout, index) => {
      if (index === 0) {
        helmetId = loadout.helmetId
        exoticLoadout = loadout
        return false
      }
      return true
    })

    helmets.find((helmet) => {
      if (helmet[1].itemInstanceId === helmetId) {
        helmet[1].counter += 1
        helmet[1].loadouts.push(exoticLoadout)
        if (!helmet[1].pairedExotics.includes(gauntlet[1].name)) {
          helmet[1].pairedExotics.push(gauntlet[1].name)
        }
        return true
      }
      return false
    })

  })

  //Next we go through all the exotic chests...
  exoticChests.forEach((chest) => {
    const chestArray = []

    let chestMobility = chest[1].stats.mobility + 2
    let chestResilience = chest[1].stats.resilience + 2
    let chestRecovery = chest[1].stats.recovery + 2
    let chestDiscipline = chest[1].stats.discipline + 2
    let chestIntellect = chest[1].stats.intellect + 2
    let chestStrength = chest[1].stats.strength + 2

    helmets.forEach((helmet) => {

      let helmetMobility = helmet[1].stats.mobility + 2
      let helmetResilience = helmet[1].stats.resilience + 2
      let helmetRecovery = helmet[1].stats.recovery + 2
      let helmetDiscipline = helmet[1].stats.discipline + 2
      let helmetIntellect = helmet[1].stats.intellect + 2
      let helmetStrength = helmet[1].stats.strength + 2

      gauntlets.forEach((gauntlet) => {

        let gauntletMobility = gauntlet[1].stats.mobility + 2
        let gauntletResilience = gauntlet[1].stats.resilience + 2
        let gauntletRecovery = gauntlet[1].stats.recovery + 2
        let gauntletDiscipline = gauntlet[1].stats.discipline + 2
        let gauntletIntellect = gauntlet[1].stats.intellect + 2
        let gauntletStrength = gauntlet[1].stats.strength + 2

        legs.forEach((leg) => {

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
              tierArr.push(totalTier + 0.5)
            } else {
              tierArr.push(totalTier)
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const practicalTotal = tierArr.reduce((a, b) => {
            return a + b
          })

          const score = (statsObj.mobility * 3) + (statsObj.resilience * 3) + (statsObj.discipline * 3) + (statsObj.strength * 3) + (statsObj.recovery * 4) + (statsObj.intellect * 5)

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  const loadout = `Tier ${totalTier}: ${gauntlet[1].name} - ${chest[1].name} - ${leg[1].name}`
                  const stats = { "score": score, "total": practicalTotal, "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  chestArray.push({ "loadout": loadout, "stats": stats, "helmetId": helmet[1].itemInstanceId })
                }
              }
            }
          }
        })
      })
    })

    if (chestArray.length === 0) {
      noLoadouts.push(chest[1].name)
    }

    chestArray.sort((a, b) => {
      const aTotalMobilityStrength = a.stats.mobility + a.stats.strength
      const bTotalMobilityStrength = b.stats.mobility + b.stats.strength

      return bTotalMobilityStrength - aTotalMobilityStrength
    })

    chestArray.sort((a, b) => {
      const aTotalResilienceDiscipline = a.stats.resilience + a.stats.discipline
      const bTotalResilienceDiscipline = b.stats.resilience + b.stats.discipline

      return bTotalResilienceDiscipline - aTotalResilienceDiscipline
    })

    chestArray.sort((a, b) => {
      return b.stats.recovery - a.stats.recovery
    })

    chestArray.sort((a, b) => {
      return b.stats.intellect - a.stats.intellect
    })

    chestArray.sort((a, b) => {
      return b.stats.score - a.stats.score
    })

    let helmetId
    let exoticLoadout
    chestArray.every((loadout, index) => {
      if (index === 0) {
        helmetId = loadout.helmetId
        exoticLoadout = loadout
        return false
      }
      return true
    })

    helmets.find((helmet) => {
      if (helmet[1].itemInstanceId === helmetId) {
        helmet[1].counter += 1
        helmet[1].loadouts.push(exoticLoadout)
        if (!helmet[1].pairedExotics.includes(chest[1].name)) {
          helmet[1].pairedExotics.push(chest[1].name)
        }
        return true
      }
      return false
    })

    chestArray.sort((a, b) => {
      return b.stats.intellect - a.stats.intellect
    })

    chestArray.sort((a, b) => {
      return b.stats.recovery - a.stats.recovery
    })

    chestArray.every((loadout, index) => {
      if (index === 0) {
        helmetId = loadout.helmetId
        exoticLoadout = loadout
        return false
      }
      return true
    })

    helmets.find((helmet) => {
      if (helmet[1].itemInstanceId === helmetId) {
        helmet[1].counter += 1
        helmet[1].loadouts.push(exoticLoadout)
        if (!helmet[1].pairedExotics.includes(chest[1].name)) {
          helmet[1].pairedExotics.push(chest[1].name)
        }
        return true
      }
      return false
    })
  })

  //Lastly we go through the exotic legs...
  exoticLegs.forEach((leg) => {
    const legArray = []

    let legMobility = leg[1].stats.mobility + 2
    let legResilience = leg[1].stats.resilience + 2
    let legRecovery = leg[1].stats.recovery + 2
    let legDiscipline = leg[1].stats.discipline + 2
    let legIntellect = leg[1].stats.intellect + 2
    let legStrength = leg[1].stats.strength + 2

    helmets.forEach((helmet) => {

      let helmetMobility = helmet[1].stats.mobility + 2
      let helmetResilience = helmet[1].stats.resilience + 2
      let helmetRecovery = helmet[1].stats.recovery + 2
      let helmetDiscipline = helmet[1].stats.discipline + 2
      let helmetIntellect = helmet[1].stats.intellect + 2
      let helmetStrength = helmet[1].stats.strength + 2

      gauntlets.forEach((gauntlet) => {

        let gauntletMobility = gauntlet[1].stats.mobility + 2
        let gauntletResilience = gauntlet[1].stats.resilience + 2
        let gauntletRecovery = gauntlet[1].stats.recovery + 2
        let gauntletDiscipline = gauntlet[1].stats.discipline + 2
        let gauntletIntellect = gauntlet[1].stats.intellect + 2
        let gauntletStrength = gauntlet[1].stats.strength + 2

        chests.forEach((chest) => {

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
              tierArr.push(totalTier + 0.5)
            } else {
              tierArr.push(totalTier)
            }
          })

          const statsObj = { "mobility": tierArr[0], "resilience": tierArr[1], "recovery": tierArr[2], "discipline": tierArr[3], "intellect": tierArr[4], "strength": tierArr[5] }

          const practicalTotal = tierArr.reduce((a, b) => {
            return a + b
          })

          const score = (statsObj.mobility * 3) + (statsObj.resilience * 3) + (statsObj.discipline * 3) + (statsObj.strength * 3) + (statsObj.recovery * 4) + (statsObj.intellect * 5)

          if (totalTier >= userTier.totalTier) {
            if (statsObj["recovery"] >= userTier.recovery) {
              if (statsObj["intellect"] >= userTier.intellect) {
                if (statsObj["recovery"] + statsObj["intellect"] >= userTier.average) {
                  const loadout = `Tier ${totalTier}: ${gauntlet[1].name} - ${chest[1].name} - ${leg[1].name}`
                  const stats = { "score": score, "total": practicalTotal, "mobility": statsObj["mobility"], "resilience": statsObj["resilience"], "recovery": statsObj["recovery"], "discipline": statsObj["discipline"], "intellect": statsObj["intellect"], "strength": statsObj["strength"] }
                  legArray.push({ "loadout": loadout, "stats": stats, "helmetId": helmet[1].itemInstanceId })
                }
              }
            }
          }
        })
      })
    })

    if (legArray.length === 0) {
      noLoadouts.push(leg[1].name)
    }

    legArray.sort((a, b) => {
      const aTotalMobilityStrength = a.stats.mobility + a.stats.strength
      const bTotalMobilityStrength = b.stats.mobility + b.stats.strength

      return bTotalMobilityStrength - aTotalMobilityStrength
    })

    legArray.sort((a, b) => {
      const aTotalResilienceDiscipline = a.stats.resilience + a.stats.discipline
      const bTotalResilienceDiscipline = b.stats.resilience + b.stats.discipline

      return bTotalResilienceDiscipline - aTotalResilienceDiscipline
    })

    legArray.sort((a, b) => {
      return b.stats.recovery - a.stats.recovery
    })

    legArray.sort((a, b) => {
      return b.stats.intellect - a.stats.intellect
    })

    legArray.sort((a, b) => {
      return b.stats.score - a.stats.score
    })

    let helmetId
    let exoticLoadout
    legArray.every((loadout, index) => {
      if (index === 0) {
        helmetId = loadout.helmetId
        exoticLoadout = loadout
        return false
      }
      return true
    })

    helmets.find((helmet) => {
      if (helmet[1].itemInstanceId === helmetId) {
        helmet[1].counter += 1
        helmet[1].loadouts.push(exoticLoadout)
        if (!helmet[1].pairedExotics.includes(leg[1].name)) {
          helmet[1].pairedExotics.push(leg[1].name)
        }
        return true
      }
      return false
    })

    legArray.sort((a, b) => {
      return b.stats.intellect - a.stats.intellect
    })

    legArray.sort((a, b) => {
      return b.stats.recovery - a.stats.recovery
    })

    legArray.every((loadout, index) => {
      if (index === 0) {
        helmetId = loadout.helmetId
        exoticLoadout = loadout
        return false
      }
      return true
    })

    helmets.find((helmet) => {
      if (helmet[1].itemInstanceId === helmetId) {
        helmet[1].counter += 1
        helmet[1].loadouts.push(exoticLoadout)
        if (!helmet[1].pairedExotics.includes(leg[1].name)) {
          helmet[1].pairedExotics.push(leg[1].name)
        }
        return true
      }
      return false
    })
  })

  //Here is where we'll eventually setHelmets and maybe some other housekeeping stuff...
  helmets.sort((a, b) => {
    return b[1].counter - a[1].counter
  })
  console.log(helmets)
  console.log(noLoadouts)

  const copyHelmets = [...helmets]
  setHelmets(copyHelmets)
  setNoLoadouts(noLoadouts)
}

export default LegendaryHelmetEvaluation
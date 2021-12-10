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
                  console.log(top[1].name)
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
                  console.log(middle[1].name)
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
                  console.log(bottom[1].name)
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
  })

  const copyArmor = [...chosen]
  // console.log(copyArmor)
  setChosen(copyArmor)

}

export default DoubleStatLegendary
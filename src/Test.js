const DoubleStatLegendary = (chosen, setChosen, exoticTop, top, exoticMiddle, middle, exoticBottom, bottom, userTier) => {
  //Inital loop of our chosen armor type---------------------------------------------------------------------------------------------------
  console.log("DoubleStatLegendary")
  chosen.forEach((choice) => {
    choice[1].counter = 0
    choice[1].pairedItems = []
    choice[1].pairedExotics = []
    const combinations = []

    let choiceMobility = choice[1].stats.mobility
    let choiceResilience = choice[1].stats.resilience
    let choiceRecovery = choice[1].stats.recovery
    let choiceDiscipline = choice[1].stats.discipline
    let choiceIntellect = choice[1].stats.intellect
    let choiceStrength = choice[1].stats.strength

    if (!choice[1].isMasterworked) {
      choiceMobility += 2
      choiceResilience += 2
      choiceRecovery += 2
      choiceDiscipline += 2
      choiceIntellect += 2
      choiceStrength += 2
    }

    //First sub group of loops --------------------------------------------------------------------------------------------------------------
    exoticTop.forEach((top) => {

      let topMobility = top[1].stats.mobility
      let topResilience = top[1].stats.resilience
      let topRecovery = top[1].stats.recovery
      let topDiscipline = top[1].stats.discipline
      let topIntellect = top[1].stats.intellect
      let topStrength = top[1].stats.strength

      if (!top[1].isMasterworked) {
        topMobility += 2
        topResilience += 2
        topRecovery += 2
        topDiscipline += 2
        topIntellect += 2
        topStrength += 2
      }

      middle.forEach((middle) => {

        let middleMobility = middle[1].stats.mobility
        let middleResilience = middle[1].stats.resilience
        let middleRecovery = middle[1].stats.recovery
        let middleDiscipline = middle[1].stats.discipline
        let middleIntellect = middle[1].stats.intellect
        let middleStrength = middle[1].stats.strength

        if (!middle[1].isMasterworked) {
          middleMobility += 2
          middleResilience += 2
          middleRecovery += 2
          middleDiscipline += 2
          middleIntellect += 2
          middleStrength += 2
        }

        bottom.forEach((bottom) => {

          let bottomMobility = bottom[1].stats.mobility
          let bottomResilience = bottom[1].stats.resilience
          let bottomRecovery = bottom[1].stats.recovery
          let bottomDiscipline = bottom[1].stats.discipline
          let bottomIntellect = bottom[1].stats.intellect
          let bottomStrength = bottom[1].stats.strength

          if (!bottom[1].isMasterworked) {
            bottomMobility += 2
            bottomResilience += 2
            bottomRecovery += 2
            bottomDiscipline += 2
            bottomIntellect += 2
            bottomStrength += 2
          }

          //This is where we'll have to do some of the evaluations, at the end of each sub group--------------------------------------------
          let mobility = choiceMobility + topMobility + middleMobility + bottomMobility + 2
          let resilience = choiceResilience + topResilience + middleResilience + bottomResilience + 2
          let recovery = choiceRecovery + topRecovery + middleRecovery + bottomRecovery + 2
          let discipline = choiceDiscipline + topDiscipline + middleDiscipline + bottomDiscipline + 2
          let intellect = choiceIntellect + topIntellect + middleIntellect + bottomIntellect + 2
          let strength = choiceStrength + topStrength + middleStrength + bottomStrength + 2

          let mobilityTier = Math.floor(mobility / 10)
          let resilienceTier = Math.floor(resilience / 10)
          let recoveryTier = Math.floor(recovery / 10)
          let disciplineTier = Math.floor(discipline / 10)
          let intellectTier = Math.floor(intellect / 10)
          let strengthTier = Math.floor(strength / 10)

          let totalTier = mobilityTier + resilienceTier + recoveryTier + disciplineTier + intellectTier + strengthTier

          const finalCombination = (873 / mobilityTier) + (1059 / resilienceTier) + (879 / recoveryTier) + (1060 / disciplineTier) + (964 / intellectTier) + (847 / strengthTier)

          if (totalTier >= userTier.totalTier) {
            if (recoveryTier >= userTier.recovery) {
              if (intellectTier >= userTier.intellect) {
                if (recoveryTier + intellectTier >= userTier.average) {
                  choice[1].counter += 1
                  const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
                  const stats = { "mobility": mobilityTier, "resilience": resilienceTier, "recovery": recoveryTier, "discipline": disciplineTier, "intellect": intellectTier, "strength": strengthTier }
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

      let topMobility = top[1].stats.mobility
      let topResilience = top[1].stats.resilience
      let topRecovery = top[1].stats.recovery
      let topDiscipline = top[1].stats.discipline
      let topIntellect = top[1].stats.intellect
      let topStrength = top[1].stats.strength

      if (!top[1].isMasterworked) {
        topMobility += 2
        topResilience += 2
        topRecovery += 2
        topDiscipline += 2
        topIntellect += 2
        topStrength += 2
      }

      exoticMiddle.forEach((middle) => {

        let middleMobility = middle[1].stats.mobility
        let middleResilience = middle[1].stats.resilience
        let middleRecovery = middle[1].stats.recovery
        let middleDiscipline = middle[1].stats.discipline
        let middleIntellect = middle[1].stats.intellect
        let middleStrength = middle[1].stats.strength

        if (!middle[1].isMasterworked) {
          middleMobility += 2
          middleResilience += 2
          middleRecovery += 2
          middleDiscipline += 2
          middleIntellect += 2
          middleStrength += 2
        }

        bottom.forEach((bottom) => {

          let bottomMobility = bottom[1].stats.mobility
          let bottomResilience = bottom[1].stats.resilience
          let bottomRecovery = bottom[1].stats.recovery
          let bottomDiscipline = bottom[1].stats.discipline
          let bottomIntellect = bottom[1].stats.intellect
          let bottomStrength = bottom[1].stats.strength

          if (!bottom[1].isMasterworked) {
            bottomMobility += 2
            bottomResilience += 2
            bottomRecovery += 2
            bottomDiscipline += 2
            bottomIntellect += 2
            bottomStrength += 2
          }

          //This is where we'll have to likely do some of the evaluations, at the end of each sub group---------------------------------------
          let mobility = choiceMobility + topMobility + middleMobility + bottomMobility + 2
          let resilience = choiceResilience + topResilience + middleResilience + bottomResilience + 2
          let recovery = choiceRecovery + topRecovery + middleRecovery + bottomRecovery + 2
          let discipline = choiceDiscipline + topDiscipline + middleDiscipline + bottomDiscipline + 2
          let intellect = choiceIntellect + topIntellect + middleIntellect + bottomIntellect + 2
          let strength = choiceStrength + topStrength + middleStrength + bottomStrength + 2

          let mobilityTier = Math.floor(mobility / 10)
          let resilienceTier = Math.floor(resilience / 10)
          let recoveryTier = Math.floor(recovery / 10)
          let disciplineTier = Math.floor(discipline / 10)
          let intellectTier = Math.floor(intellect / 10)
          let strengthTier = Math.floor(strength / 10)

          let totalTier = mobilityTier + resilienceTier + recoveryTier + disciplineTier + intellectTier + strengthTier

          const finalCombination = (873 / mobilityTier) + (1059 / resilienceTier) + (879 / recoveryTier) + (1060 / disciplineTier) + (964 / intellectTier) + (847 / strengthTier)
        
          if (totalTier >= userTier.totalTier) {
            if (recoveryTier >= userTier.recovery) {
              if (intellectTier >= userTier.intellect) {
                if (recoveryTier + intellectTier >= userTier.average) {
                  choice[1].counter += 1
                  const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
                  const stats = { "mobility": mobilityTier, "resilience": resilienceTier, "recovery": recoveryTier, "discipline": disciplineTier, "intellect": intellectTier, "strength": strengthTier }
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

      let topMobility = top[1].stats.mobility
      let topResilience = top[1].stats.resilience
      let topRecovery = top[1].stats.recovery
      let topDiscipline = top[1].stats.discipline
      let topIntellect = top[1].stats.intellect
      let topStrength = top[1].stats.strength

      if (!top[1].isMasterworked) {
        topMobility += 2
        topResilience += 2
        topRecovery += 2
        topDiscipline += 2
        topIntellect += 2
        topStrength += 2
      }

      middle.forEach((middle) => {

        let middleMobility = middle[1].stats.mobility
        let middleResilience = middle[1].stats.resilience
        let middleRecovery = middle[1].stats.recovery
        let middleDiscipline = middle[1].stats.discipline
        let middleIntellect = middle[1].stats.intellect
        let middleStrength = middle[1].stats.strength

        if (!middle[1].isMasterworked) {
          middleMobility += 2
          middleResilience += 2
          middleRecovery += 2
          middleDiscipline += 2
          middleIntellect += 2
          middleStrength += 2
        }

        exoticBottom.forEach((bottom) => {

          let bottomMobility = bottom[1].stats.mobility
          let bottomResilience = bottom[1].stats.resilience
          let bottomRecovery = bottom[1].stats.recovery
          let bottomDiscipline = bottom[1].stats.discipline
          let bottomIntellect = bottom[1].stats.intellect
          let bottomStrength = bottom[1].stats.strength

          if (!bottom[1].isMasterworked) {
            bottomMobility += 2
            bottomResilience += 2
            bottomRecovery += 2
            bottomDiscipline += 2
            bottomIntellect += 2
            bottomStrength += 2
          }

          //This is where we'll have to likely do some of the evaluations, at the end of each sub group---------------------------------------
          let mobility = choiceMobility + topMobility + middleMobility + bottomMobility + 2
          let resilience = choiceResilience + topResilience + middleResilience + bottomResilience + 2
          let recovery = choiceRecovery + topRecovery + middleRecovery + bottomRecovery + 2
          let discipline = choiceDiscipline + topDiscipline + middleDiscipline + bottomDiscipline + 2
          let intellect = choiceIntellect + topIntellect + middleIntellect + bottomIntellect + 2
          let strength = choiceStrength + topStrength + middleStrength + bottomStrength + 2

          let mobilityTier = Math.floor(mobility / 10)
          let resilienceTier = Math.floor(resilience / 10)
          let recoveryTier = Math.floor(recovery / 10)
          let disciplineTier = Math.floor(discipline / 10)
          let intellectTier = Math.floor(intellect / 10)
          let strengthTier = Math.floor(strength / 10)

          let totalTier = mobilityTier + resilienceTier + recoveryTier + disciplineTier + intellectTier + strengthTier

          const finalCombination = (873 / mobilityTier) + (1059 / resilienceTier) + (879 / recoveryTier) + (1060 / disciplineTier) + (964 / intellectTier) + (847 / strengthTier)

          if (totalTier >= userTier.totalTier) {
            if (recoveryTier >= userTier.recovery) {
              if (intellectTier >= userTier.intellect) {
                if (recoveryTier + intellectTier >= userTier.average) {
                  choice[1].counter += 1
                  const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
                  const stats = { "mobility": mobilityTier, "resilience": resilienceTier, "recovery": recoveryTier, "discipline": disciplineTier, "intellect": intellectTier, "strength": strengthTier }
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
  setChosen(copyArmor)
}

export default DoubleStatLegendary
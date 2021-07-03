const ExoticLoop = (exotics, setExotics, top, middle, bottom, userTier, chained) => {
  //This is where we can create more custom keys and initiallize their values 
  exotics.forEach((exotic) => {
    exotic[1].pairedItems = []
    exotic[1].customTier = {
      totalTier: 0,
      mobility: 0,
      resilience: 0,
      recovery: 0,
      discipline: 0,
      intellect: 0,
      strength: 0,
      chained: 0
    }

    const combinations = []

    let exoticMobility = exotic[1].stats.mobility
    let exoticResilience = exotic[1].stats.resilience
    let exoticRecovery = exotic[1].stats.recovery
    let exoticDiscipline = exotic[1].stats.discipline
    let exoticIntellect = exotic[1].stats.intellect
    let exoticStrength = exotic[1].stats.strength

    if (!exotic[1].isMasterworked) {
      exoticMobility += 2
      exoticResilience += 2
      exoticRecovery += 2
      exoticDiscipline += 2
      exoticIntellect += 2
      exoticStrength += 2
    }

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

          let mobility = exoticMobility + topMobility + middleMobility + bottomMobility + 2
          let resilience = exoticResilience + topResilience + middleResilience + bottomResilience + 2
          let recovery = exoticRecovery + topRecovery + middleRecovery + bottomRecovery + 2
          let discipline = exoticDiscipline + topDiscipline + middleDiscipline + bottomDiscipline + 2
          let intellect = exoticIntellect + topIntellect + middleIntellect + bottomIntellect + 2
          let strength = exoticStrength + topStrength + middleStrength + bottomStrength + 2

          let mobilityTier = Math.floor(mobility / 10)
          let resilienceTier = Math.floor(resilience / 10)
          let recoveryTier = Math.floor(recovery / 10)
          let disciplineTier = Math.floor(discipline / 10)
          let intellectTier = Math.floor(intellect / 10)
          let strengthTier = Math.floor(strength / 10)

          const finalCombination = (873 / mobilityTier) + (1059 / resilienceTier) + (879 / recoveryTier) + (1060 / disciplineTier) + (964 / intellectTier) + (847 / strengthTier)

          let totalTier = mobilityTier + resilienceTier + recoveryTier + disciplineTier + intellectTier + strengthTier

          if (chained) {
            if (totalTier >= userTier.totalTier) {
              if (mobilityTier >= userTier.mobility) {
                if (resilienceTier >= userTier.resilience) {
                  if (recoveryTier >= userTier.recovery) {
                    if (disciplineTier >= userTier.discipline) {
                      if (intellectTier >= userTier.intellect) {
                        if (strengthTier >= userTier.strength) {
                          exotic[1].customTier.chained += 1
                          const loadout = []
                          loadout.push(top[1].name)
                          loadout.push(middle[1].name)
                          loadout.push(bottom[1].name)
                          exotic[1].pairedItems.push(loadout)
                          combinations.push(finalCombination)
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          else {
            if (totalTier >= userTier.totalTier) {
              exotic[1].customTier.totalTier += 1
            }
            if (mobilityTier >= userTier.mobility) {
              exotic[1].customTier.mobility += 1
            }
            if (resilienceTier >= userTier.resilience) {
              exotic[1].customTier.resilience += 1
            }
            if (recoveryTier >= userTier.recovery) {
              exotic[1].customTier.recovery += 1
            }
            if (disciplineTier >= userTier.discipline) {
              exotic[1].customTier.discipline += 1
            }
            if (intellectTier >= userTier.intellect) {
              exotic[1].customTier.intellect += 1
            }
            if (strengthTier >= userTier.strength) {
              exotic[1].customTier.strength += 1
            }
            combinations.push(finalCombination)
          }
        })
      })
    })
    const uniqueCombosSet = new Set(combinations)
    exotic[1].uniqueCombos = uniqueCombosSet.size
  })

  const copyExotics = [...exotics]
  setExotics(copyExotics)
}

export default ExoticLoop
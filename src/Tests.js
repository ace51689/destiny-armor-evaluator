const DoubleStatLoop = (exotics, setExotics, top, middle, bottom) => {
  // let startingTier = 31
  // while (startingTier >= 30) {
  let trackedRecovery = 0
  //This is where we can create more custom keys and initiallize their values 
  exotics.forEach((exotic) => {
    exotic[1].pairedItems = []
    // exotic[1].pairedItems.loadouts = []
    // exotic[1].pairedItems.stats = []
    // exotic[1].customTier = {
    //   totalTier: 0,
    //   mobility: 0,
    //   resilience: 0,
    //   recovery: 0,
    //   discipline: 0,
    //   intellect: 0,
    //   strength: 0,
    //   chained: 0
    // }

    // const combinations = []

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
      // console.log("running")

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

          // const finalCombination = (873 / mobilityTier) + (1059 / resilienceTier) + (879 / recoveryTier) + (1060 / disciplineTier) + (964 / intellectTier) + (847 / strengthTier)

          let totalTier = mobilityTier + resilienceTier + recoveryTier + disciplineTier + intellectTier + strengthTier

          if (totalTier >= 30) {
            if (recoveryTier > trackedRecovery) {
              trackedRecovery = recoveryTier
              exotic[1].pairedItems.length = 0
            }
            if (recoveryTier === trackedRecovery) {
              const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
              const stats = { "mobility": mobilityTier, "resilience": resilienceTier, "recovery": recoveryTier, "discipline": disciplineTier, "intellect": intellectTier, "strength": strengthTier }
              exotic[1].pairedItems.push([loadout, stats])
              // exotic[1].pairedItems.stats.push(stats)
            }
          }
        })
      })
    })
    // console.log(exotics[0][1].pairedItems.stats)
  })


  exotics[0][1].pairedItems.sort((a, b) => {
    return b[1].resilience - a[1].resilience
  }).sort((a, b) => {
    return b[1].intellect - a[1].intellect
  })

  console.log(exotics[0][1].pairedItems)

  const copyExotics = [...exotics]
  setExotics(copyExotics)
}

export default DoubleStatLoop
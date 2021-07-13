const DoubleStatLoop = (exotics, setExotics, top, middle, bottom) => {
  console.log("DoubleStatLoop")
  exotics.forEach((exotic) => {
    let trackedRecovery = 0
    let trackedIntellect = 0
    exotic[1].recoveryItems = []
    exotic[1].intellectItems = []

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

          let totalTier = mobilityTier + resilienceTier + recoveryTier + disciplineTier + intellectTier + strengthTier

          if (totalTier >= 30) {
            if (recoveryTier > trackedRecovery) {
              trackedRecovery = recoveryTier
              exotic[1].recoveryItems.length = 0
            }
            if (recoveryTier === trackedRecovery) {
              const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
              const stats = { "mobility": mobilityTier, "resilience": resilienceTier, "recovery": recoveryTier, "discipline": disciplineTier, "intellect": intellectTier, "strength": strengthTier }
              exotic[1].recoveryItems.push([loadout, stats])
            }
          }

          if (totalTier >= 30) {
            if (intellectTier > trackedIntellect) {
              trackedIntellect = intellectTier
              exotic[1].intellectItems.length = 0
            }
            if (intellectTier === trackedIntellect) {
              const loadout = `Tier ${totalTier}: ${top[1].name} - ${middle[1].name} - ${bottom[1].name}`
              const stats = { "mobility": mobilityTier, "resilience": resilienceTier, "recovery": recoveryTier, "discipline": disciplineTier, "intellect": intellectTier, "strength": strengthTier }
              exotic[1].intellectItems.push([loadout, stats])
            }
          }
        })
      })
    })

    exotic[1].recoveryItems.sort((a, b) => {
      return b[1].intellect - a[1].intellect
    })

    exotic[1].intellectItems.sort((a, b) => {
      return b[1].recovery - a[1].recovery
    })

    let highInt = exotic[1].recoveryItems[0][1].intellect
    let highRec = exotic[1].intellectItems[0][1].recovery
    const recoveryGroup = exotic[1].recoveryItems.filter(group => group[1].intellect === highInt)
    const intellectGroup = exotic[1].intellectItems.filter(group => group[1].recovery === highRec)
    exotic[1].recoveryItems = recoveryGroup
    exotic[1].intellectItems = intellectGroup
  })

  const copyExotics = [...exotics]
  setExotics(copyExotics)
}

export default DoubleStatLoop
const GroupLoop = (chosen, setChosen, exoticTop, top, exoticMiddle, middle, exoticBottom, bottom, userTier, chained) => {
  //Inital loop of our chosen armor type---------------------------------------------------------------------------------------------------
  chosen.forEach((choice) => {
    choice[1].pairedExotics = []
    choice[1].customTier = {
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
    // console.log("running")
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
                          choice[1].customTier.chained += 1
                          if (choice[1].pairedExotics.length === 0) {
                            choice[1].pairedExotics.push(top[1].name)
                          }
                          else if (!choice[1].pairedExotics.includes(top[1].name)) {
                            choice[1].pairedExotics.push(top[1].name)
                          }
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
              choice[1].customTier.totalTier += 1
            }
            if (mobilityTier >= userTier.mobility) {
              choice[1].customTier.mobility += 1
            }
            if (resilienceTier >= userTier.resilience) {
              choice[1].customTier.resilience += 1
            }
            if (recoveryTier >= userTier.recovery) {
              choice[1].customTier.recovery += 1
            }
            if (disciplineTier >= userTier.discipline) {
              choice[1].customTier.discipline += 1
            }
            if (intellectTier >= userTier.intellect) {
              choice[1].customTier.intellect += 1
            }
            if (strengthTier >= userTier.strength) {
              choice[1].customTier.strength += 1
            }
            combinations.push(finalCombination)
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
                          choice[1].customTier.chained += 1
                          if (choice[1].pairedExotics.length === 0) {
                            choice[1].pairedExotics.push(middle[1].name)
                          }
                          else if (!choice[1].pairedExotics.includes(middle[1].name)) {
                            choice[1].pairedExotics.push(middle[1].name)
                          }
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
              choice[1].customTier.totalTier += 1
            }
            if (mobilityTier >= userTier.mobility) {
              choice[1].customTier.mobility += 1
            }
            if (resilienceTier >= userTier.resilience) {
              choice[1].customTier.resilience += 1
            }
            if (recoveryTier >= userTier.recovery) {
              choice[1].customTier.recovery += 1
            }
            if (disciplineTier >= userTier.discipline) {
              choice[1].customTier.discipline += 1
            }
            if (intellectTier >= userTier.intellect) {
              choice[1].customTier.intellect += 1
            }
            if (strengthTier >= userTier.strength) {
              choice[1].customTier.strength += 1
            }
            combinations.push(finalCombination)
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
                          choice[1].customTier.chained += 1
                          if (choice[1].pairedExotics.length === 0) {
                            choice[1].pairedExotics.push(bottom[1].name)
                          }
                          else if (!choice[1].pairedExotics.includes(bottom[1].name)) {
                            choice[1].pairedExotics.push(bottom[1].name)
                          }
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
              choice[1].customTier.totalTier += 1
            }
            if (mobilityTier >= userTier.mobility) {
              choice[1].customTier.mobility += 1
            }
            if (resilienceTier >= userTier.resilience) {
              choice[1].customTier.resilience += 1
            }
            if (recoveryTier >= userTier.recovery) {
              choice[1].customTier.recovery += 1
            }
            if (disciplineTier >= userTier.discipline) {
              choice[1].customTier.discipline += 1
            }
            if (intellectTier >= userTier.intellect) {
              choice[1].customTier.intellect += 1
            }
            if (strengthTier >= userTier.strength) {
              choice[1].customTier.strength += 1
            }
            combinations.push(finalCombination)
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

export default GroupLoop
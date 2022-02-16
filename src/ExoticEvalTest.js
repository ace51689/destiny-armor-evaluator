import { calculateStats, processingLeftoverLoadouts, organizeAndSetArray } from './Test2'

const resetEvaluation = (exoticArray) => {
  exoticArray.forEach((armor) => {
    armor[1].counter = 0
    armor[1].loadouts = []
  })
}

const exoticEvaluation = (exotics, setExotics, top, middle, bottom, userTier, setNoLoadouts) => {
  const noLoadouts = []
  const tieLoadouts = []

  //Reset counters and necessary arrays to 0 and empty respectfully
  resetEvaluation(exotics)

  //Firts we start with Exotic Helmets...
  calculateStats(exotics, top, middle, bottom, userTier, noLoadouts, tieLoadouts)

  //Here is where we'll eventually setHelmets and maybe some other housekeeping stuff...
  tieLoadouts.forEach((exoticLoadout) => {
    const armorInfoArray = []

    processingLeftoverLoadouts(exoticLoadout, top, middle, bottom, armorInfoArray, tieLoadouts)

  })

  //Sort and set each Armor array...
  organizeAndSetArray(exotics, setExotics)

  setNoLoadouts(noLoadouts)
}

export default exoticEvaluation
import React from 'react'
import ArmorItem from './ArmorItem'
import ExoticItem from './ExoticItem'

function ArmorList(props) {
  const key = (choice) => {
    if (choice.itemInstanceId !== undefined) {
      return choice.itemInstanceId
    }
    else {
      return choice.itemHash
    }
  }

  let filteredArmor
  if (!props.exotic) {
    filteredArmor = props.chosen && props.chosen.filter(choice => {
      const showVendor = props.showVendor
      const showKeeps = props.showKeeps
      const showJunks = props.showJunks

      if (choice.counter !== undefined) {
        if (showVendor && showKeeps && !showJunks) {
          return choice.counter > 0 || !choice.owned
        }
        if (showVendor && !showKeeps && showJunks) {
          return choice.counter === 0 || !choice.owned
        }
        if (showVendor && !showKeeps && !showJunks) {
          return !choice.owned
        }
        if (!showVendor && showKeeps && showJunks) {
          return choice.owned
        }
        if (!showVendor && showKeeps && !showJunks) {
          return choice.counter > 0 && choice.owned
        }
        if (!showVendor && !showKeeps && showJunks) {
          return choice.counter === 0 && choice.owned
        }
        if (!showVendor && !showKeeps && !showJunks) {
          return false
        }
      }
      else {
        if (!showVendor) {
          return choice.owned
        }
        else {
          return choice
        }
      }
      return choice
    })
  }
  else {
    filteredArmor = props.chosen.filter(choice => {
      const showDuplicates = props.showDuplicates
      const showVendor = props.showVendor

      const exoticHashes = props.chosen.map(item => item.itemHash)
      const dupeHashes = exoticHashes.filter((armor, index) => exoticHashes.indexOf(armor) !== index)

      if (showDuplicates && showVendor) {
        return dupeHashes.includes(choice.itemHash) || !choice.owned
      }
      if (showDuplicates && !showVendor) {
        return dupeHashes.includes(choice.itemHash) && choice.owned
      }
      if (!showDuplicates && !showVendor) {
        return choice.owned
      }

      return choice
    })
  }

  const noArmor = filteredArmor.length === 0

  const noExotic = props.exotic && !props.chosen

  return (
    <div>
      {
        noArmor || noExotic ?
          <div>No armor pieces matched your filter criteria. Change your filter parameters and try again.</div>
          :
          <ul className='armor-list'>
            {
              props.chosen && filteredArmor
                .map(choice => {
                  if (choice.length > 1) {
                    return <ExoticItem
                      key={choice[0].itemHash}
                      item={choice}
                    />
                  }
                  else {
                    return <ArmorItem
                      key={key(choice)}
                      item={choice}
                    />
                  }
                })
            }
          </ul>
      }
    </div>
  )
}

export default ArmorList
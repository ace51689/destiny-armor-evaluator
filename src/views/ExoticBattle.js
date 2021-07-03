import React, { useState, useEffect } from 'react'
import { useStore } from '../store/store'
import ArmorItem from '../components/ArmorItem'

const ExoticBattle = (props) => {
  const userArmor = useStore((state) => state.userArmor)
  const [exotics, setExotics] = useState([])
  const [exoticDupes, setExoticDupes] = useState([])

  useEffect(() => {
    const exoticArray = userArmor.filter((item) => {
      if (item[1].itemTier === "Exotic") {
        return item
      }
      return false
    })
    setExotics(exoticArray)
  }, [userArmor])

  const checkForDupes = () => {
    const exoticHashes = []
    const dupeHashes = []
    if (exotics.length > 0) {
      exotics.forEach((exotic) => {
        if (exoticHashes.length === 0) {
          exoticHashes.push(exotic[1].itemHash)
        }
        else if (exoticHashes.includes(exotic[1].itemHash) && !dupeHashes.includes(exotic[1].itemHash)) {
            dupeHashes.push(exotic[1].itemHash)
        }
        exoticHashes.push(exotic[1].itemHash)
      })

      const dupes = []
      dupeHashes.forEach((dupeHash) => {
        dupes.push(exotics.find((exotic) => exotic[1].itemHash === dupeHash))
      })
      setExoticDupes(dupes)
    }
    console.log("No dupes found!")
  }

  return (
    <div>
      This is EXOTIC BATTLE! A place where you can pit dupe exotics against eachother to see which one comes out on top!
      {exoticDupes.length > 0 ?
        exoticDupes.map((exotic) => {
          return <ArmorItem
            {...exotic[1]}
            key={exotic[0]}
          />
        }) : <button onClick={checkForDupes}>Check for Dupes</button>}
    </div>
  )
}

export default ExoticBattle
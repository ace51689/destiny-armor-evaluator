import React, { useEffect } from 'react'
import { getProfile } from '../endpoints'
import { useStore } from "../store/store"

const ExoticBattle = (props) => {
  const destinyId = useStore((state) => state.destinyId)
  const memberType = useStore((state) => state.memberType)
  const authToken = useStore((state) => state.authToken)

  useEffect(() => {
    const armorArray = []
    getProfile(destinyId, memberType, authToken)
      .then((res) => {
        const masterArray = res.Response.profileInventory.data.items.filter((item) => item.itemInstanceId !== undefined)
        Object.entries(res.Response.characterInventories.data).forEach((character) => {
          character[1].items.forEach((item) => {
            masterArray.push(item)
          })
        })
        Object.entries(res.Response.characterEquipment.data).forEach((character) => {
          character[1].items.forEach((item) => {
            masterArray.push(item)
          })
        })
        // console.log(masterArray)
        Object.entries(res.Response.itemComponents.instances.data).filter((item) => {
          if (item[1].primaryStat !== undefined) {
            return item
          }
        }).filter((item) => {
          if (item[1].primaryStat.statHash === 3897883278) {
            return item
          }
        }).forEach((item) => {
          const itemArray = [item[0]]
          const itemInstanceId = parseInt(itemArray[0])
          let itemHash
          masterArray.forEach((master) => {
            if (master.itemInstanceId == itemInstanceId) {
              itemHash = master.itemHash
            }
          })
          const powerLevel = item[1].primaryStat.value
          const energyCapacity = item[1].energy.energyCapacity
          const isMasterworked = energyCapacity === 10
          let energyType
          if (item[1].energy.energyTypeHash === 591714140) {
            energyType = "Solar"
          }
          if (item[1].energy.energyTypeHash === 4069572561) {
            energyType = "Void"
          }
          if (item[1].energy.energyTypeHash === 728351493) {
            energyType = "Arc"
          }
          const obj = { itemInstanceId: itemInstanceId, itemHash: itemHash, itemType: "Armor", powerLevel: powerLevel, energyCapacity: energyCapacity, energyType: energyType, isMasterworked: isMasterworked }
          itemArray.push(obj)
          armorArray.push(itemArray)
          // console.log(itemArray)
        })
        console.log(armorArray)
      })
  }, [])

  return (
    <div>
      This is EXOTIC BATTLE! A place where you can pit dupe exotics against eachother to see which one comes out on top!
      {destinyId && <div>{destinyId}</div>}
    </div>
  )
}

export default ExoticBattle

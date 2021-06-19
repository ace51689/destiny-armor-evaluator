import React, { useEffect } from 'react'
import { getProfile, getItem } from '../endpoints'
import { GET_USER_ARMOR, useStore } from "../store/store"

const ExoticBattle = (props) => {
  const dispatch = useStore((state) => state.dispatch)
  const destinyId = useStore((state) => state.destinyId)
  const memberType = useStore((state) => state.memberType)
  const authToken = useStore((state) => state.authToken)
  const staticArmor = useStore((state) => state.staticArmor)
  const userArmor = useStore((state) => state.userArmor)

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
          return false
        }).filter((item) => {
          if (item[1].primaryStat.statHash === 3897883278) {
            return item
          }
          return false
        }).forEach((item) => {
          const obj = {}
          const itemArray = [item[0]]
          obj.itemInstanceId = item[0]
          obj.itemType = "Armor"
          masterArray.forEach((master) => {
            if (master.itemInstanceId === obj.itemInstanceId) {
              obj.itemHash = master.itemHash
            }
          })
          staticArmor.forEach((staticItem) => {
            if (staticItem[0] == obj.itemHash) {
              obj.name = staticItem[1].displayProperties.name
              obj.itemSubType = staticItem[1].itemTypeDisplayName
              obj.itemTier = staticItem[1].inventory.tierTypeName
              obj.icon = staticItem[1].displayProperties.icon
              switch(staticItem[1].classType) {
                case 0:
                  obj.equippableBy = "Titan"
                  break;
                case 1:
                  obj.equippableBy = "Hunter"
                  break;
                case 2:
                  obj.equippableBy = "Warlock"
                  break;
                default:
                  return
              }
            }
          })
          obj.powerLevel = item[1].primaryStat.value
          obj.energyCapacity = item[1].energy.energyCapacity
          obj.isMasterworked = obj.energyCapacity === 10
          if (item[1].energy.energyTypeHash === 591714140) {
            obj.energyType = "Solar"
          }
          if (item[1].energy.energyTypeHash === 4069572561) {
            obj.energyType = "Void"
          }
          if (item[1].energy.energyTypeHash === 728351493) {
            obj.energyType = "Arc"
          }
          
          itemArray.push(obj)
          armorArray.push(itemArray)
          // console.log(itemArray)
          getItem(destinyId, memberType, obj.itemInstanceId).then((res) => {
            const statPath = res.Response.stats.data.stats
            obj.stats = {}
            obj.stats.intellect = statPath[144602215].value 
            obj.stats.resilience = statPath[392767087].value
            obj.stats.discipline = statPath[1735777505].value
            obj.stats.recovery = statPath[1943323491].value
            obj.stats.mobility = statPath[2996146975].value
            obj.stats.strength = statPath[4244567218].value
          })
        })
        console.log(armorArray)
        dispatch({ type: GET_USER_ARMOR, payload: armorArray })
      })
  }, [])

  return (
    <div>
      This is EXOTIC BATTLE! A place where you can pit dupe exotics against eachother to see which one comes out on top!
      {destinyId && <div>{destinyId}</div>}
      {/* {userArmor && <div>{userArmor[0][1].equippableBy}</div>} */}
      {userArmor && userArmor.includes((item) => item[1].equippableBy === "Titan")}
    </div>
  )
}

export default ExoticBattle
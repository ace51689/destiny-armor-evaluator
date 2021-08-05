import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { useStore, GET_USER_ARMOR } from '../store/store'
import { getProfile, getItem } from '../endpoints'

const GetUserArmor = (props) => {
  const history = useHistory()
  const dispatch = useStore((state) => state.dispatch)
  const destinyId = localStorage.getItem("DESTINY_ID")
  const memberType = localStorage.getItem("MEMBER_TYPE")
  const authToken = localStorage.getItem("AUTH_TOKEN")
  const staticArmor = useStore((state) => state.staticArmor)
  const playerClass = useStore((state) => state.playerClass)

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
            if (staticItem[0] === (obj.itemHash).toString()) {
              // console.log("success")
              obj.name = staticItem[1].displayProperties.name
              obj.itemSubType = staticItem[1].itemTypeDisplayName
              obj.itemTier = staticItem[1].inventory.tierTypeName
              obj.icon = staticItem[1].displayProperties.icon
              switch (staticItem[1].classType) {
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

          // console.log(itemArray)
          getItem(destinyId, memberType, item[0]).then((res) => {
            const statPath = res.Response.stats.data.stats
            obj.stats = {}
            obj.stats.intellect = statPath[144602215].value
            obj.stats.resilience = statPath[392767087].value
            obj.stats.discipline = statPath[1735777505].value
            obj.stats.recovery = statPath[1943323491].value
            obj.stats.mobility = statPath[2996146975].value
            obj.stats.strength = statPath[4244567218].value
          })
          //This is where we can change the class of the armor we want to load-----------------------------------
          if (obj.equippableBy === playerClass) {
            itemArray.push(obj)
            armorArray.push(itemArray)
          }
        })
        // console.log(armorArray)
        dispatch({ type: GET_USER_ARMOR, payload: armorArray })
        history.push("/main")
      })
  }, [authToken, destinyId, dispatch, history, memberType, staticArmor, playerClass])

  return (
    <div>
      Loading User Armor...
    </div>
  )
}

export default GetUserArmor

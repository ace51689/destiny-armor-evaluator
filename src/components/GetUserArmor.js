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
  const intrinsics = useStore((state) => state.intrinsics)
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
        Object.entries(res.Response.itemComponents.instances.data).filter((item) => {
          if (item[1].primaryStat !== undefined && item[1].primaryStat.statHash === 3897883278) {
            return item
          }
          return false
        }).forEach((item) => {
          const obj = {}
          const itemArray = [item[0]]
          obj.itemInstanceId = item[0]
          obj.itemType = "Armor"
          obj.stats = {}
          obj.stats.mobility = 0
          obj.stats.resilience = 0
          obj.stats.recovery = 0
          obj.stats.discipline = 0
          obj.stats.intellect = 0
          obj.stats.strength = 0
          masterArray.forEach((master) => {
            if (master.itemInstanceId === obj.itemInstanceId) {
              obj.itemHash = master.itemHash
            }
          })
          staticArmor.forEach((staticItem) => {
            if (staticItem[0] === (obj.itemHash).toString() && staticItem[1].itemCategoryHashes[1] !== 49) {
              obj.name = staticItem[1].displayProperties.name
              obj.itemSubType = staticItem[1].itemTypeDisplayName
              obj.itemTier = staticItem[1].inventory.tierTypeName
              obj.icon = staticItem[1].displayProperties.icon
              obj.categoryHash = staticItem[1].itemCategoryHashes[1]

              const statsPath = staticItem[1].stats.stats
              if (statsPath[2996146975]) {
                obj.stats.mobility += statsPath[2996146975].value
              }
              if (statsPath[392767087]) {
                obj.stats.resilience += statsPath[392767087].value
              }
              if (statsPath[1943323491]) {
                obj.stats.recovery += statsPath[1943323491].value
              }

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
          if (item[1].energy.energyTypeHash === 591714140) {
            // console.log(true)
            obj.energyType = "Solar"
          } else if (item[1].energy.energyTypeHash === 4069572561) {
            obj.energyType = "Void"
          } else if (item[1].energy.energyTypeHash === 728351493) {
            obj.energyType = "Arc"
          } else {
            obj.energyType = "Stasis"
          }

          obj.isMasterworked = obj.energyCapacity === 10
          //This is where we can change the class of the armor we want to load-----------------------------------
          if (playerClass === obj.equippableBy) {
            getItem(destinyId, memberType, item[0]).then((res) => {
              console.log("counter")
              // const statPath = res.Response.stats.data.stats
              if (res.Response !== undefined) {
                const intrinsicsPath = res.Response.sockets.data.sockets
                const tops = [intrinsicsPath[6], intrinsicsPath[7]]
                const bottoms = [intrinsicsPath[8], intrinsicsPath[9]]

                tops.forEach((hash) => {
                  if (hash !== undefined && hash.isEnabled) {
                    const intrinsic = intrinsics.find(item => item[0] === hash.plugHash.toString())
                    if (intrinsic !== undefined) {
                      const investmentStats = intrinsic[1].investmentStats
                      obj.stats.mobility += investmentStats[0].value
                      obj.stats.resilience += investmentStats[2].value
                      obj.stats.recovery += investmentStats[1].value
                    }
                  }
                })

                bottoms.forEach((hash) => {
                  if (hash !== undefined && hash.isEnabled) {
                    const intrinsic = intrinsics.find(item => item[0] === hash.plugHash.toString())
                    if (intrinsic !== undefined) {
                      const investmentStats = intrinsic[1].investmentStats
                      obj.stats.discipline += investmentStats[0].value
                      obj.stats.intellect += investmentStats[1].value
                      obj.stats.strength += investmentStats[2].value
                    }
                  }
                })
              }
            })
          }
          itemArray.push(obj)
          armorArray.push(itemArray)
        })
        dispatch({ type: GET_USER_ARMOR, payload: armorArray })
        history.push("/main")
      })
  }, [authToken, destinyId, dispatch, history, memberType, staticArmor, playerClass, intrinsics])

  return (
    <div>
      Loading User Armor...
    </div>
  )
}

export default GetUserArmor

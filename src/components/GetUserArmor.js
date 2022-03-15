import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { useStore, GET_USER_ARMOR } from '../store/store'
import { getProfile, getItem, getVendors } from '../endpoints'

const GetUserArmor = () => {
  const history = useHistory()
  const dispatch = useStore((state) => state.dispatch)
  const destinyId = localStorage.getItem("DESTINY_ID")
  const memberType = localStorage.getItem("MEMBER_TYPE")
  const authToken = localStorage.getItem("AUTH_TOKEN")
  const staticArmor = useStore((state) => state.staticArmor)
  const intrinsics = useStore((state) => state.intrinsics)
  const playerClass = useStore((state) => state.playerClass)
  const classes = useStore((state) => state.classes)

  useEffect(() => {
    const armorArray = []
    getProfile(destinyId, memberType, authToken)
      .then((res) => {
        // Object.entries(res.Response.characters.data).forEach((hash) => {
        //   console.log(`${hash[0]}: classHash=${hash[1].classHash}`)
        // })
        const masterArray = res.Response.profileInventory.data.items.filter((item) => item.itemInstanceId !== undefined)
        // console.log(masterArray)
        Object.entries(res.Response.characterInventories.data).forEach((character) => {
          character[1].items.forEach((item) => {
            masterArray.push(item)
          })
        })
        // console.log(masterArray)
        Object.entries(res.Response.characterEquipment.data).forEach((character) => {
          character[1].items.forEach((item) => {
            masterArray.push(item)
          })
        })
        // console.log(masterArray)
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
          obj.owned = true
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
              // console.log("counter")
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

        const vendorHashes = ["2190858386", "350061650", "69482069", "248695599", "3603221665", "396892126", "1576276905"]


        function getClassId() {
          switch (playerClass) {
            case "Titan":
              return classes.titan
            case "Hunter":
              return classes.hunter
            case "Warlock":
              return classes.warlock
            default:
              return
          }
        }
        // console.log(classes)
        // console.log(`Member Type: ${memberType}`)
        // console.log(`Destiny ID: ${destinyId}`)
        // console.log(`Class ID: ${getClassId()}`)
        // console.log(`Auth Token: ${authToken}`)
        
        getVendors(memberType, destinyId, getClassId(), authToken)
          .then((res) => {
            // console.log(res.Response)
            const releventVendorSales = Object.entries(res.Response.sales.data).filter((vendor) => {
              if (vendorHashes.includes(vendor[0])) {
                return vendor
              }
              else {
                return false
              }
            })

            const releventVendorStats = Object.entries(res.Response.itemComponents).filter((vendor) => {
              if (vendorHashes.includes(vendor[0])) {
                return vendor
              }
              else {
                return false
              }
            })

            // console.log(staticArmor)
            // console.log(Object.values(releventVendorStats[0][1].stats)[0])

            releventVendorSales.forEach((vendor) => {
              const saleItems = Object.values(vendor[1].saleItems)
              // console.log(saleItems)
              saleItems.forEach((item) => {
                const staticPiece = staticArmor.find((staticItem) => staticItem[0] === item.itemHash.toString())
                const vendorStats = releventVendorStats.find((vendorToFind) => vendorToFind[0] === vendor[0])
                if (staticPiece !== undefined && vendorStats !== undefined) {
                  const vendorItemIndex = item.vendorItemIndex
                  const statsPath = vendorStats[1].stats.data[vendorItemIndex].stats
                  const armorObject = {}
                  const itemArray = [item.itemHash]
                  armorObject.itemType = "Armor"
                  armorObject.owned = false
                  armorObject.powerLevel = 1100
                  armorObject.vendorItemIndex = vendorItemIndex
                  armorObject.vendorHash = vendor[0]
                  armorObject.stats = {}
                  armorObject.stats.mobility = statsPath[2996146975].value
                  armorObject.stats.resilience = statsPath[392767087].value
                  armorObject.stats.recovery = statsPath[1943323491].value
                  armorObject.stats.discipline = statsPath[1735777505].value
                  armorObject.stats.intellect = statsPath[144602215].value
                  armorObject.stats.strength = statsPath[4244567218].value

                  switch (vendor[0]) {
                    case "69482069":
                      armorObject.vendor = "Zavala"
                      break;
                    case "248695599":
                      armorObject.vendor = "Drifter"
                      break;
                    case "350061650":
                      armorObject.vendor = "Ada-1"
                      break;
                    case "3603221665":
                      armorObject.vendor = "Shaxx"
                      break;
                    case "396892126":
                      armorObject.vendor = "Devrim"
                      break;
                    case "1576276905":
                      armorObject.vendor = "Failsafe"
                      break;
                    case "2190858386":
                      armorObject.vendor = "Xur"
                      break;
                    default:
                      return
                  }

                  const staticStatsPath = staticPiece[1].stats.stats

                  if (staticStatsPath[2996146975]) {
                    armorObject.stats.mobility += staticStatsPath[2996146975].value
                  }
                  if (staticStatsPath[392767087]) {
                    armorObject.stats.resilience += staticStatsPath[392767087].value
                  }
                  if (staticStatsPath[1943323491]) {
                    armorObject.stats.recovery += staticStatsPath[1943323491].value
                  }

                  armorObject.name = staticPiece[1].displayProperties.name
                  armorObject.itemSubType = staticPiece[1].itemTypeDisplayName
                  armorObject.itemTier = staticPiece[1].inventory.tierTypeName
                  armorObject.icon = staticPiece[1].displayProperties.icon
                  armorObject.categoryHash = staticPiece[1].itemCategoryHashes[1]


                  switch (staticPiece[1].classType) {
                    case 0:
                      armorObject.equippableBy = "Titan"
                      break;
                    case 1:
                      armorObject.equippableBy = "Hunter"
                      break;
                    case 2:
                      armorObject.equippableBy = "Warlock"
                      break;
                    default:
                      return
                  }


                  if (armorObject.name !== undefined) {

                    itemArray.push(armorObject)
                    armorArray.push(itemArray)
                  }

                }
              })
            })
          })
        // console.log(armorArray)
        dispatch({ type: GET_USER_ARMOR, payload: armorArray })
        history.push("/main")
      })
  }, [authToken, destinyId, dispatch, history, memberType, staticArmor, playerClass, intrinsics, classes])

  return (
    <div>
      Loading User Armor...
    </div>
  )
}

export default GetUserArmor

import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { useStore, GET_VENDOR_ARMOR } from '../store/store'
import { getVendors } from '../endpoints'

const GetVendorArmor = () => {
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
    const vendorHashes = ["2190858386", "350061650", "69482069", "248695599", "3603221665", "396892126", "1576276905"]
    getVendors(memberType, destinyId, "2305843009261410595", authToken)
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
        console.log(releventVendorStats)

        releventVendorSales.forEach((vendor) => {
          const saleItems = Object.values(vendor[1].saleItems)
          // console.log(saleItems)
          saleItems.forEach((item) => {
            // console.log(item.itemHash)
            const armorObject = {}
            const itemArray = [item.itemHash]
            armorObject.itemType = "Armor"
            armorObject.owned = false
            armorObject.stats = {}
            armorObject.stats.mobility = 0
            armorObject.stats.resilience = 0
            armorObject.stats.recovery = 0
            armorObject.stats.discipline = 0
            armorObject.stats.intellect = 0
            armorObject.stats.strength = 0
            armorObject.powerLevel = 1100
            armorObject.vendorItemIndex = item.vendorItemIndex
            armorObject.vendorHash = vendor[0]

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

            staticArmor.forEach((staticItem) => {
              if ((item.itemHash.toString()) === staticItem[0]) {
                armorObject.name = staticItem[1].displayProperties.name
                armorObject.itemSubType = staticItem[1].itemTypeDisplayName
                armorObject.itemTier = staticItem[1].inventory.tierTypeName
                armorObject.icon = staticItem[1].displayProperties.icon
                armorObject.categoryHash = staticItem[1].itemCategoryHashes[1]

                const statsPath = staticItem[1].stats.stats
                if (statsPath[2996146975]) {
                  armorObject.stats.mobility += statsPath[2996146975].value
                }
                if (statsPath[392767087]) {
                  armorObject.stats.resilience += statsPath[392767087].value
                }
                if (statsPath[1943323491]) {
                  armorObject.stats.recovery += statsPath[1943323491].value
                }

                switch (staticItem[1].classType) {
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

                // console.log(vendor[0])
                // console.log(item)
                // console.log(staticItem[1])
              }
            })
            releventVendorStats.forEach((hash) => {
              const statItems = Object.values(hash[1].stats)
              const vendorItemIndex = armorObject.vendorItemIndex
              const statsPath = statItems[0][vendorItemIndex]
              if (statsPath !== undefined) {
                // console.log(statsPath.stats)
                if (statsPath.stats[2996146975] !== undefined && statsPath.stats[2996146975].value !== undefined) {
                  armorObject.stats.mobility += statsPath.stats[2996146975].value
                  armorObject.stats.resilience += statsPath.stats[392767087].value
                  armorObject.stats.recovery += statsPath.stats[1943323491].value
                  armorObject.stats.discipline += statsPath.stats[1735777505].value
                  armorObject.stats.intellect += statsPath.stats[144602215].value
                  armorObject.stats.strength += statsPath.stats[4244567218].value
                }
              }
            })
            if (armorObject.name !== undefined) {
              // console.log(armorObject)
              itemArray.push(armorObject)
              armorArray.push(itemArray)
            }
          })
        })
        dispatch({ type: GET_VENDOR_ARMOR, payload: armorArray })
        console.log(armorArray)
        history.push("/main")
      })
  }, [authToken, destinyId, dispatch, history, memberType, staticArmor, playerClass, intrinsics])

  return (
    <div>
      Loading Vendor Armor...
    </div>
  )
}

export default GetVendorArmor

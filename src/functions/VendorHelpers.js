import { getStaticItems, getAdvancedArmorInfo } from "./ArmorHelpers"
const apiKey = process.env.REACT_APP_API_KEY
const basePlatformURL = "https://www.bungie.net/Platform/"

async function getVendors(membershipType, destinyId, characterId, accessToken) {
  //Define the request path:
  const requestPath = `${basePlatformURL}Destiny2/${membershipType}/Profile/${destinyId}/Character/${characterId}/Vendors/?components=402,304`
  //Make the request to the api:
  const request = await fetch(requestPath, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + accessToken
    },
  })
  //Convert the response to JSON:
  const response = await request.json()
  //Shorten the response path:
  const info = response.Response
  //Define an array with the relevent vendor's hashes. Used for filtering later:
  const vendorHashes = ["2190858386", "350061650", "69482069", "248695599", "3603221665", "396892126", "1576276905"]
  //Get the sales of the relevent vendors (vendors that sell armor):
  const releventVendorSales = Object.entries(info.sales.data)
    .filter(vendor => vendorHashes.includes(vendor[0]))
  //Get the stats of the items that the relevent vendors sell:
  const releventVendorStats = Object.entries(info.itemComponents)
    .filter(vendor => vendorHashes.includes(vendor[0]))
  //Return the vendor sales and vendor stats:
  return { vendorSales: releventVendorSales, vendorStats: releventVendorStats }
}

function assignCorrectVendor(vendor, armorObject) {
  switch (vendor[0]) {
    case "69482069":
      armorObject.vendor = "Zavala"
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
}

function getBasicVendorArmorInfo(item, vendor, currentStatic, vendorStats, armorObject) {
  const currentStats = vendorStats.find(currentVendor => currentVendor[0] === vendor[0])
  if (currentStatic !== undefined && currentStats !== undefined) {
    const vendorItemIndex = item.vendorItemIndex
    const statsPath = currentStats[1].stats.data[vendorItemIndex].stats
    armorObject.itemType = "Armor"
    armorObject.owned = false
    armorObject.powerLevel = 1350
    armorObject.vendorItemIndex = vendorItemIndex
    armorObject.vendorHash = vendor[0]
    armorObject.ornament = false
    assignCorrectVendor(vendor, armorObject)
    armorObject.baseStats = {
      mobility: statsPath[2996146975].value,
      resilience: statsPath[392767087].value,
      recovery: statsPath[1943323491].value,
      discipline: statsPath[1735777505].value,
      intellect: statsPath[144602215].value,
      strength: statsPath[4244567218].value
    }
  }
}

export async function getVendorArmor(membershipType, destinyId, characterIds, accessToken) {
  const staticItems = await getStaticItems()
  const staticArmor = staticItems.staticArmor

  const vendorArray = []
  for (const characterId of characterIds) {
    const vendors = await getVendors(membershipType, destinyId, characterId, accessToken)
    const vendorSales = vendors.vendorSales
    const vendorStats = vendors.vendorStats

    vendorSales.forEach(vendor => {
      const saleItems = Object.values(vendor[1].saleItems)
      saleItems.forEach(item => {
        const currentStatic = staticArmor.find(staticArmor => staticArmor[0] === item.itemHash.toString())
        if (currentStatic === undefined) {
          return false
        }
        if (currentStatic[1].inventory.tierTypeName === "Exotic"
          &&
          vendorArray.some(item => item.name === currentStatic[1].displayProperties.name)) {
          return false
        }
        const armorObject = {}
        getBasicVendorArmorInfo(item, vendor, currentStatic, vendorStats, armorObject)
        getAdvancedArmorInfo(currentStatic, armorObject)
        vendorArray.push(armorObject)
      })
    })
  }
  return vendorArray
}
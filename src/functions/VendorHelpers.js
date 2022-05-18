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
  //Check the request status:
  if (request.status !== 200) {
    return false
  }
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
  //Switch on the vendor hash:
  switch (vendor[0]) {
    //Zavala case:
    case "69482069":
      armorObject.vendor = "Zavala"
      break;
    //Ada-1 case:
    case "350061650":
      armorObject.vendor = "Ada-1"
      break;
    //Shaxx case:
    case "3603221665":
      armorObject.vendor = "Shaxx"
      break;
    //Devrim case:
    case "396892126":
      armorObject.vendor = "Devrim"
      break;
    //Failsafe case:
    case "1576276905":
      armorObject.vendor = "Failsafe"
      break;
    //Xur case:
    case "2190858386":
      armorObject.vendor = "Xur"
      break;
    default:
      return
  }
}

function getBasicVendorArmorInfo(item, vendor, currentStatic, vendorStats, armorObject) {
  //Get the stats for the current armor piece:
  const currentStats = vendorStats.find(currentVendor => currentVendor[0] === vendor[0])
  //Check to see if the static item or the current stats are defined:
  if (currentStatic !== undefined && currentStats !== undefined) {
    //Find the correct vendor for the item:
    assignCorrectVendor(vendor, armorObject)
    //Get the vendor item index: (note: there isn't a current use for this, but I figured I'd grab it for now)
    const vendorItemIndex = item.vendorItemIndex
    //Shorten the path to the item's stats:
    const statsPath = currentStats[1].stats.data[vendorItemIndex].stats
    //Set the item type:
    armorObject.itemType = "Armor"
    //Set owned as false, for filtering purposes later:
    armorObject.owned = false
    //Set the vendor item index:
    armorObject.vendorItemIndex = vendorItemIndex
    //Set the vendor hash:
    armorObject.vendorHash = vendor[0]
    //Set the item's ornament as false:
    armorObject.ornament = false
    //Set the base stats using the statsPath:
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
  //Get the static items:
  const staticItems = await getStaticItems()
  //If static items is false return false and exit the function:
  if (!staticItems) {
    return false
  }
  //Get the static armor
  const staticArmor = staticItems.staticArmor
  const staticHashes = staticArmor.map(item => item[0])
  //Define the number of characters on the users account:
  const numberOfCharacters = characterIds.length
  //Define the vendor array. This is where we'll push the vendor items.
  const vendorArray = []
  //Define n as zero. This is used to see if the while loop runs the right amount of times:
  let n = 0
  //While n is less then the number of characters on the account:
  while (n < numberOfCharacters) {
    //Get the vendors for the current character:
    const vendors = await getVendors(membershipType, destinyId, characterIds[n], accessToken)
    //If vendors returns false, break out of the while loop:
    if (!vendors) {
      break;
    }
    //Define the vendor sales:
    const vendorSales = vendors.vendorSales
    //Define the vendor stats:
    const vendorStats = vendors.vendorStats
    //For each vendor:
    vendorSales.forEach(vendor => {
      //Get the vendors items for sale:
      const saleItems = Object.values(vendor[1].saleItems)
      //Filter out non-armor items:
      .filter(item => staticHashes.includes(item.itemHash.toString()))
      //If the sale items array is empty return false return to the beginning of the loop:
      if (saleItems.length === 0) {
        return false
      }
      //For each sale item:
      saleItems.forEach(item => {
        //Find the matching static armor information:
        const currentStatic = staticArmor.find(staticArmor => staticArmor[0] === item.itemHash.toString())
        //If the matching static piece can't be found return false to return to the beginning of the loop:
        if (currentStatic === undefined) {
          return false
        }
        //If the armor piece is exotic:
        if (currentStatic[1].inventory.tierTypeName === "Exotic"
        &&
        //AND if the vendor array already includes that exotic:
        vendorArray.some(item => item.name === currentStatic[1].displayProperties.name)) {
          //Return false to return to the beginning of the loop:
          return false
        }
        //Create an object that will hold all of the info for each armor piece:
        const armorObject = {}
        //Define the item's item hash:
        armorObject.itemHash = item.itemHash
        //Get the basic armor information:
        getBasicVendorArmorInfo(item, vendor, currentStatic, vendorStats, armorObject)
        //If the armor piece doesn't belong to a vendor return false to return to the beginning of the loop:
        if (armorObject.vendor === undefined) {
          return false
        }
        //Get more advanced armor info:
        getAdvancedArmorInfo(currentStatic, armorObject)
        //Set the power level: 
        //currently all legendary vendor armor is 1350 power, likely will only change after major expansions
        if (armorObject.itemTier === "Legendary") {
          armorObject.powerLevel = 1350
        }
        else {
          //Xur's vendor exotics are currently capped at 1550
          armorObject.powerLevel = 1550
        }
        //Push the armor object to the vendor array:
        vendorArray.push(armorObject)
      })
    })
    //Increment n by one:
    n++
  }
  //If n doesn't equal the number of characters then one of our getVendor calls failed.
  if (n !== numberOfCharacters) {
    //Return false to handle the error in PopulateVendor:
    return false
  }
  //If n equals the number of characters then return the full vendor array:
  else {
    return vendorArray
  }
}
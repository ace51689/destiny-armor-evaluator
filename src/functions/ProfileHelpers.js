//Define the api key:
const apiKey = process.env.REACT_APP_API_KEY
//Define the client id:
const clientId = process.env.REACT_APP_CLIENT_ID
//Define the requests base url:
const baseURL = "https://www.bungie.net/Platform/"

//Function that gets an access token and user's bungie id:
async function getAccessToken(code) {
  //Define the request URL:
  const requestPath = `${baseURL}app/oauth/token/`
  //Make the request to the api:
  const request = await fetch(requestPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${clientId}&grant_type=authorization_code&code=${code}`
  })
  //Check the request status
  if (request.status !== 200) {
    //If the request fails return false
    return false
  }
  //Convert the response to JSON:
  const response = await request.json()
  //Define the access token
  const accessToken = response.access_token
  //Define the user's bungie membership id:
  const bungieId = response.membership_id
  //Return the user's access token and bungie membership id:
  return { accessToken: accessToken, bungieId: bungieId }
}


//Function that gets the users destiny id and membership type (platform; i.e. PSN, Steam, etc.):
async function getDestinyId(bungieId) {
  //Define the request URL:
  const requestPath = `${baseURL}Destiny2/-1/Profile/${bungieId}/LinkedProfiles/?getAllMemberships=true`
  //Make the request to the api:
  const request = await fetch(requestPath, {
    method: "GET",
    headers: { "x-api-key": apiKey }
  })
  //Check the request status:
  if (request.status !== 200) {
    //If the request fails return false:
    return false
  }
  //Convert the response to JSON:
  const response = await request.json()
  //Define the user's destiny id:
  const destinyId = response.Response.profiles[0].membershipId
  //Define the user's membership type:
  const membershipType = response.Response.profiles[0].membershipType
  //Return the user's destiny id and membership type:
  return { destinyId: destinyId, membershipType: membershipType }
}

//Helper function that assesses user's character information:
function assessCharacterInformation(characters) {
  //Convert the data to an array of objects:
  const characterInformation = Object.values(characters)
  //Define arrays to store character information:
  const characterIds = []
  const characterClasses = []
  //Key to help define a character's class:
  const classHashKey = {
    3655393761: "Titan",
    671679327: "Hunter",
    2271682572: "Warlock"
  }
  //For each user character, get the class name and character id:
  characterInformation.forEach(character => {
    characterIds.push(character.characterId)
    characterClasses.push(classHashKey[character.classHash])
  })
  //Return the character class types and character ids:
  return { characterClasses: characterClasses, characterIds: characterIds }
}

//Function to get user's character information from the api:
async function getCharacterInformation(membershipType, destinyId, token) {
  //Define the request URL:
  const requestPath = `${baseURL}Destiny2/${membershipType}/Profile/${destinyId}/?components=200`
  //Make the request to the api:
  const request = await fetch(requestPath, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + token
    }
  })
  //Check the request status:
  if (request.status !== 200) {
    //If the request fails return false:
    return false
  }
  //Convert the response to JSON:
  const response = await request.json()
  //Define the user's character data:
  const characters = response.Response.characters.data
  //Call the assessCharacterInformation function to handle the data:
  const characterInformation = assessCharacterInformation(characters)
  //Return the processed character information:
  return characterInformation
}

//Master function that handles returning all of the important user information:
export async function getUserInformation(code) {
  //Get the access token and bungie id:
  const accessToken = await getAccessToken(code)
  //Check to see if getAccessToken returned false:
  if (!accessToken) {
    //If so, return false:
    return false
  }
  //Get the destiny id and membership type:
  const destinyId = await getDestinyId(accessToken.bungieId)
  //Check to see if getDestinyId returned false:
  if (!destinyId) {
    //If so, return false:
    return false
  }
  //Get the character information:
  const characterInformation = await getCharacterInformation(destinyId.membershipType, destinyId.destinyId, accessToken.accessToken)
  //Check to see if getCharacterInformation returned false:
  if (!characterInformation) {
    //If so, return false:
    return false
  }
  //Return all of the important user information:
  return { accessToken: accessToken, destinyId: destinyId, characterInformation: characterInformation }
}

export async function refreshUserInformation(membershipType, destinyId, accessToken) {
  //Get the character information:
  const characterInformation = await getCharacterInformation(membershipType, destinyId, accessToken)
  //Check to see if getCharacterInformation returned false:
  if (!characterInformation) {
    //If so, return false:
    return false
  }
  //Return all of the important user information:
  return { destinyId: destinyId, characterInformation: characterInformation }
}
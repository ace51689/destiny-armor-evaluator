// require('dotenv').config();
const apiKey = "3df5d6e267084bd0b2d0257b2b80215a"
const baseURL = "https://www.bungie.net/"
const basePlatformURL = "https://www.bungie.net/Platform/"

export async function getManifest() {
  return await fetch(basePlatformURL + "Destiny2/Manifest", {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    },
  }).then((res) => res.json())
}

export async function getCurrentManifest(currentManifest) {
  return await fetch(baseURL + currentManifest, {
    method: "GET",
  }).then((res) => res.json())
}

export async function getAuthToken(code) {
  return await fetch(basePlatformURL + "app/oauth/token/", {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=36791&grant_type=authorization_code&${code}`
  }).then((res) => res.json())
}

export async function getLinkedProfiles(membershipId) {
  // console.log(process.env)
  return await fetch(basePlatformURL + "Destiny2/-1/Profile/" + membershipId + "/LinkedProfiles/?getAllMemberships=true", {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    },
  }).then((res) => res.json())
}

export async function getProfile(destinyMemberId, memberType, token) {
  return await fetch(basePlatformURL + "Destiny2/" + memberType + "/Profile/" + destinyMemberId + "/?components=100,102,200,201,205,300", {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + token
    },
  }).then((res) => res.json())
}

export async function getItem(destinyMemberId, memberType, itemInstanceId) {
  return await fetch(basePlatformURL + "Destiny2/" + memberType + "/Profile/" + destinyMemberId + "/Item/" + itemInstanceId + "/?components=304,305", {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      // Authorization: "Bearer " + token
    },
  }).then((res) => res.json())
}

export async function getVendors(memberType, destinyMemberId, characterId, token) {
  return await fetch(basePlatformURL + "Destiny2/" + memberType + "/Profile/" + destinyMemberId + "/Character/" + characterId + "/Vendors/?components=402,304", {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + token
    },
  }).then((res) => res.json())
}
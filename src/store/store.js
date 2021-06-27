import create from "zustand"
import { devtools, redux } from "zustand/middleware"

const initialState = { staticArmor: [], userArmor: [], titan: false, hunter: false, warlock: false}

export const GET_ARMOR = "GETARMOR"
export const GET_USER_ARMOR = "GETUSERARMOR"
export const IS_TITAN = "ISTITAN"
export const IS_HUNTER = "ISHUNTER"
export const IS_WARLOCK = "ISWARLOCK"

const reducer = (state, action) => {
  switch (action.type) {
    case GET_ARMOR:
      return { staticArmor: action.payload }
    case GET_USER_ARMOR:
      return { userArmor: action.payload }
    case IS_TITAN:
      return { titan: action.payload } 
    case IS_HUNTER:
      return { hunter: action.payload } 
    case IS_WARLOCK:
      return { warlock: action.payload } 
    default:
      return state
  }
}

export const useStore = create(devtools(redux(reducer, initialState)))
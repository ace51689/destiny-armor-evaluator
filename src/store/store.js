import create from "zustand"
import { devtools, redux } from "zustand/middleware"

const initialState = { classes: {}, staticArmor: [], userArmor: [], vendorArmor: [], intrinsics: [], playerClass: "" }

export const GET_CLASSES = "GETCLASSES"
export const GET_ARMOR = "GETARMOR"
export const GET_USER_ARMOR = "GETUSERARMOR"
export const GET_VENDOR_ARMOR = "GETVENDORARMOR"
export const GET_INTRINSICS = "GETINTRINSICS"
export const CHANGE_CLASS = "CHANGECLASS"

const reducer = (state, action) => {
  switch (action.type) {
    case GET_CLASSES:
      return { classes: action.payload }
    case GET_ARMOR:
      return { staticArmor: action.payload }
    case GET_USER_ARMOR:
      return { userArmor: action.payload }
    case GET_VENDOR_ARMOR:
      return { vendorArmor: action.payload }
    case GET_INTRINSICS:
      return { intrinsics: action.payload }
    case CHANGE_CLASS:
      return { playerClass: action.payload }
    default:
      return state
  }
}

export const useStore = create(devtools(redux(reducer, initialState)))
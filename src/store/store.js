import create from "zustand"
import { persist, devtools, redux } from "zustand/middleware"

const initialState = { characterClasses: [], userArmor: [], vendorArmor: [], error: {}, showClassButtons: false, }

export const GET_CHAR_INFO = "GETCHARINFO"
export const GET_ARMOR = "GETARMOR"
export const GET_USER_ARMOR = "GETUSERARMOR"
export const GET_VENDOR_ARMOR = "GETVENDORARMOR"
export const GET_INTRINSICS = "GETINTRINSICS"
export const SET_ERROR = "SETERROR"
export const SET_SHOW_CLASS_BUTTONS = "SETSHOWCLASSBUTTONS"

const reducer = (state, action) => {
  switch (action.type) {
    case GET_CHAR_INFO:
      return { characterClasses: action.payload }
    case GET_ARMOR:
      return { staticArmor: action.payload }
    case GET_USER_ARMOR:
      return { userArmor: action.payload }
    case GET_VENDOR_ARMOR:
      return { vendorArmor: action.payload }
    case GET_INTRINSICS:
      return { intrinsics: action.payload }
    case SET_ERROR:
      return { error: action.payload }
    case SET_SHOW_CLASS_BUTTONS:
      return { showClassButtons: action.payload }
    default:
      return state
  }
}

export const useStore = create(persist(devtools(redux(reducer, initialState))))
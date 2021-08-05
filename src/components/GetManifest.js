import { useEffect } from 'react'
import { GET_ARMOR, GET_INTRINSICS, useStore } from '../store/store'
import { getManifest, getCurrentManifest } from '../endpoints'

const GetManifest = (props) => {
  const dispatch = useStore((state) => state.dispatch)
  // const manifestArmor = useStore((state) => state.armor)
  
  useEffect(() => {
    let mounted = true
    
    const gettingTheManifest = async () => {
      const manifest = await getManifest()
      const current = await getCurrentManifest(manifest.Response.jsonWorldContentPaths.en)

      const armor = Object.entries(current.DestinyInventoryItemDefinition).filter((item) => {
        if (item[1].itemType === 2) {
          return item
        }
        return false
      }).filter((item) => {
        if (item[1].inventory.tierType > 4) {
          return item
        }
        return false
      })
      // .filter((item) => {
        //Where we can change the class for the manifest armor 0 - Titan; 1 - Hunter; 2: Warlock
        // if (item[1].classType === 0) {
        //   return item
        // }
        // return false
      // })

      const intrinsics = Object.entries(current.DestinyInventoryItemDefinition).filter((item) => {
        if (item[1].plug) {
          return item
        }
        return false
      }).filter((item) => {
        if (item[1].plug.plugCategoryIdentifier === "intrinsics") {
          return item
        }
        return false
      })

      console.log(intrinsics)

      await dispatch({ type: GET_ARMOR, payload: armor})

      await dispatch({ type: GET_INTRINSICS, payload: intrinsics})
    }
    
    if (mounted) {
      gettingTheManifest()
    }
    
    return () => {
      mounted = false
    }
    
  }, [dispatch])
  
  return null
}

export default GetManifest

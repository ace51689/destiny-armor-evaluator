import { useEffect } from 'react'
import { useStore } from '../store/store'
import { getManifest, getCurrentManifest } from '../endpoints'
import { GET_ARMOR } from "../store/store"

const GetManifest = (props) => {
  const dispatch = useStore((state) => state.dispatch)
  
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

      await dispatch({ type: GET_ARMOR, payload: armor})
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

import { Model } from "@/types"
import { getAllModels } from "@/utils/api"
import { useEffect, useState } from "react"


const useAllModels = () => {

  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    const handleGetAllModels = async () => {
      const allModels = await getAllModels()
      setModels(allModels || [])
      setLoading(false)
    }

    handleGetAllModels()
  }, [])

  return {models, loading}
}

export default useAllModels
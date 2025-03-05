import { Model } from '@/types'
import RouteDocs from './RouteDocs'

interface Props {
  model: Model
}

const ModelDocumentation = ({ model }: Props) => {

  const { name, modelId } = model

  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL + 'api/collections/' || 'http://host/' + 'api/collections/'

  return (
    <div className='space-y-4 w-full mb-16 ml-2'>
      <div className='mt-4'>
        <h4 className='scroll-m-20 text-xl font-semibold tracking-tight ml-2'>{name}</h4>
        <ul>
          <RouteDocs method='POST' url={`${apiUrl}${modelId}`} />
          <RouteDocs method='GET' url={`${apiUrl}${modelId}`} />
          <RouteDocs method='GET' url={`${apiUrl}${modelId}/[row_id]`} />
          <RouteDocs method='PUT' url={`${apiUrl}${modelId}/[row_id]`} />
          <RouteDocs method='DELETE' url={`${apiUrl}${modelId}/[row_id]`} />
        </ul>
      </div>

    </div>
  )
}

export default ModelDocumentation
import { getPillColour } from '@/utils'
import React from 'react'

type Props = {
  method: string
  url: string
}

const RouteDocs = ({ method, url}: Props) => {

  const methodColour = getPillColour(method)

  return (
    <li className='flex gap-4 mt-4 ml-2'>
      <span className={`rounded-full w-16 flex justify-center px-2 py-1 text-white text-sm ${methodColour}`}>{method}</span> <span>{url}</span>
    </li>
  )
}

export default RouteDocs
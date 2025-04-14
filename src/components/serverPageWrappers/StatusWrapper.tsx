'use client'
import { StatusFromAPI } from '@/types'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import ApiResponseTable from '../generic/ApiResponseTable'
import { getResponseStatus } from '@/utils/api'

interface Props {
  statusArray: StatusFromAPI[]
}

const StatusWrapper = ({ statusArray }: Props) => {

  const [responses, setResponses] = useState<StatusFromAPI[] | undefined>(statusArray)

	const handleApi = async () =>{
		setResponses(await getResponseStatus())
	}

	useEffect(() => {
		handleApi()
	}, [])

  return (
    <>
      <Button className='mt-3' onClick={handleApi}>Refresh Logs</Button>
      {responses && <ApiResponseTable responses={responses} />}
    </>
  )
}

export default StatusWrapper
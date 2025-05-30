'use client'
import React, { useState } from 'react'
import Title from '../generic/Title'
import AddSingle from '../singles/AddSingle'
import UpdateSingle from '../singles/UpdateSingle'
import DeleteSingle from '../singles/DeleteSingle'
import SinglesResponseTable from '../singles/SinglesResponseTable'
import { Item } from '@/types'

interface Props{
  apiSingles: Item[] | undefined
}

const SinglesWrapper = ({apiSingles}: Props) => {
  const [singles, setSingles] = useState<Item[]>(apiSingles || [])
	const [selectedSingle, setSelectedSingle] = useState<Item | undefined>()

  return (
    <div className='p-4 ml-20 w-full'>
      <div className='flex items-center justify-between'>
        <Title firstPartOfTitle='Collections' secondPartOfTitle='Singles' />
        <div className='flex items-center gap-2'>
          <AddSingle setSingles={setSingles} />
          {selectedSingle && <UpdateSingle selectedSingle={selectedSingle} setSelectedSingle={setSelectedSingle} setSingles={setSingles} />}
          {selectedSingle?.id && <DeleteSingle setSelectedSingle={setSelectedSingle} setSingles={setSingles} singleId={selectedSingle.id} /> }
        </div>
      </div>
      {singles && <SinglesResponseTable singles={singles} setSelectedSingle={setSelectedSingle}  />}
    </div>
  )
}

export default SinglesWrapper
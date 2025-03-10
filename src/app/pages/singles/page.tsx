'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import AddSingle from '@/components/singles/AddSingle'
import Sidebar from '@/components/generic/Sidebar'
import SinglesResponseTable from '@/components/singles/SinglesResponseTable'
import Title from '@/components/generic/Title'
import { Item } from '@/types'
import { getAllSingles } from '@/utils'
import { useEffect, useState } from 'react'
import UpdateSingle from '@/components/singles/UpdateSingle'

export default function Status() {
	useAuthentication()
	const [singles, setSingles] = useState<Item[] | undefined>([])
	const [refresh, setRefresh] = useState<boolean>(false)
	const [selectedRow, setSelectedRow] = useState<Item | undefined>()


	useEffect(() => {
		const handleGetSingles = async () => {
			setSingles(await getAllSingles())
		}

    if (!refresh) setRefresh(true)

		handleGetSingles()
	}, [])

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 ml-20 w-full'>
				<div className='flex items-center justify-between'>
					<Title firstPartOfTitle='Collections' secondPartOfTitle='Singles' />
					<div className='flex items-center gap-2'>
						<AddSingle setRefresh={setRefresh} />
						{selectedRow && <UpdateSingle selectedRow={selectedRow} setRefresh={setRefresh} />}
					</div>
				</div>
				{singles && <SinglesResponseTable singles={singles} setSelectedRow={setSelectedRow}  />}
			</div>
		</div>
	)
}
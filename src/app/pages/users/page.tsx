'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import CollectionTable from '@/components/collections/CollectionTable'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import UserResponseTable from '@/components/generic/UsersResponseTable'
import { Item, User } from '@/types'
import { getAllSingles, getAllUsers } from '@/utils'
import { useEffect, useState } from 'react'

export default function Status() {
	useAuthentication()

	const [users, setUsers] = useState<User[] | undefined>([])
	// fix use of items type
	const [singles, setSingles] = useState<Item[] | undefined>([])

	useEffect(() => {
		const handleFetchUsers = async () =>{
			setUsers(await getAllUsers())
		}

		const handleGetSingles = async () => {
			setSingles(await getAllSingles())
		}

		handleFetchUsers()
		handleGetSingles()
	}, [])

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 ml-20 w-96'>
				<Title firstPartOfTitle='Collections' secondPartOfTitle='Users' />
				{users && <UserResponseTable users={users}  />}
			</div>
		</div>
	)
}
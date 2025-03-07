'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import UserResponseTable from '@/components/generic/UsersResponseTable'
import { User } from '@/types'
import { getAllUsers } from '@/utils'
import { useEffect, useState } from 'react'

export default function Status() {
	useAuthentication()

	const [users, setUsers] = useState<User[] | undefined>([])

	useEffect(() => {
		const handleFetUsers = async () =>{
			setUsers(await getAllUsers())
		}

		handleFetUsers()
	}, [])

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 ml-20'>
				<Title firstPartOfTitle='Collections' secondPartOfTitle='Users' />
				{users && <UserResponseTable users={users}  />}
			</div>
		</div>
	)
}
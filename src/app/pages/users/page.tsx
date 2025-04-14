import Sidebar from '@/components/generic/Sidebar'
import UsersWrapper from '@/components/serverPageWrappers/UsersWrapper'
import { getAllUsers } from '@/utils/api'

export default async function Status() {
	const apiUsers = await getAllUsers()

	return (
		<div className='flex'>
			<Sidebar />
			<UsersWrapper apiUsers={apiUsers} />
		</div>
	)
}
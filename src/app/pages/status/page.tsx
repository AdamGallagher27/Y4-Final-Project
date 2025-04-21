import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import StatusWrapper from '@/components/serverPageWrappers/StatusWrapper'
import { getResponseStatus } from '@/utils/api'

export default async  function Status() {

	const statusArray = await getResponseStatus()

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 ml-20'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Logs' />
				<StatusWrapper statusArray={statusArray} />
			</div>
		</div>
	)
}
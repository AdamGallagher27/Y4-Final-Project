import Sidebar from '@/components/generic/Sidebar'
import { getAllSingles } from '@/utils/api'
import SinglesWrapper from '@/components/serverPageWrappers/SinglesWrapper'

export default async function Status() {
	const apiSingles = await getAllSingles()

	return (
		<div className='flex'>
			<Sidebar />
			<SinglesWrapper apiSingles={apiSingles}/>
		</div>
	)
}
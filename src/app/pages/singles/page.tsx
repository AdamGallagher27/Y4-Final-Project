import Sidebar from '@/components/generic/Sidebar'
import { getAllSingles } from '@/utils/api'
import SinglesWrapper from '@/components/serverPageWrappers/SinglesWrapper'
import { transformBoolToStringValue } from '@/utils'

export default async function Status() {
	const apiSingles = await getAllSingles()

	return (
		<div className='flex'>
			<Sidebar />
			<SinglesWrapper apiSingles={transformBoolToStringValue(apiSingles || [])}/>
		</div>
	)
}
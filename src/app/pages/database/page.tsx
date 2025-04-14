import Sidebar from '@/components/generic/Sidebar'
import models from '../../../../public/models.json'
import DatabaseWrapper from '@/components/serverPageWrappers/DatabaseWrapper'

export default async function Database() {
	return (
		<div className='flex'>
			<Sidebar />
			<DatabaseWrapper models={models} />
		</div>
	)
}
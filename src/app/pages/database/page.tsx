import Sidebar from '@/components/generic/Sidebar'
import DatabaseWrapper from '@/components/serverPageWrappers/DatabaseWrapper'

export default function Database() {
	return (
		<div className='flex'>
			<Sidebar />
			<DatabaseWrapper />
		</div>
	)
}
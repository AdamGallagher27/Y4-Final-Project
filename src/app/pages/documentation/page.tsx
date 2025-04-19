import DocumentationWrapper from '@/components/serverPageWrappers/DocumentationWrapper'
import Sidebar from '@/components/generic/Sidebar'

export default function Documentation() {
	return (
		<div className='flex'>
			<Sidebar />
			<DocumentationWrapper />
		</div >
	)
}
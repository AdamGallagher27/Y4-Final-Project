import DocumentationWrapper from '@/components/serverPageWrappers/DocumentationWrapper'
import models from '../../../../public/models.json'
import Sidebar from '@/components/generic/Sidebar'

export default function Documentation() {
	return (
		<div className='flex'>
			<Sidebar />
			<DocumentationWrapper models={models} />
		</div >
	)
}
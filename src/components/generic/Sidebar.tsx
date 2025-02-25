'use client'

import { User, Database, Code2, Activity } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const Sidebar = () => {

	const pathName = usePathname()
	const router = useRouter()

	return (
		<div className='h-screen w-20 flex flex-col items-center bg-[#F8FAFC] border-r border-[#E2E8F0] text-white py-4 space-y-5'>
			<button onClick={() => router.push('/database')} className='p-2 rounded-lg'>
				<Database className={`w-6 h-6 ${pathName === '/database' ? 'text-black' : 'text-[#94A3B8]'}`} />
			</button>

			<button onClick={() => router.push('/documentation')} className='p-2 rounded-lg'>
				<Code2 className={`w-6 h-6 ${pathName === '/documentation' ? 'text-black' : 'text-[#94A3B8]'}`} />
			</button>

			<button onClick={() => router.push('/status')} className='p-2 rounded-lg'>
				<Activity className={`w-6 h-6 ${pathName === '/status' ? 'text-black' : 'text-[#94A3B8]'}`} />
			</button>

			<button onClick={() => router.push('/profile')} className='p-2 rounded-lg'>
				<User className={`w-6 h-6 ${pathName === '/profile' ? 'text-black' : 'text-[#94A3B8]'}`} />
			</button>
		</div>
	)
}

export default Sidebar
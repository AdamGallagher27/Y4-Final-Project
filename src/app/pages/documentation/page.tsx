'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import ModelDocumentation from '@/components/generic/ModelDocumentation'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import { Button } from '@/components/ui/button'
import { Model } from '@/types'
import { getAllModels } from '@/utils/api'
import { useEffect, useState } from 'react'

export default function Documentation() {
	useAuthentication()

	const [models, setModels] = useState<Model[] | undefined>([])
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		const handleGetModels = async () => {
			setModels(await getAllModels())
		}
		handleGetModels()
	}, [])

	// chat gpt
	const handleCopy = () => {
		const apiKey = process.env.NEXT_PUBLIC_API_TOKEN
		if (apiKey) {
			navigator.clipboard.writeText(apiKey)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 w-full ml-20'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Documentation Introduction'></Title>

				<p className='ml-2 w-[50%] className="leading-7 [&:not(:first-child)]:mt-6"'>
					The CMS uses Gun.js to store data, by default only one peer is configure  <code>https://gun-manhattan.herokuapp.com/gun.</code>. Developers can configure as many peers as needed. The system ensures data security through encryption and decryption using public and private keys, along with a data signature that verifies the integrity of the stored data.
				</p>

				<Title firstPartOfTitle='API' secondPartOfTitle='Authorisation Token'></Title>
				<p className='ml-2 w-[50%] className="leading-7 [&:not(:first-child)]:mt-6"'>
					Every single endpoint in this API requires an <strong>Authorization</strong> header containing a valid API token. This token is necessary for authenticating requests and ensuring that only authorized users can access the resources. The API token should be included in the header like so: <code>Authorization: Bearer YOUR_API_TOKEN</code>. Without this token, any request made to the API will be rejected, ensuring secure access to all endpoints.
				</p>
				<Button className='ml-2 my-4 ' onClick={handleCopy}>
					{copied ? 'Copied!' : 'Add Api Key To ClipBoard'}
				</Button>

				<Title firstPartOfTitle='API' secondPartOfTitle='Models and CRUD Endpoints'></Title>
				<p className='ml-2 w-[50%] className="leading-7 [&:not(:first-child)]:mt-6"'>
					Every model in this API supports full CRUD operations, including retrieving all rows, getting a single row, creating, updating, and deleting records. To access the data, you can use the model ID in the URL.
				</p>

				{models && models.map(((model) => {
					return <ModelDocumentation key={model.name} model={model} />
				}))}
			</div>
		</div >
	)
}
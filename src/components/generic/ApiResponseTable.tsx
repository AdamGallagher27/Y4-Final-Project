'use client'

import { getResponseStatus } from '@/utils'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { useEffect, useState } from 'react'
import { StatusFromAPI } from '@/types'

const ApiResponseTable = () => {

	const [responses, setResponses] = useState<StatusFromAPI[] | undefined>([])

	useEffect(() => {
		const handleApi = async () =>{
			setResponses(await getResponseStatus())
		}

		handleApi()
	}, [])

	if (!responses || responses.length === 0) return

	return (
		<Table>
			<TableHeader >
				<TableRow>
					<TableHead>STATUS</TableHead>
					<TableHead>URL</TableHead>
					<TableHead>CREATED-AT</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{responses.map((response, index) => (
					<TableRow key={response.url + index}>
						<TableCell>{response.status}</TableCell>
						<TableCell>{response.url}</TableCell>
						<TableCell>{response.createdAt}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default ApiResponseTable
'use client'
import { Model } from '@/types'
import React, { useEffect, useState } from 'react'
import Title from '../generic/Title'
import { Button } from '../ui/button'
import ModelDocumentation from '../generic/ModelDocumentation'
import { getAllModelsFromIndexedDB } from '@/utils/indexDB'
import RouteDocs from '../generic/RouteDocs'


const DocumentationWrapper = () => {

  const [copied, setCopied] = useState(false)

  // chat gpt
  const handleCopy = () => {
    const apiKey = process.env.NEXT_PUBLIC_API_TOKEN
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const [models, setModels] = useState<Model[]>([])

  useEffect(() => {
    const handleLoadModels = async () => {
      const models = await getAllModelsFromIndexedDB()
      setModels(models)
    }

    handleLoadModels()
  }, [])

  return (
    <div className='p-4 w-full ml-20 flex flex-col gap-10'>
      <div>
        <Title firstPartOfTitle='API' secondPartOfTitle='Documentation Introduction'></Title>
        <p className='ml-2 w-[50%]'>
          The CMS uses Gun.js to store data, by default only one peer is configure  <code>https://gun-manhattan.herokuapp.com/gun.</code>. Developers can configure as many peers as needed. The system ensures data security through encryption and decryption using public and private RSA keys, along with a data signature that verifies the integrity of the stored data and with AES encryption additionally.
        </p>
      </div>
      <div>
        <Title firstPartOfTitle='API' secondPartOfTitle='Authorisation Token'></Title>
        <p className='ml-2 w-[50%]'>
          Every single endpoint in this API requires an <strong>Authorization</strong> header containing a valid API token. This token is necessary for authenticating requests and ensuring that only authorized users can access the resources. The API token should be included in the header like so: <code>Authorization: Bearer YOUR_API_TOKEN</code>. Without this token, any request made to the API will be rejected, ensuring secure access to all endpoints.
        </p>
        <Button className='ml-2 my-4 ' onClick={handleCopy}>
          {copied ? 'Copied!' : 'Add Api Key To ClipBoard'}
        </Button>
      </div>
      <div>
        <Title firstPartOfTitle='API' secondPartOfTitle='Peers'></Title>
        <p className='ml-2 w-[50%]'>
          The data created by the user is stored using Gun JS. Guns JS is a decentralized database where data is spread between peers in a network where no one peer has ultimate power over the other peers in the network, Gun js is a graph database but none of the graph funcitonality is used in this CMS. Peers can be configured in the settings page which can be found on the side navigation bar. Any number of peers can be added to the network but once the application is built no other peers may be added. This is because the peers are stored in the public directory in NextJS. When the CMS is built the public directory is bundled and gets served to the application as a static asset and cannot be mutated.
        </p>
      </div>

      <div>
        <Title firstPartOfTitle='API' secondPartOfTitle='Singles and Authentication'></Title>
        <p className='ml-2 w-[50%]'>
          The CMS API has routes for basic user registration and authentication. The user auth data is validated including checking emails are unique and passwords are long enough. When a user hits this end point there data is compared to the encrypted version in the Gun JS database if they match a jwt token is returned to the client. These endpoints can be found below.
        </p>

        <RouteDocs method='POST' url={`${process.env.NEXT_PUBLIC_HOSTING_URL || 'http://host/'}api/userAuth/login`} />

        <p className='ml-2 mt-5 w-[50%]'>
          The CMS also offers single valued routes, these can be used for managing titles or feature flags in an application and have full crud capabilites. These resources are managaed in the singles page which can be found in the side navbar. These can either be retrieved individually or all of them can be retrieved at once like a collection. The end point for these can be found below. 
        </p>
        <RouteDocs method='GET' url={`${process.env.NEXT_PUBLIC_HOSTING_URL || 'http://host/'}api/single`} />
        <RouteDocs method='POST' url={`${process.env.NEXT_PUBLIC_HOSTING_URL || 'http://host/'}api/single/[single_id]`} />
        <RouteDocs method='GET' url={`${process.env.NEXT_PUBLIC_HOSTING_URL || 'http://host/'}api/single/[single_id]`} />
        <RouteDocs method='PUT' url={`${process.env.NEXT_PUBLIC_HOSTING_URL || 'http://host/'}api/single/[single_id]`} />
        <RouteDocs method='DELETE' url={`${process.env.NEXT_PUBLIC_HOSTING_URL || 'http://host/'}api/single/[single_id]`} />
      </div>

      <div>
        <Title firstPartOfTitle='API' secondPartOfTitle='Models and CRUD Endpoints'></Title>
        <p className='ml-2 w-[50%]'>
          Every model in this API supports full CRUD operations, including retrieving all rows, getting a single row, creating, updating, and deleting records. To access the data, you can use the model ID in the URL. The API has built in route validation on the server and client side validation from the CMS. The models are stored in two locations. Firstly the models are stored in the Gun JS network but they are also cached locally on the client in indexDB. The indexDB store and table names are generated by the CMS so the user can have multiple CMS instances on the same client without them sharing models unnecessarily. Having them both stored locally and on the network improves performance and also ensures the models are available even when accessing the CMS from a different host. If the indexDB is cleared it uses the network as a fallback.
        </p>
      </div>
      {models && models.map(((model) => {
        return <ModelDocumentation key={model.name} model={model} />
      }))}
    </div>
  )
}

export default DocumentationWrapper
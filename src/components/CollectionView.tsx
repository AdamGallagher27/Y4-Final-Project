import React from 'react'

type Props = {
  collectionName: string
}

const mock = { "name": "car test mock", "properties": [{ "name": "car_make", "type": "string" }, { "name": "year_bought", "type": "number" }, { "name": "has_insurance", "type": "boolean" }],"items":[] }


const CollectionView = (props: Props) => {

  const { collectionName } = props


  // get the data from gun later for now just use mocked example

  return (
    <div>
      <h2>CollectionView</h2>
      <p>{collectionName}</p>
      {/* <p className='border-solid border-2 border-sky-500'>{mock.name}</p> */}

      <table>
        <thead>
          <tr>
            {mock.properties.map((property, index) => {
              // const name = {property}
             return <th key={property.name + index}>{property.name}</th>
            })}
          </tr>
        </thead>
      </table>
     
    </div>
  )
}

export default CollectionView
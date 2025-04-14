'use client'
import { User } from '@/types'
import React, { useState } from 'react'
import UserResponseTable from '../generic/UsersResponseTable'
import Title from '../generic/Title'

interface Props {
  apiUsers: User[] | undefined
}

const UsersWrapper = ({apiUsers}: Props) => {
  const [users] = useState<User[] | undefined>(apiUsers)

  return (
    <div className='p-4 ml-20 w-96'>
      <Title firstPartOfTitle='Collections' secondPartOfTitle='Users' />
      {users ? <UserResponseTable users={users}  /> : 'No users added yet'}
    </div>
  )
}

export default UsersWrapper
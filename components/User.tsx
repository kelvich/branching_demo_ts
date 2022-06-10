import React from 'react'

export type UserProps = {
  email: string;
  name: string;
}

const User: React.FC<{user: UserProps}> = ({user}) => {
  return (
    <tr>
        <td>{user.email}</td>
        <td>{user.name}</td>
    </tr>
  )
}

export default User
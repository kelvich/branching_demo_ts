import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import User, { UserProps } from "../components/User"

type Users = {
  users: UserProps[]
}

const Drafts: React.FC<Users> = ({users}) => {
  return (
    <Layout>
      <div className="page">
        <h1>Users</h1>
        {/* <main> */}
        <table>
          <tbody>
          {users.map((u) => (
            <User key={u.email} user={u} />
          ))}
          </tbody>
        </table>
        {/* </main> */}
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_PREFIX}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/users`)
  const users = await res.json()
  return {
    props: { users },
  }
}

export default Drafts

import { GetStaticProps, GetStaticPaths } from 'next'

import { User} from '../../src/entity/User'
import { sampleUserData } from '../../utils/sample-data'
import Layout from '../../components/Layout'
import UserDetail from '../../components/UserDetail'
import { getDatabaseConnection } from '../../libs/db'

type Props = {
  item?: User
  errors?: string
  role?: string
}

const UserPage = ({ item, errors }: Props) => {
  console.log(item)
  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return (
    <Layout
      title={`${
        item ? item.email : 'User Detail'} | Next.js + TypeScript Example`}
    >
      <h1>User Information</h1>
      {item && <UserDetail item={item} authrole={item.role}/>}
    </Layout>
  )
}

export default UserPage

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on users
  // const paths = sampleUserData.map((user) => ({
  //   params: { id: user.id.toString() },
  // }))
  const db = await getDatabaseConnection()
  const dbrep = db.getRepository<User>('user')
  const result = await dbrep.find()
  const paths = result.map((user)=>({
    params: { id: user.id.toString()}
  }))
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("in [id].tsx")
  try {
    const id = params?.id
    const db = await getDatabaseConnection()
    const dbrep = db.getRepository<User>('user')
    const result = await dbrep.findOne({where: {id}})
    // By returning { props: item }, the StaticPropsDetail component
    // will receive `item` as a prop at build time
    const json = result? result.toJSON():{}
    console.log("json",json)
    return { props: {item: json} }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}

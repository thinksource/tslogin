import { NextApiRequest, NextApiResponse } from 'next'
import { authenticated } from '../../../libs/auth'
import { UserRole } from '../../../src/entity/User'
// import { sampleUserData } from '../utils/sample-data'

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.json({message:"hello"})
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default authenticated(handler, [UserRole.active, UserRole.admin])

import { Router } from 'express'
import { withAuth } from '../middlewares/auth.middleware'
import { adminOnlyRoute } from './utils'
import {
  getAdminStats,
  getAdminUsers,
} from '@/api/controllers/admin.controller'
const router = Router()

router.get('/stats', withAuth, adminOnlyRoute<{}>(getAdminStats))
router.get('/users', withAuth, adminOnlyRoute<{}>(getAdminUsers))

export default router

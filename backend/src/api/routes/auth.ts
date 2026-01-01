import { toNodeHandler } from 'better-auth/node'
import { auth } from '@/lib/better-auth'
import { Router } from 'express'

const router = Router()

router.post('/login', AuthController.login);
router.get('/me', withAuth, authenticatedRoute(AuthController.me));
router.post('/update', withAuth, authenticatedRoute(AuthController.updateProfile));
router.post('/setup', withAuth, validateAndMerge(SetupProfileRequestSchema), authenticatedRoute(AuthController.setupProfile));
router.post('/verify-username', withAuth, authenticatedRoute(AuthController.verifyUsername));

export default router

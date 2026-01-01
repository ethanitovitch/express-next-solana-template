import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import logger from '@/utils/logger';
import { AuthRequestHandler } from '@/types/request';
import { getUserStats } from '@/services/stats.service';
import { UpdateProfileRequest, SetupProfileRequest } from '@/types/request/user';
import { updateUser, validateUsername, setupUser as setupUserService } from '@/services/user.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { publicKey, signature, timestamp } = req.body;

      if (!publicKey || !signature || !timestamp) {
        return res.status(400).json({ 
          error: 'Missing required fields' 
        });
      }

      const auth = await AuthService.authenticateWithWallet(
        publicKey,
        signature,
        timestamp
      );

      return res.json(auth);
    } catch (error) {
      logger.error({ error }, 'Login failed');
      
      if (error instanceof Error) {
        return res.status(400).json({ 
          error: error.message 
        });
      }

      return res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }

  static me: AuthRequestHandler<never> = async (req, res) => {
    try {
      const user = req.user;
      console.log(user);
      const userStats = await getUserStats(user.id);
      return res.json({
        user,
        userStats,
      });
    } catch (error) {
      logger.error('Me failed', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static updateProfile: AuthRequestHandler<UpdateProfileRequest> = async (req, res) => {
    const { username, avatarUrl, discordToken } = req.body;
    const user = req.user;
    const updatedUser = await updateUser(user, { username, avatar: avatarUrl }, discordToken);
    return res.json({ user: updatedUser });
  }

  static setupProfile: AuthRequestHandler<SetupProfileRequest> = async (req, res) => {
    try {
      const { username, referralCode } = req.validated;
      logger.info(`Setting up user ${req.user.id} with username ${username} and referral code ${referralCode} a change`);
      const user = req.user;
      const updatedUser = await setupUserService(user, username, referralCode);
      
      return res.json({ user: updatedUser });
    } catch (error) {
      logger.error(error, `Setup profile failed with error`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static verifyUsername: AuthRequestHandler<SetupProfileRequest> = async (req, res) => {
    try {
      const { username } = req.body;
      const user = req.user;
      const isValid = await validateUsername(user.id, username);
      return res.json({ isValid });
    } catch (error) {
      logger.error('Verify username failed', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static disconnectDiscord: AuthRequestHandler<{}> = async (req, res) => {
    const user = req.user;
    const updatedUser = await updateUser(user, { discordId: null, discordUsername: null, discordAvatar: null });
    return res.json({ user: updatedUser });
  }

  static markSideBetRulesAsRead: AuthRequestHandler<{}> = async (req, res) => {
    const user = req.user;
    const updatedUser = await updateUser(user, { hasReadSideBetRules: true });
    return res.json({ user: updatedUser });
  }
} 
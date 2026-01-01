import { Express, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from '@/config';
import { getOrCreateUser } from '@/services/user.service';
import logger from '@/lib/logger';

export const withAuth = passport.authenticate('jwt', { session: false });

export function initializeAuth(app: Express) {
  app.use(passport.initialize());

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret,
      },
      async (payload, done) => {
        try {
          const user = await getOrCreateUser(payload.publicKey);
          if (!user) {
            return done(null, false);
          }
          if (user.isBanned) {
            return done(new Error('User is banned'), false);
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  return passport;
}

export const withApiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers.authorization;
  if (!apiKey || apiKey !== config.webhookApiKey) {
    logger.error('Unauthorized request');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
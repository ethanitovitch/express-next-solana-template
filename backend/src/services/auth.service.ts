import jwt from "jsonwebtoken";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { config } from "@/config";
import logger from "@/lib/logger";
import { getOrCreateUser } from "./user.service";
import { DBUser } from "@shared/db/src";

interface AuthResponse {
  user: DBUser;
  token: string;
}

export class AuthService {
  static async authenticateWithWallet(
    publicKey: string,
    signature: string,
    timestamp: string,
  ): Promise<AuthResponse> {
    // Validate timestamp
    const signedTimestamp = parseInt(timestamp);
    const now = Date.now();
    if (now - signedTimestamp > config.auth.signatureExpiryMs) {
      throw new Error("Signature expired");
    }

    // Verify signature
    try {
      const message = new TextEncoder().encode(timestamp);
      const publicKeyBytes = bs58.decode(publicKey);
      const signatureBytes = bs58.decode(signature);

      const isValid = nacl.sign.detached.verify(
        message,
        signatureBytes,
        publicKeyBytes,
      );

      if (!isValid) {
        throw new Error("Invalid signature");
      }
    } catch (error) {
      logger.error({ error, publicKey }, "Signature verification failed");
      throw new Error("Signature verification failed");
    }

    const user = await getOrCreateUser(publicKey);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        publicKey: user.publicKey,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      },
    );

    return { user, token };
  }
}

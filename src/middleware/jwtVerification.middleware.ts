import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import * as jwt from 'jsonwebtoken';

@Injectable()
// middleware token verification
export class tokenVerification implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.body.authToken || req.header('authToken');
    if (!token) return res.status(401).json('Token Not Found!');
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      return res.status(400).json('Token Verification Failed!');
    }
  }
}

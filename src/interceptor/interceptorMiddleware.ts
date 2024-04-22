import { Request, Response, NextFunction } from 'express';

/*
* To standardize and unify the token retrieval from the request header
*
* */
const interceptorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Interceptor logic goes here, such as checking if the token exists in the request header
  const isV1Version = req.url.includes('/v1/');
  const isV2Version = req.url.includes('/v2/');

  console.log('isV1Version', isV1Version);
  console.log('isV2Version', isV2Version);

  // If everything is fine, continue to pass the request to the next middleware or route handler
  next();
};

export default interceptorMiddleware;

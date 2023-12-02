import { getSession } from 'next-auth/react';

export async function getSessionFromRequest(request) {
  const req = {
    headers: {
      ...request.headers,
      cookie: request.headers.get('cookie'),
    },
    method: request.method,
  };

  return await getSession({ req });
}

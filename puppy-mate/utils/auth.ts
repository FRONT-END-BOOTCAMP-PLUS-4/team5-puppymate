import jwt from 'jsonwebtoken';

export function getUserIdFromRequest(request: Request): number | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

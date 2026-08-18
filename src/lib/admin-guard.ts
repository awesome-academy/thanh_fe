import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Authorization for admin route handlers.
 *
 * The middleware matcher covers /admin/** pages but not /api/**, so every
 * privileged handler has to gate itself. Returns { error } to short-circuit,
 * otherwise { session }.
 *
 *   const guard = await requireAdmin();
 *   if (guard.error) return guard.error;
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập' } },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== 'admin') {
    return {
      error: NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Bạn không có quyền truy cập' } },
        { status: 403 }
      ),
    };
  }

  return { session };
}

import { auth } from '@/auth';
import Profile from '@/components/misc/profile';
import { drizzle } from '@/db';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();
  let user;
  if (!session?.user) {
    redirect('/');
  } else {
    user = await drizzle.users.findUserByEmail(session.user.email!);
  }

  return <div className="flex flex-col">{user && <Profile user={user} />}</div>;
}

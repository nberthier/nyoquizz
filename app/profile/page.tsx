import { auth } from '@/auth';
import Profile from '@/components/misc/profile';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className="flex flex-col">
      <Profile user={session.user} />
    </div>
  );
}

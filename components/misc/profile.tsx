import Image from 'next/image';
import Link from 'next/link';

export default async function Profile({
  user,
}: {
  user: {
    email?: null | string;
    image?: null | string;
    name?: null | string;
  };
}) {
  return (
    <div className="flex justify-between">
      <div>
        <h2 className="text-3xl font-bold">{user.name}</h2>
        <p>{user.email}</p>
      </div>
      <Link
        href={
          user.image ||
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
        }
      >
        <div className="relative h-20 w-20 overflow-hidden rounded-full">
          <Image
            alt={user.name || 'Profile Picture'}
            className="object-cover"
            fill
            priority
            quality={100}
            src={
              user.image ||
              'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
            }
          />
        </div>
      </Link>
    </div>
  );
}

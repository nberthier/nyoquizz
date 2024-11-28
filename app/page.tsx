import logo from '@/lib/images/midjourney-logo.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <Image alt="Home" height={250} src={logo} width={250} />
      <h1 className="text-5xl font-bold">NYOQUIZZ</h1>
      <div className="flex w-full justify-center gap-4 align-middle">
        <Link
          className="flex-1 grow rounded bg-blue-500 px-4 py-2 text-center font-bold text-white hover:bg-blue-700"
          href="/game"
        >
          Play
        </Link>
        <Link
          className="flex-1 grow rounded bg-blue-500 px-4 py-2 text-center font-bold text-white hover:bg-blue-700"
          href="/gallery"
        >
          Gallery
        </Link>
      </div>
    </div>
  );
}

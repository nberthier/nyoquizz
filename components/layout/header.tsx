import { signIn, signOut } from '@/auth';
import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import logo from '@/lib/images/midjourney-logo.png';
import { cn } from '@/lib/utils';
import { PersonIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '../ui/button';

const galleryElements: { description: string; href: string; title: string }[] =
  [
    {
      description: 'League of Legends characters.',
      href: '/gallery/champions',
      title: 'Champions',
    },
    {
      description: 'Cities, nature, space, etc.',
      href: '/gallery/landscapes',
      title: 'Landscapes',
    },
    {
      description: 'Other types of content.',
      href: '/gallery/miscellaneous',
      title: 'Miscellaneous',
    },
  ];

const Header = async () => {
  const session = await auth();

  return (
    <header className="flex w-full flex-row justify-between gap-5">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/">
              <Image
                alt="logo"
                className="w-8 md:w-9"
                height={36}
                src={logo}
                width={36}
              />
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Gallery</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {galleryElements.map((galleryElement) => (
                  <ListItem
                    href={galleryElement.href}
                    key={galleryElement.title}
                    title={galleryElement.title}
                  >
                    {galleryElement.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/ranking" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Ranking
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/history" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                History
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/profile" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Profile
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {!session?.user ? (
        <form
          action={async () => {
            'use server';
            await signIn('discord');
          }}
        >
          <Button className="flex self-center rounded-full" size="icon">
            <PersonIcon className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <Button
            className="flex self-center rounded-full"
            size="icon"
            variant="outline"
          >
            <Avatar>
              {session?.user?.image ? (
                <AvatarImage alt="avatar" src={session.user.image} />
              ) : (
                <AvatarFallback>CN</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </form>
      )}
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ children, className, title, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          ref={ref}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export { Header };

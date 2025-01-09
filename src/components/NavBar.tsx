"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import UserShortCut from './UserShortCut'
import { links } from '@/consts'
import { usePermissions } from '@/hooks/use-permissions'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { pages, user } = usePermissions();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname])

  if (!user) return null;

  return (
    <div>
      <button className="navbar-burger flex items-center text-primary border border-primary rounded-md p-3" onClick={() => setIsOpen(true)}>
        <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </button>
      <div className={`flex justify-end z-30 fixed inset-0 transition-transform ease-linear duration-75 bg-gray-800/25 ${isOpen ? "translate-x-0" : "opacity-0 translate-x-full"}`}>
        <nav className="gap-2.5 flex flex-col w-full max-w-sm py-6 px-6 bg-primary border-r overflow-y-auto">
          <div className="flex items-center mb-1.5">
            <button className="p-2 rounded-md hover:bg-primary-foreground/10" onClick={() => setIsOpen(false)}>
              <svg className="h-6 w-6 text-white cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className='flex flex-col gap-2.5 relative overflow-auto flex-1'>
            <ul className='absolute flex-1 w-full'>
              {
                links.map(link => (pages === "*" || pages.includes(link.label)) && (
                  <li className="mb-1" key={link.label}>
                    <Link className={`capitalize block p-4 text-sm font-semibold text-white hover:bg-primary-foreground/10 rounded ${pathname === link.href && "hover:bg-primary-foreground/30 bg-primary-foreground/30"}`} href={link.href}>{link.label}</Link>
                  </li>
                ))
              }
            </ul>
          </div>
          <UserShortCut user={user} />
        </nav>
      </div>
    </div>
  )
}

export default NavBar
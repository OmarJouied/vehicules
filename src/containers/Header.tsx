import NavBar from '@/components/NavBar'
import Image from 'next/image'
import Link from 'next/link'

const Header = async () => {
  return (
    <header>
      <div className="container flex justify-between items-center gap-2.5">
        <Link href={'/'}>
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </Link>
        <NavBar />
      </div>
    </header>
  )
}

export default Header
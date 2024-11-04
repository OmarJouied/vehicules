import NavBar from '@/components/NavBar'
import Link from 'next/link'

const Header = () => {
  return (
    <header>
      <div className="container flex justify-between items-center gap-2.5">
        <Link href={'/'}>
          <h1>Vehicules</h1>
        </Link>
        <NavBar />
      </div>
    </header>
  )
}

export default Header
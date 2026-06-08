import { useLocation, useNavigate, NavLink, Link } from 'react-router-dom'
import { navigationLinks } from '../data/storyData.js'
import { useState } from 'react'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollToTarget = (target) => {
    const id = target.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNav = (item) => {
    if (item.type === 'anchor') {
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: item.href } })
      } else {
        scrollToTarget(item.href)
      }
      setMenuOpen(false)
      return
    }

    navigate(item.href)
    setMenuOpen(false)
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        Memoir
      </Link>

      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        {navigationLinks.map((item) => (
          <button
            key={item.label}
            type="button"
            className="nav-link"
            onClick={() => handleNav(item)}
          >
            {item.label}
          </button>
        ))}
        <NavLink
          to="/record"
          className="nav-link nav-link-cta"
          onClick={() => setMenuOpen(false)}
        >
          Start the Story
        </NavLink>
      </nav>
    </header>
  )
}

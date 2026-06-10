import { useLocation, useNavigate, NavLink, Link } from 'react-router-dom'
import { navigationLinks } from '../data/storyData.js'
import { useEffect, useState } from 'react'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('.hero-section')
    if (!hero) {
      setIsHeroVisible(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting)
      },
      {
        rootMargin: '-90px 0px 0px 0px',
        threshold: 0.1,
      }
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [location.pathname])

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

  const headerClass = `navbar ${isHeroVisible ? 'navbar-hero' : 'navbar-light'}`

  return (
    <header className={headerClass}>
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
          to="/record-memory"
          className="nav-link nav-link-cta"
          onClick={() => setMenuOpen(false)}
        >
          Start the Story
        </NavLink>
      </nav>
    </header>
  )
}

import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem('efa-theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('efa-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('efa-theme', 'light');
      }
      return newMode;
    });
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  return (
    <header className={`primary-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container">
        <div className="nav-wrapper">
          <Link href="/" className="logo-black">
            <img src="/efa-logo.png" alt="EFA" className="header-logo-img" />
          </Link>

          <button
            className="mobile-nav-toggle"
            aria-controls="primary-navigation"
            aria-expanded={isMobileNavOpen}
            onClick={toggleMobileNav}
          >
            {isMobileNavOpen ? <X className="close" /> : <Menu className="hamburger" />}
          </button>

          <nav
            className="primary-navigation"
            id="primary-navigation"
            data-visible={isMobileNavOpen}
          >
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/standings" className="nav-link">standings</Link>
              </li>
              <li className="nav-item">
                <Link href="/teams" className="nav-link">teams</Link>
              </li>
              <li className="nav-item">
                <Link href="/scores/week1" className="nav-link">
                  scores
                  <button className="nav-caret" aria-expanded="false" onClick={(e) => e.preventDefault()}>
                    <ChevronDown />
                  </button>
                </Link>
                <div className="nav-dropdown">
                  <h3 className="nav-group-title">Weeks</h3>
                  <ul className="nav-dropdown-list">
                    <li><Link href="/scores/week1">Week 1</Link></li>
                    <li><Link href="/scores/week2">Week 2</Link></li>
                    <li><Link href="/scores/week3">Week 3</Link></li>
                    <li><Link href="/scores/week4">Week 4</Link></li>
                    <li><Link href="/scores/week5">Week 5</Link></li>
                    <li><Link href="/scores/week6">Week 6</Link></li>
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <Link href="/stats" className="nav-link">
                  stats
                  <button className="nav-caret" aria-expanded="false" onClick={(e) => e.preventDefault()}>
                    <ChevronDown />
                  </button>
                </Link>
                <div className="nav-dropdown">
                  <h3 className="nav-group-title">Categories</h3>
                  <ul className="nav-dropdown-list">
                    <li><Link href="/stats?category=passing">Passing</Link></li>
                    <li><Link href="/stats?category=rushing">Rushing</Link></li>
                    <li><Link href="/stats?category=receiving">Receiving</Link></li>
                    <li><Link href="/stats?category=defense">Defense</Link></li>
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <Link href="/rulebook" className="nav-link">rulebook</Link>
              </li>
              <li className="nav-item">
                <Link href="/legacy" className="nav-link">
                  legacy
                  <button className="nav-caret" aria-expanded="false" onClick={(e) => e.preventDefault()}>
                    <ChevronDown />
                  </button>
                </Link>
                <div className="nav-dropdown">
                  <h3 className="nav-group-title">History</h3>
                  <ul className="nav-dropdown-list">
                    <li><Link href="/legacy">Season 1 Legacy</Link></li>
                    <li><Link href="/legacy/season2">Season 2 Legacy</Link></li>
                  </ul>
                </div>
              </li>
              <li className="nav-item display-sm-none display-md-inline-flex">
                <a href="https://discord.gg/efaroblox" target="_blank" rel="noopener noreferrer" className="button">join now</a>
              </li>
            </ul>
          </nav>

          <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>
    </header>
  );
}

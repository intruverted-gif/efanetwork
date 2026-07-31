import React from 'react';
import { Link } from 'wouter';
import { FaDiscord, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="primary-footer padding-block-700">
      <div className="container">
        <div className="primary-footer-wrapper">
          <div className="primary-footer-logo-social">
            <Link href="/" className="footer-logo-img-link">
              <img src="/efa-logo.png" alt="EFA" className="footer-logo-img" />
            </Link>
            <div className="social-list">
              <a href="https://discord.gg/efaroblox" aria-label="Discord" target="_blank" rel="noopener noreferrer">
                <FaDiscord />
              </a>
              <a href="https://youtube.com/" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>

          <nav className="footer-nav">
            <ul role="list" className="flow">
              <li><Link href="/">home</Link></li>
              <li><Link href="/standings">standings</Link></li>
              <li><Link href="/stats/qb">stats</Link></li>
              <li><Link href="/scores/week1">scores</Link></li>
              <li><Link href="/rulebook">rulebook</Link></li>
              <li><Link href="/legacy">legacy</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

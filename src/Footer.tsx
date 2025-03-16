import React from 'react';
import {GithubIcon, LinkedinIcon, TwitterIcon} from './components/icons';
import {SocialLink} from './components/icons/index';

const socialLinks = [
  { icon: GithubIcon, href: '#', label: 'GitHub' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
];

const Footer = () => {
  return (
    <footer className="shadow-md text-white">
      <div className="container mx-auto px-6 py-8 glass-card">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© {new Date().getFullYear()} MyApp. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} {...link} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
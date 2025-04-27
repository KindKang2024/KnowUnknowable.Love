import React from 'react';
import IChingIcon, { GithubIcon, GrokDivineIcon, LinkedinIcon, MediumIcon, TwitterIcon, TwitterXIcon, YinYangIcon } from './components/icons';
import { SocialLink } from './components/icons/index';
import { usePageWillData, usePageCommonData } from './i18n/DataProvider';
const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/almworld', label: 'GitHub' },
  { icon: TwitterXIcon, href: 'https://x.com/alm_world', label: 'X' },
];


const Footer = () => {
  const commonData = usePageCommonData();

  return (
    <footer className="shadow-md text-white relative ">
      <div className="container mx-auto px-6 py-3 glass-card">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8 w-full">
          <p className="text-xs text-gray-400 z-10 text-center md:text-left md:flex-1" id="footer-copyright">
            © {2025} &nbsp;
            <span className="text-xs text-gray-200 flex-shrink-0">
              <span>know</span>
              <span className="mr-1 text-red-300">unknowable</span>
              <YinYangIcon className="w-2 h-2 inline-block" />
              <span className="text-red-300">love</span>
            </span>
          </p>

          <div className="flex flex-row items-center justify-center space-x-2 flex-shrink-0" id="footer-slogan">
            <div className="flex-shrink-0">
              <GrokDivineIcon className="w-7 h-7 inline-block" />
            </div>
            <div className="flex flex-row items-center flex-shrink-0">
              <span className="text-xs text-gray-300">{commonData.slogan}</span>
            </div>
            <div className="flex-shrink-0 mb-1">
              <YinYangIcon className="w-4 h-4 inline-block" />
            </div>
          </div>

          <div className="flex flex-row items-center justify-center md:justify-end space-x-6 md:space-x-4 text-center flex-shrink-0 md:flex-1" id="footer-links">
            {socialLinks.map((link) => (
              <a href={link.href} key={link.label}>
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
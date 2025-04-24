// import { navigationItems } from '../config/navigation';
import {Menu, X} from 'lucide-react';
import React, {useState} from 'react';
import {NavLink as RouterNavLink} from 'react-router-dom';
import {NavItem} from './i18n/types';
import {GrokDivineIcon, IChingIcon, YinYangIcon} from './components/icons';
import {routes} from './utils/constants';
import {LanguageSwitcher} from '@/components/LanguageSwitcher';
import CustomConnectButton from './components/CustomConnectButton';
import {usePageCommonData} from './i18n/DataProvider';

interface Props {
  item: NavItem;
  localeLabel: string;
  // item: any
}

const NavLink: React.FC<Props> = ({ item, localeLabel }) => {
  const { path, label, icon: Icon } = item;

  return (
    <RouterNavLink
      to={path}
      className={({ isActive }) =>
        `px-1 flex items-center space-x-1 ${isActive ? 'text-red-300' : 'text-white/70 hover:text-white'
        }`
      }
    >
      <Icon />
      <span className='font-cinzel'>{localeLabel}</span>
    </RouterNavLink>
  );
};

export const navigationItems: NavItem[] = [
  {
    path: routes.home,
    label: 'Divine',
    icon: GrokDivineIcon,
  },
  {
    path: routes.iChing,
    label: 'I Ching',
    icon: IChingIcon,
  },
  {
    path: routes.dao,
    label: 'DAO',
    icon: YinYangIcon,
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const commonData = usePageCommonData();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="shadow-md sm:bg-black/50" style={{
      zIndex: 10000,
    }}>
      <nav className="w-full mx-auto px-4 glass-card">
        <div className="flex items-center justify-between py-4" >
          <div className="flex items-center">

            <span className={`text-xl font-cinzel ${commonData.highlightPrefix ? 'text-red-300' : 'text-white/90'}`}>
              {/* Know Unknowable */}
              {commonData.knowUnknowablePrefix}
            </span>

            <YinYangIcon className="w-2 h-2 inline-block mx-1" />

            <span className={`text-xl bold font-cinzel ${commonData.highlightPrefix ? 'text-white/90' : 'text-red-300'}`}>
              {/* Love */}
              {commonData.knowUnknowableSuffix}
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            {navigationItems.map((item, index) => (
              <NavLink key={item.path} item={item} localeLabel={commonData.navLabels[index]} />
            ))}


            {/* Language Dropdown */}
            <LanguageSwitcher />
            {/* <LanguageSwitcher isMobile={false} /> */}

            <div
              style={{ width: '180px' }}
              className='flex items-center space-x-2'
            >
              <CustomConnectButton />
              {/* <ConnectButton
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
                chainStatus="name" showBalance={false} /> */}
            </div>

          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="pb-4 space-y-2">
            {navigationItems.map((item, index) => (
              <div key={item.path + 'nav'}>
                <NavLink key={item.path} item={item} localeLabel={commonData.navLabels[index]} />
                <div className="border-t border-white/10 my-2"></div>
              </div>
            ))}

            {/* Mobile Language Dropdown */}
            <LanguageSwitcher />
            <div className="border-t border-white/10 my-2"></div>
          </div>
          <div className='py-2 flex flex-col space-y-2'>
            {/* <ConnectButton /> */}
            <CustomConnectButton />
          </div>
        </div>
      </nav>
    </header >
  );
};

export default Header;
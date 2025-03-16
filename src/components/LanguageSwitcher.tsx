import {ChevronDown} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

// Language options
const languages = [
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
];

// Language Switcher Component
interface LanguageSwitcherProps {
    isMobile?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isMobile = false }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { i18n } = useTranslation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get current language label
    const getCurrentLanguageLabel = () => {
        const currentLang = languages.find(lang => lang.code === i18n.language);
        return currentLang?.label || languages[0].label;
    };

    if (isMobile) {
        return (
            <div className="py-2">
                <div className="flex items-center justify-between" onClick={toggleDropdown}>
                    <span className="text-white/70 font-cinzel">Language:</span>
                    <button className="flex items-center space-x-1 text-white/90 hover:text-white">
                        <span className="font-cinzel">{getCurrentLanguageLabel()}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {isDropdownOpen && (
                    <div className="mt-2 bg-black/30 border border-white/10 rounded">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`block w-full text-left px-3 py-2 text-sm font-cinzel ${i18n.language === lang.code
                                    ? 'bg-red-300 text-black font-medium'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center space-x-1 px-2 py-1 text-white/70 hover:text-white rounded h-full"
                aria-label="Change language"
            >
                <span className="font-cinzel">{getCurrentLanguageLabel()}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-black/90 border border-white/20 rounded shadow-lg z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`block w-full text-left px-3 py-2 text-sm font-cinzel ${i18n.language === lang.code
                                ? 'bg-red-300 text-black font-medium'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

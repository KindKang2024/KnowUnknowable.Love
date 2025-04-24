import { ChevronDown, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Language options
const languages = [
    { code: 'zh', label: '简体中文' },
    { code: 'zh-HK', label: '繁體中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
];

// No longer need isMobile prop or custom dropdown state/logic
export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        console.log('i18n.language', i18n.language);
    };

    // Get current language label
    const getCurrentLanguageLabel = () => {
        const currentLang = languages.find(lang => lang.code === i18n.language);
        // Default to 'EN' if current language not found or not set initially
        return currentLang?.label || languages.find(l => l.code === 'en')?.label || 'EN';
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-1 px-2 py-1 text-white/70 hover:text-white rounded h-full font-cinzel"
                    aria-label="Change language"
                >
                    <Languages className="h-6 w-6 mr-[-8px]" />
                    <span>{getCurrentLanguageLabel()}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                 align="end"
                 className="w-24 bg-black/90 border border-white/20 text-white"
            >
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`font-cinzel cursor-pointer ${
                            i18n.language === lang.code
                                ? 'bg-red-300 text-black focus:bg-red-400 focus:text-black'
                                : 'focus:bg-white/10 focus:text-white'
                        }`}
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

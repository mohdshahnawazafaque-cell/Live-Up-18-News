import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { format } from "date-fns";
import { hi, enUS } from "date-fns/locale";
import { useLanguage } from "../context/LanguageContext";

const NAV_ITEMS = [
  { en: "HOME", hi: "होम", path: "/" },
  { en: "INDIA", hi: "भारत", path: "/category/india" },
  { en: "UTTAR PRADESH", hi: "उत्तर प्रदेश", path: "/category/uttar-pradesh" },
  { en: "POLITICS", hi: "राजनीति", path: "/category/politics" },
  { en: "CRIME", hi: "क्राइम", path: "/category/crime" },
  { en: "BUSINESS", hi: "बिज़नेस", path: "/category/business" },
  { en: "SPORTS", hi: "खेल", path: "/category/sports" },
  { en: "ENTERTAINMENT", hi: "मनोरंजन", path: "/category/entertainment" },
  { en: "TECHNOLOGY", hi: "टेक", path: "/category/technology" },
  { en: "EDUCATION", hi: "शिक्षा", path: "/category/education" },
  { en: "HEALTH", hi: "स्वास्थ्य", path: "/category/health" },
  { en: "WORLD", hi: "दुनिया", path: "/category/world" },
  { en: "VIDEO NEWS", hi: "वीडियो", path: "/category/video-news" },
  { en: "PHOTO GALLERY", hi: "फ़ोटो", path: "/category/photo-gallery" }
];

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy", { locale: language === 'hi' ? hi : enUS });

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <div className="border-b border-slate-700 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center text-sm text-slate-300">
          <div>{currentDate}</div>
          <div className="flex gap-4">
            <Link to="/admin" className="hover:text-red-400 font-bold text-red-500 transition-colors mr-4 flex items-center gap-1">
              {language === 'hi' ? 'एडमिन' : 'Admin'}
            </Link>
            <button 
              onClick={() => setLanguage('en')}
              className={`transition-colors ${language === 'en' ? 'text-white font-bold' : 'hover:text-white'}`}
            >
              English News
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              className={`transition-colors ${language === 'hi' ? 'text-white font-bold' : 'hover:text-white'}`}
            >
              Hindi News
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden text-white hover:text-red-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            {/* Real Logo placeholder */}
            <img src="/logo.png" alt="LIVE UP 18 NEWS" className="h-12 w-auto bg-white rounded-md p-1" onError={(e) => {
              // Fallback if logo.png is missing
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none">LIVE UP 18</span>
              <span className="text-sm font-bold tracking-widest text-red-600 leading-none">NEWS</span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          {/* Ad Space or Tagline */}
        </div>

        <div className="flex items-center">
          <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 focus:ring-offset-slate-900">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-red-700 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-start py-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.en} className="whitespace-nowrap">
                <Link 
                  to={item.path}
                  className="inline-block px-3 py-2 text-sm font-bold text-white hover:bg-red-800 transition-colors uppercase"
                >
                  {language === 'hi' ? item.hi : item.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="bg-red-800 lg:hidden absolute top-full left-0 right-0 shadow-xl border-t border-red-700">
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.en}>
                <Link 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-bold text-white hover:bg-red-900 transition-colors uppercase border-b border-red-700/50"
                >
                  {language === 'hi' ? item.hi : item.en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

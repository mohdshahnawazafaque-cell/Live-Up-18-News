import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../types";
import { formatDistanceToNow } from "date-fns";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const [featuredNews, setFeaturedNews] = useState<NewsArticle | null>(null);
  const [topHeadlines, setTopHeadlines] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: NewsArticle[] }>({});

  useEffect(() => {
    // Fetch top news
    fetch("/api/news?limit=25")
      .then(res => res.json())
      .then(data => {
        const articles = data.articles || [];
        if (articles.length > 0) {
          setFeaturedNews(articles[0]);
          setTopHeadlines(articles.slice(1, 5));
          setLatestNews(articles.slice(5, 15));
          
          // Group some for sections
          const grouped: { [key: string]: NewsArticle[] } = {};
          ["INDIA", "UTTAR PRADESH", "POLITICS", "CRIME", "SPORTS", "ENTERTAINMENT"].forEach(cat => {
            grouped[cat] = articles.filter((a: NewsArticle) => a.category === cat).slice(0, 4);
          });
          setCategories(grouped);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-12">
      
      {/* Top Ad/Banner Section */}
      <section className="w-full">
        <a href="#" className="block w-full overflow-hidden rounded-xl shadow-md border border-slate-200">
          <img src="/banner1.png" alt="Live Up 18 News Promo" className="w-full h-auto object-cover max-h-[300px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </a>
      </section>

      {/* Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured */}
        <div className="lg:col-span-8">
          {featuredNews && (
            <Link to={`/article/${featuredNews.id}`} className="group block relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src={featuredNews.featuredImage} 
                alt={getLocalizedText(featuredNews, 'headline', language)}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-end p-6 md:p-10">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm w-max mb-4 uppercase">
                  {featuredNews.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-red-400 transition-colors">
                  {getLocalizedText(featuredNews, 'headline', language)}
                </h2>
                <p className="text-slate-200 text-lg line-clamp-2 md:line-clamp-3 max-w-3xl">
                  {getLocalizedText(featuredNews, 'shortSummary', language)}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Top Headlines Sidebar */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-4">
            <h3 className="text-xl font-black uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              {language === 'hi' ? 'प्रमुख खबरें' : 'Top Headlines'}
            </h3>
          </div>
          <div className="divide-y divide-slate-100 flex-1 flex flex-col">
            {topHeadlines.map(news => (
              <Link key={news.id} to={`/article/${news.id}`} className="p-4 group hover:bg-slate-50 transition-colors flex-1 flex flex-col justify-center">
                <span className="text-red-600 text-xs font-bold uppercase mb-1 block">
                  {news.category}
                </span>
                <h4 className="text-slate-900 font-bold text-lg leading-snug group-hover:text-red-700 transition-colors line-clamp-3">
                  {getLocalizedText(news, 'headline', language)}
                </h4>
                <div className="text-slate-500 text-xs mt-2">
                  {formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Horizontal Strip */}
      <section>
        <div className="flex items-center justify-between border-b-2 border-slate-900 mb-6 pb-2">
          <h3 className="text-2xl font-black uppercase text-slate-900">{language === 'hi' ? 'ताज़ा खबरें' : 'Latest News'}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.slice(0, 4).map(news => (
            <Link key={news.id} to={`/article/${news.id}`} className="group flex flex-col gap-3">
              <div className="overflow-hidden rounded-lg aspect-video relative">
                <img 
                  src={news.featuredImage} 
                  alt={getLocalizedText(news, 'headline', language)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                  {getLocalizedText(news, 'headline', language)}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Middle Ad/Banner Section */}
      <section className="w-full my-8">
        <a href="#" className="block w-full overflow-hidden rounded-xl shadow-md border border-slate-200">
          <img src="/banner2.png" alt="Live Up 18 News Promo" className="w-full h-auto object-cover max-h-[300px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </a>
      </section>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(categories).map(([catName, articles]) => (
          <section key={catName} className="flex flex-col">
            <div className="flex items-center justify-between border-b-2 border-red-600 mb-4 pb-2">
              <h3 className="text-xl font-black uppercase text-slate-900">
                {language === 'hi' ? 
                  (catName === 'INDIA' ? 'भारत' : 
                   catName === 'UTTAR PRADESH' ? 'उत्तर प्रदेश' : 
                   catName === 'POLITICS' ? 'राजनीति' : 
                   catName === 'CRIME' ? 'क्राइम' : 
                   catName === 'SPORTS' ? 'खेल' : 
                   catName === 'ENTERTAINMENT' ? 'मनोरंजन' : catName) 
                  : catName}
              </h3>
              <Link to={`/category/${catName.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-red-600 hover:text-slate-900 uppercase">
                {language === 'hi' ? 'सभी देखें' : 'See All'}
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {articles.map((news, idx) => (
                <Link key={news.id} to={`/article/${news.id}`} className={`group flex gap-4 ${idx !== 0 ? 'items-center' : 'flex-col'}`}>
                  <div className={`overflow-hidden rounded-lg relative flex-shrink-0 ${idx === 0 ? 'w-full aspect-video' : 'w-24 h-24'}`}>
                    {news.featuredImage ? (
                      <img 
                        src={news.featuredImage} 
                        alt={getLocalizedText(news, 'headline', language)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center border border-slate-200 transition-transform duration-500 group-hover:scale-110">
                        <span className="text-slate-300 font-bold text-sm">LIVE UP 18</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold text-slate-900 leading-snug group-hover:text-red-700 transition-colors ${idx === 0 ? 'text-lg mt-2 line-clamp-2' : 'text-sm line-clamp-3'}`}>
                      {getLocalizedText(news, 'headline', language)}
                    </h4>
                  </div>
                </Link>
              ))}
              {articles.length === 0 && <p className="text-slate-500 text-sm">{language === 'hi' ? 'इस श्रेणी में अभी तक कोई समाचार उपलब्ध नहीं है।' : 'No news available in this category yet.'}</p>}
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}

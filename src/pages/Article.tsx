import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { NewsArticle } from "../types";
import { format } from "date-fns";
import { hi } from "date-fns/locale";
import { Share2, MessageCircle, Link2, ArrowLeft } from "lucide-react";
import { useLanguage, getLocalizedText, getLocalizedArray } from "../context/LanguageContext";

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<NewsArticle[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news/${id}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data);
        if (data && data.category) {
          return fetch(`/api/news?category=${data.category}&limit=5`);
        }
        return Promise.resolve(null);
      })
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.articles) {
          setRelated(data.articles.filter((a: NewsArticle) => a.id !== id).slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
      
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center font-bold text-slate-500 animate-pulse">{language === 'hi' ? 'लेख लोड हो रहा है...' : 'Loading article...'}</div>;
  }

  if (!article) {
    return <div className="py-20 text-center font-bold text-slate-500">{language === 'hi' ? 'लेख नहीं मिला।' : 'Article not found.'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <article className="lg:col-span-8">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors mr-2"
              title={language === 'hi' ? 'वापस जाएं' : 'Go Back'}
            >
              <ArrowLeft size={20} />
            </button>
            <Link to={`/category/${article.category.toLowerCase().replace(/ /g, '-')}`} className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase hover:bg-red-700 transition-colors">
              {article.category}
            </Link>
            {article.state && (
              <span className="text-sm font-bold text-slate-500 uppercase px-2 border-l border-slate-300">
                {article.state}
              </span>
            )}
            {article.district && (
              <span className="text-sm font-bold text-slate-500 uppercase px-2 border-l border-slate-300">
                {article.district}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
            {getLocalizedText(article, 'headline', language)}
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-6">
            {getLocalizedText(article, 'shortSummary', language)}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-y border-slate-200 text-sm text-slate-500 gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-800">{language === 'hi' ? 'द्वारा' : 'By'} {article.author}</span>
              <span>{language === 'hi' ? 'अपडेट:' : 'Updated:'} {format(new Date(article.updatedDate), "MMM d, yyyy, h:mm a")}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-bold mr-2">{language === 'hi' ? 'शेयर करें:' : 'Share:'}</span>
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"><MessageCircle size={16} /></button>
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"><Share2 size={16} /></button>
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"><Link2 size={16} /></button>
            </div>
          </div>
        </header>

        <figure className="mb-8">
          {!article.featuredImage.includes('picsum') && (
            <img src={article.featuredImage} alt={getLocalizedText(article, 'headline', language)} className="w-full h-auto rounded-xl shadow-md object-cover max-h-[500px]" />
          )}
          <figcaption className="text-xs text-slate-500 mt-2 text-right">{language === 'hi' ? 'स्रोत:' : 'Source:'} {article.sourceAttribution}</figcaption>
        </figure>

        {getLocalizedArray(article, 'keyPoints', language).length > 0 && (
          <div className="bg-slate-50 border-l-4 border-red-600 p-6 rounded-r-xl mb-8">
            <h3 className="font-black text-lg mb-3 uppercase text-slate-900">{language === 'hi' ? 'मुख्य बिंदु' : 'Key Points'}</h3>
            <ul className="list-disc list-outside ml-5 space-y-2 text-slate-700">
              {getLocalizedArray(article, 'keyPoints', language).map((point, idx) => (
                <li key={idx} className="pl-2">{point}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-a:text-red-600 pb-12 border-b border-slate-200">
          <p className="whitespace-pre-line text-lg leading-relaxed text-slate-800">
            {getLocalizedText(article, 'content', language)}
          </p>
          {article.sourceUrl && (
            <div className="mt-8 pt-6">
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-md hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                {language === 'hi' ? 'पूरी खबर मूल वेबसाइट पर पढ़ें' : 'Read Full Article on Source'}
                <Link2 size={18} />
              </a>
            </div>
          )}
        </div>

      </article>

      <aside className="lg:col-span-4 flex flex-col gap-8">
        <div className="bg-slate-100 rounded-xl p-6 h-[300px] flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-300">
          {language === 'hi' ? 'विज्ञापन स्थान' : 'Advertisement Space'}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-4">
            <h3 className="text-lg font-black uppercase">{language === 'hi' ? 'संबंधित समाचार' : 'Related News'}</h3>
          </div>
          <div className="flex flex-col divide-y divide-slate-100 p-4">
            {related.map(news => (
              <Link key={news.id} to={`/article/${news.id}`} className="py-4 group flex gap-4 first:pt-0 last:pb-0">
                {news.featuredImage ? (
                  <img src={news.featuredImage} alt={getLocalizedText(news, 'headline', language)} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200 flex-shrink-0">
                    <span className="text-slate-400 font-bold text-[10px] text-center px-1">LIVE UP 18</span>
                  </div>
                )}
                <h4 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-3 text-sm">
                  {getLocalizedText(news, 'headline', language)}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
}

import { RefreshCw, TrendingUp, Globe, Activity, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface NewsItem {
  title: string; link: string; pubDate: string; source: string;
}

export function About() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const sources = [
        'https://api.rss2json.com/v1/api.json?rss_url=https://www.ft.com/?format=rss',
        'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bloomberg.com/markets/news.rss'
      ];
      const responses = await Promise.all(sources.map(s => fetch(s).catch(() => null)));
      const data = await Promise.all(responses.map(r => r ? r.json() : { status: 'error' }));
      const combined: NewsItem[] = [];
      data.forEach((d, idx) => {
        if (d.status === 'ok') {
          const source = idx === 0 ? 'Financial Times' : 'Bloomberg';
          combined.push(...d.items.slice(0, 5).map((item: any) => ({ ...item, source })));
        }
      });
      combined.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setNews(combined);
    } catch (e) { console.error('Failed to fetch news', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: 'Risk Guard', desc: 'Secure mapping' },
    { icon: <Zap className="w-6 h-6" />, title: 'Real-time', desc: 'Live feeds' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Institutional', desc: 'Pro metrics' },
    { icon: <Activity className="w-6 h-6" />, title: 'Dynamic', desc: 'Volatility' },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left: Overview */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <p className="font-mono text-[var(--accent)] text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-black opacity-80 mb-2">// PROTOCOL_REVISED_v3</p>
              <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                Secure<br/>Your <span className="text-[var(--accent)]">Legacy</span>
              </h1>
              <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3 leading-relaxed max-w-xs font-medium">
                Institutional clarity through professional metrics and live market tracking.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={i} className="p-4 sm:p-5 flex flex-col gap-3 bg-[var(--bg-base)] border border-[var(--border)] rounded hover:border-[var(--accent)] transition-all">
                  <div className="text-[var(--accent)]">{f.icon}</div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{f.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded">
              <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)] mb-2 flex items-center gap-2 uppercase tracking-[0.15em]">
                <RefreshCw className="w-3.5 h-3.5 text-[var(--accent)]" /> Technical Core
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Standard Deviation monitoring and Portfolio Variance calculations built-in.
              </p>
            </div>
          </section>

          {/* Right: News Feed */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-black text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-[0.25em]">
                <Activity className="w-4 h-4 text-[var(--success)] animate-pulse" /> Live_Intelligence_Stream
              </h2>
              <button onClick={fetchNews} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all p-1">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="relative flex-1 min-h-[300px] sm:min-h-[360px] overflow-hidden bg-[var(--bg-base)] rounded border border-[var(--border)]">
              <motion.div
                className="flex flex-col"
                initial={{ y: '0%' }}
                animate={loading || news.length === 0 ? {} : { y: ['0%', '-50%'] }}
                transition={{ duration: Math.max(news.length * 10, 40), ease: 'linear', repeat: Infinity }}
              >
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="px-4 py-4 border-b border-[var(--border)] animate-pulse">
                        <div className="h-2 bg-[var(--border)] rounded w-1/4 mb-2" />
                        <div className="h-3 bg-[var(--border)] rounded w-full" />
                      </div>
                    ))
                  : [...news, ...news].map((item, i) => (
                      <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-4 border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--accent)]/5 transition-all block group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest opacity-70">{item.source}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] line-clamp-2 transition-colors">
                          {item.title.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")}
                        </h3>
                      </a>
                    ))
                }
              </motion.div>
              <div className="absolute bottom-2 right-2 text-[8px] font-black text-[var(--accent)] uppercase tracking-[0.3em] opacity-30">INSTITUTIONAL_FEED</div>
            </div>

            <div className="flex justify-center pt-1">
              <Link to="/signup" className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-base)] rounded font-black text-xs sm:text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-md">
                Register Account
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

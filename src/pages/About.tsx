import { RefreshCw, TrendingUp, Globe, Activity, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'crypto' | 'markets' | 'economy';
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
      const combinedNews: NewsItem[] = [];
      data.forEach((d, idx) => {
        if (d.status === 'ok') {
          const source = idx === 0 ? 'Financial Times' : 'Bloomberg';
          combinedNews.push(...d.items.slice(0, 5).map((item: any) => ({ ...item, source, category: 'markets' as const })));
        }
      });
      combinedNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setNews(combinedNews);
    } catch (error) {
      console.error('Failed to fetch news', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const features = [
    { icon: <Shield className="w-5 h-5" />, title: 'Risk Guard', desc: 'Secure mapping' },
    { icon: <Zap className="w-5 h-5" />, title: 'Real-time', desc: 'Live feeds' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Institutional', desc: 'Pro metrics' },
    { icon: <Activity className="w-5 h-5" />, title: 'Dynamic', desc: 'Volatility' },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left: Overview */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded p-5 sm:p-6 flex flex-col gap-5">
            {/* Heading */}
            <div>
              <p className="font-mono text-[var(--accent)] text-[8px] uppercase tracking-[0.4em] font-black opacity-80 mb-1">// PROTOCOL_REVISED_v3</p>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                Secure <br/>Your <span className="text-[var(--accent)]">Legacy</span>
              </h1>
              <p className="text-[9px] text-[var(--text-muted)] mt-2 font-black uppercase tracking-widest leading-relaxed max-w-xs">
                Institutional clarity through professional metrics and live market tracking.
              </p>
            </div>

            {/* Feature grid — auto height, no stretching */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={i} className="p-3 sm:p-4 flex flex-col gap-3 bg-[var(--bg-base)] border border-[var(--border)] rounded hover:border-[var(--accent)] transition-all">
                  <div className="text-[var(--accent)]">{f.icon}</div>
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-tight text-[var(--text-primary)] leading-none">{f.title}</h4>
                    <p className="text-[8px] sm:text-[9px] text-[var(--text-muted)] uppercase font-bold opacity-60 mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Core */}
            <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded">
              <h4 className="text-[9px] font-black text-[var(--text-primary)] mb-1.5 flex items-center gap-2 uppercase tracking-[0.2em]">
                <RefreshCw className="w-3 h-3 text-[var(--accent)]" /> Technical Core
              </h4>
              <p className="text-[8px] sm:text-[9px] text-[var(--text-muted)] leading-relaxed font-black uppercase tracking-widest opacity-80">
                Standard Deviation monitoring and Portfolio Variance calculations built-in.
              </p>
            </div>
          </section>

          {/* Right: News Feed */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded p-5 sm:p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[8px] font-black text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-[0.3em]">
                <Activity className="w-3 h-3 text-[var(--success)] animate-pulse" /> Live_Intelligence_Stream
              </h2>
              <button onClick={fetchNews} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all p-1">
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Scrolling news — fixed height on all breakpoints */}
            <div className="relative h-[300px] sm:h-[360px] lg:h-[340px] overflow-hidden bg-[var(--bg-base)] rounded border border-[var(--border)]">
              <motion.div
                className="flex flex-col"
                initial={{ y: '0%' }}
                animate={loading || news.length === 0 ? {} : { y: ['0%', '-50%'] }}
                transition={{ duration: Math.max(news.length * 10, 40), ease: 'linear', repeat: Infinity }}
              >
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="px-3 py-3 border-b border-[var(--border)] animate-pulse">
                        <div className="h-1.5 bg-[var(--border)] rounded w-1/4 mb-2" />
                        <div className="h-2 bg-[var(--border)] rounded w-full" />
                      </div>
                    ))
                  : [...news, ...news].map((item, i) => (
                      <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-3 border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--accent)]/5 transition-all block group">
                        <div className="flex items-center justify-between mb-1 opacity-60">
                          <span className="text-[7px] font-black text-[var(--accent)] uppercase tracking-widest">{item.source}</span>
                          <span className="text-[7px] text-[var(--text-muted)] font-mono font-bold">
                            {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h3 className="text-[9px] font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] line-clamp-2 uppercase tracking-tight transition-colors">
                          {item.title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")}
                        </h3>
                      </a>
                    ))
                }
              </motion.div>
              <div className="absolute bottom-2 right-2 text-[7px] font-black text-[var(--accent)] uppercase tracking-[0.4em] opacity-30">INSTITUTIONAL_FEED</div>
            </div>

            <div className="flex justify-center pt-1">
              <Link to="/signup" className="px-8 py-2.5 bg-[var(--text-primary)] text-[var(--bg-base)] rounded font-black text-[9px] uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-md">
                Register Account
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

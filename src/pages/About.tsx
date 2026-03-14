import { ChevronRight, ExternalLink, RefreshCw, TrendingUp, Globe, Activity, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
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
          combinedNews.push(...d.items.slice(0, 5).map((item: any) => ({ ...item, source, category: 'markets' })));
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crypto': return <Activity className="w-3 h-3 text-[var(--warning)]" />;
      case 'markets': return <TrendingUp className="w-3 h-3 text-[var(--success)]" />;
      default: return <Globe className="w-3 h-3 text-[var(--accent)]" />;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 py-4 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full lg:min-h-0">

          {/* Left Section: Overview */}
          <section className="flex flex-col gap-4 bg-[var(--bg-surface)] p-6 rounded border border-[var(--border)] shadow-sm">
            <div className="space-y-2">
              <div className="space-y-0.5">
                <p className="font-mono text-[var(--accent)] text-[8px] uppercase tracking-[0.4em] font-black opacity-80">// PROTOCOL_REVISED_v3</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                  Secure <br/>Your <span className="text-[var(--accent)]">Legacy</span>
                </h1>
              </div>
              <p className="text-[8px] text-[var(--text-muted)] leading-relaxed max-w-sm font-black uppercase tracking-widest">
                Institutional clarity through professional metrics and live market tracking.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { icon: <Shield className="w-4 h-4" />, title: 'Risk Guard', desc: 'Secure mapping' },
                { icon: <Zap className="w-4 h-4" />, title: 'Real-time', desc: 'Live feeds' },
                { icon: <TrendingUp className="w-4 h-4" />, title: 'Institutional', desc: 'Pro metrics' },
                { icon: <Activity className="w-4 h-4" />, title: 'Dynamic', desc: 'Volatility' },
              ].map((feature, i) => (
                <div key={i} className="p-4 flex flex-col gap-2 bg-[var(--bg-base)] border border-[var(--border)] rounded hover:border-[var(--accent)] transition-all">
                  <div className="text-[var(--accent)]">{feature.icon}</div>
                  <div className="space-y-0.5">
                    <h4 className="text-[9px] font-black uppercase tracking-tight text-[var(--text-primary)] leading-none">{feature.title}</h4>
                    <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold opacity-60">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded">
              <h4 className="text-[8px] font-black text-[var(--text-primary)] mb-2 flex items-center gap-2 uppercase tracking-[0.2em]">
                <RefreshCw className="w-3 h-3 text-[var(--accent)]" /> Technical Core
              </h4>
              <p className="text-[8px] text-[var(--text-muted)] leading-relaxed font-black uppercase tracking-widest opacity-80">
                Standard Deviation monitoring and Portfolio Variance calculations built-in.
              </p>
            </div>
          </section>

          {/* Right Section: News Ticker */}
          <section className="flex flex-col gap-3 bg-[var(--bg-surface)] p-6 rounded border border-[var(--border)] shadow-sm min-h-[400px] lg:min-h-0">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[8px] font-black text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-[0.3em]">
                <Activity className="w-3 h-3 text-[var(--success)] animate-pulse" /> Live_Intelligence_Stream
              </h2>
              <button onClick={fetchNews} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="relative flex-1 min-h-[280px] overflow-hidden bg-[var(--bg-base)] rounded-md border border-[var(--border)]">
              <div className="h-full overflow-hidden relative">
                <motion.div
                  className="flex flex-col"
                  initial={{ y: "0%" }}
                  animate={loading || news.length === 0 ? {} : { y: ["0%", "-50%"] }}
                  transition={{ duration: Math.max(news.length * 10, 40), ease: "linear", repeat: Infinity }}
                  whileHover={{ animationPlayState: 'paused' }}
                >
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="px-3 py-3 border-b border-[var(--border)] animate-pulse">
                        <div className="h-1 bg-[var(--border)] rounded w-1/4 mb-1" />
                        <div className="h-2 bg-[var(--border)] rounded w-full" />
                      </div>
                    ))
                  ) : (
                    [...news, ...news].map((item, i) => (
                      <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="px-3 py-3 border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--accent)]/5 transition-all block group">
                        <div className="flex items-center justify-between mb-0.5 opacity-60">
                          <span className="text-[7px] font-black text-[var(--accent)] uppercase tracking-widest">{item.source}</span>
                          <span className="text-[7px] text-[var(--text-muted)] font-mono font-bold">
                            {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h3 className="text-[9px] font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] line-clamp-1 uppercase tracking-tight transition-colors">
                          {item.title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")}
                        </h3>
                      </a>
                    ))
                  )}
                </motion.div>
              </div>
              <div className="absolute bottom-1.5 right-1.5 text-[7px] font-black text-[var(--accent)] uppercase tracking-[0.4em] opacity-30">INSTITUTIONAL_FEED</div>
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

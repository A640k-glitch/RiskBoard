import { ChevronRight, ExternalLink, RefreshCw, TrendingUp, Globe, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
      // Fetch from multiple sources
      const [cryptoRes, marketsRes] = await Promise.all([
        fetch('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss'),
        fetch('https://api.rss2json.com/v1/api.json?rss_url=https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664')
      ]);

      const cryptoData = await cryptoRes.json();
      const marketsData = await marketsRes.json();

      const combinedNews: NewsItem[] = [];

      if (cryptoData.status === 'ok') {
        combinedNews.push(...cryptoData.items.slice(0, 4).map((item: any) => ({
          ...item,
          source: 'CoinTelegraph',
          category: 'crypto'
        })));
      }

      if (marketsData.status === 'ok') {
        combinedNews.push(...marketsData.items.slice(0, 4).map((item: any) => ({
          ...item,
          source: 'CNBC Markets',
          category: 'markets'
        })));
      }

      // Sort by date descending
      combinedNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      setNews(combinedNews);
    } catch (error) {
      console.error('Failed to fetch news', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crypto': return <Activity className="w-4 h-4 text-[var(--warning)]" />;
      case 'markets': return <TrendingUp className="w-4 h-4 text-[var(--success)]" />;
      default: return <Globe className="w-4 h-4 text-[var(--accent)]" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <p className="font-mono text-[var(--accent)] text-sm mb-4 uppercase tracking-widest">// Platform_Overview</p>
            <h1 className="text-4xl md:text-5xl font-bold font-sans text-[var(--text-primary)] mb-6 tracking-tight">
              Intelligence for the modern investor.
            </h1>
            <p className="text-[var(--text-muted)] font-sans leading-relaxed mb-12 text-lg">
              RiskBoard is built specifically for the dynamic landscape of modern investing. Whether you're a retail trader, a growing fund, or an independent contractor needing to understand market exposure, RiskBoard provides clarity through institutional-grade risk metrics and real-time data.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans">
              <div className="apple-card p-10 hover:-translate-y-2 transition-all duration-500 hover:shadow-xl border border-[var(--border)]/50">
                <h3 className="text-[var(--text-primary)] font-bold mb-4 text-xl">Retail Investors</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-lg">Track your personal exposure across multiple asset classes.</p>
              </div>
              <div className="apple-card p-10 hover:-translate-y-2 transition-all duration-500 hover:shadow-xl border border-[var(--border)]/50">
                <h3 className="text-[var(--text-primary)] font-bold mb-4 text-xl">Crypto Enthusiasts</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-lg">Monitor high-volatility assets with precision.</p>
              </div>
              <div className="apple-card p-10 hover:-translate-y-2 transition-all duration-500 hover:shadow-xl border border-[var(--border)]/50">
                <h3 className="text-[var(--text-primary)] font-bold mb-4 text-xl">Portfolio Managers</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-lg">Analyze Sharpe ratios and maximum drawdowns.</p>
              </div>
              <div className="apple-card p-10 hover:-translate-y-2 transition-all duration-500 hover:shadow-xl border border-[var(--border)]/50">
                <h3 className="text-[var(--text-primary)] font-bold mb-4 text-xl">Financial Analysts</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-lg">Leverage real-time pricing and historical volatility.</p>
              </div>
            </div>
          </div>

          <div className="apple-card p-16 relative overflow-hidden flex flex-col justify-center shadow-2xl border border-[var(--border)]/50">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--accent)] via-[var(--success)] to-[var(--accent)] opacity-80" />
            
            <p className="font-mono text-[var(--accent)] text-sm mb-8 uppercase tracking-[0.3em] opacity-80">// Execution_Flow</p>
            <h2 className="text-4xl font-bold font-sans text-[var(--text-primary)] mb-12 tracking-tight">
              How to use the platform
            </h2>

            <div className="space-y-12 font-sans">
              <div className="flex gap-8 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-elevated)] text-[var(--accent)] flex items-center justify-center font-bold text-xl shrink-0 shadow-md border border-[var(--border)] group-hover:scale-110 transition-transform duration-500">1</div>
                <div>
                  <h3 className="text-[var(--text-primary)] font-bold mb-3 text-2xl">Authenticate</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed text-lg">Sign in securely via OAuth to create your private workspace.</p>
                </div>
              </div>
              
              <div className="flex gap-8 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-elevated)] text-[var(--accent)] flex items-center justify-center font-bold text-xl shrink-0 shadow-md border border-[var(--border)] group-hover:scale-110 transition-transform duration-500">2</div>
                <div>
                  <h3 className="text-[var(--text-primary)] font-bold mb-3 text-2xl">Configure Portfolio</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed text-lg">Add your assets (stocks, crypto, ETFs) and quantities.</p>
                </div>
              </div>

              <div className="flex gap-8 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-elevated)] text-[var(--accent)] flex items-center justify-center font-bold text-xl shrink-0 shadow-md border border-[var(--border)] group-hover:scale-110 transition-transform duration-500">3</div>
                <div>
                  <h3 className="text-[var(--text-primary)] font-bold mb-3 text-2xl">Track Risk</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed text-lg">Follow your custom-generated risk metrics and P&L.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-[var(--border)] pb-6">
            <div>
              <p className="font-mono text-[var(--accent)] text-sm mb-2 uppercase tracking-widest">// Market_Intelligence</p>
              <h2 className="text-3xl font-bold font-sans text-[var(--text-primary)]">Daily Market Briefs</h2>
              <p className="text-[var(--text-muted)] mt-2 max-w-2xl">Curated insights and real-time updates across global equities, digital assets, and macroeconomic trends. Synced directly from top financial sources.</p>
            </div>
            <button 
              onClick={fetchNews}
              disabled={loading}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm font-mono bg-[var(--bg-surface)] px-4 py-2 rounded-full border border-[var(--border)] hover:bg-[var(--bg-elevated)]"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="apple-card p-12 min-h-[360px] animate-pulse flex flex-col shadow-sm border border-[var(--border)]/50">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-14 h-14 bg-[var(--bg-elevated)] rounded-2xl" />
                    <div className="h-6 bg-[var(--bg-elevated)] rounded w-48" />
                  </div>
                  <div className="h-10 bg-[var(--bg-elevated)] rounded w-full mb-6" />
                  <div className="h-10 bg-[var(--bg-elevated)] rounded w-3/4 mb-10" />
                  <div className="space-y-5 mt-auto">
                    <div className="h-6 bg-[var(--bg-elevated)] rounded w-full" />
                    <div className="h-6 bg-[var(--bg-elevated)] rounded w-full" />
                    <div className="h-6 bg-[var(--bg-elevated)] rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : (
              news.map((item, i) => (
                <a 
                  key={i} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="apple-card p-12 flex flex-col group hover:border-[var(--accent)] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden border border-[var(--border)]/50"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border)] shadow-sm group-hover:scale-110 transition-transform duration-500">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <span className="text-lg font-bold text-[var(--text-primary)] block">{item.source}</span>
                        <span className="text-sm font-mono text-[var(--text-muted)] opacity-80">
                          {new Date(item.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-6 h-6 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-6 leading-tight group-hover:text-[var(--accent)] transition-colors duration-300 font-sans tracking-tight">
                    {item.title}
                  </h3>
                  
                  <div className="prose prose-base dark:prose-invert max-w-none text-[var(--text-muted)] leading-relaxed mt-auto font-sans text-lg">
                    <div 
                      className="line-clamp-4"
                      dangerouslySetInnerHTML={{ __html: item.description.replace(/<img[^>]*>/g, '').replace(/<a[^>]*>.*?<\/a>/g, '') }}
                    />
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-[var(--border)]/50 flex items-center justify-between">
                    <span className="text-sm font-mono text-[var(--accent)] uppercase tracking-[0.2em] font-bold opacity-80">
                      // Read_Analysis
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors duration-500">
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--bg-base)] transition-colors duration-500" />
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23888888' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <p className="font-mono text-[var(--accent)] text-sm mb-6 uppercase tracking-widest">// EOF</p>
          <h2 className="text-5xl font-bold font-sans text-[var(--text-primary)] mb-8 tracking-tight">
            Ready to secure your portfolio?
          </h2>
          <p className="text-[var(--text-muted)] mb-12 text-xl leading-relaxed">
            Join thousands of modern investors who trust RiskBoard for their daily analytics and risk management.
          </p>
          <Link 
            to="/signup"
            className="inline-flex items-center gap-3 bg-[var(--accent)] text-[var(--bg-base)] px-10 py-5 rounded-2xl font-sans font-bold hover:opacity-90 transition-all hover:shadow-xl hover:-translate-y-1 text-lg shadow-lg shadow-[var(--accent)]/20"
          >
            Execute Signup <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}

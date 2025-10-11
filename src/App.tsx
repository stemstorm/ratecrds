import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Shield, Zap, Star, Search, Filter } from 'lucide-react';
import { supabase, Celebrity, RateCard, Category } from './lib/supabase';
import { seedDatabase } from './lib/seed-data';
import { CelebrityCard } from './components/CelebrityCard';
import { BookingModal } from './components/BookingModal';

function App() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [rateCardsMap, setRateCardsMap] = useState<Record<string, RateCard[]>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCelebrity, setSelectedCelebrity] = useState<{
    celebrity: Celebrity;
    rateCards: RateCard[];
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      await seedDatabase();

      const [{ data: categoriesData }, { data: celebsData }, { data: rateCardsData }] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('celebrities').select('*, category:categories(*)').order('trending_score', { ascending: false }),
        supabase.from('rate_cards').select('*').eq('active', true)
      ]);

      if (categoriesData) setCategories(categoriesData);
      if (celebsData) setCelebrities(celebsData);

      if (rateCardsData) {
        const grouped = rateCardsData.reduce((acc, card) => {
          if (!acc[card.celebrity_id]) {
            acc[card.celebrity_id] = [];
          }
          acc[card.celebrity_id].push(card);
          return acc;
        }, {} as Record<string, RateCard[]>);
        setRateCardsMap(grouped);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCelebrities = celebrities.filter(celeb => {
    const matchesCategory = selectedCategory === 'all' || celeb.category_id === selectedCategory;
    const matchesSearch = celeb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         celeb.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trendingCelebrities = celebrities
    .filter(c => c.trending_score >= 90)
    .sort((a, b) => b.trending_score - a.trending_score)
    .slice(0, 3);

  const handleBookNow = (celebrity: Celebrity, _rateCard: RateCard) => {
    setSelectedCelebrity({
      celebrity,
      rateCards: rateCardsMap[celebrity.id] || []
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading talent marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg">
                <Sparkles className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  TalentRates
                </h1>
                <p className="text-xs text-gray-600">Transparent Celebrity Bookings</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                For Brands
              </button>
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm">
                For Talent
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">1000+ verified celebrities | $50M+ in bookings</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Book Verified Talent
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                With Transparent Rates
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              The marketplace where brands discover celebrity rates, compare engagement insights, and book authentic collaborations instantly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Explore Talent
              </button>
              <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-200">
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Shield className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Profiles</h3>
            <p className="text-gray-600 leading-relaxed">
              Every celebrity profile is verified with authentic engagement metrics and transparent pricing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Zap className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
            <p className="text-gray-600 leading-relaxed">
              Submit booking requests directly through the platform and get responses within 24-48 hours.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Star className="text-orange-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              View actual follower counts, engagement rates, and trending scores to make informed decisions.
            </p>
          </div>
        </div>

        {trendingCelebrities.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {trendingCelebrities.map((celeb) => (
                <CelebrityCard
                  key={celeb.id}
                  celebrity={celeb}
                  rateCards={rateCardsMap[celeb.id] || []}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Talent</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm cursor-pointer min-w-[200px]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCelebrities.map((celeb) => (
            <CelebrityCard
              key={celeb.id}
              celebrity={celeb}
              rateCards={rateCardsMap[celeb.id] || []}
              onBookNow={handleBookNow}
            />
          ))}
        </div>

        {filteredCelebrities.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No talent found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Sparkles className="text-white" size={20} />
                </div>
                <span className="font-bold text-white text-lg">TalentRates</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                The transparent marketplace for celebrity collaborations and brand partnerships.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">For Brands</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Browse Talent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">For Talent</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Join Platform</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Verification</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 TalentRates. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {selectedCelebrity && (
        <BookingModal
          celebrity={selectedCelebrity.celebrity}
          rateCards={selectedCelebrity.rateCards}
          onClose={() => setSelectedCelebrity(null)}
        />
      )}
    </div>
  );
}

export default App;

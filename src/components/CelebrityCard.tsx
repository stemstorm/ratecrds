import { BadgeCheck, Users, TrendingUp } from 'lucide-react';
import { Celebrity, RateCard } from '../lib/supabase';

interface CelebrityCardProps {
  celebrity: Celebrity;
  rateCards: RateCard[];
  onBookNow: (celebrity: Celebrity, rateCard: RateCard) => void;
}

export function CelebrityCard({ celebrity, rateCards, onBookNow }: CelebrityCardProps) {
  const lowestRate = Math.min(...rateCards.map(r => r.price));
  const highestRate = Math.max(...rateCards.map(r => r.price));

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src={celebrity.avatar_url}
          alt={celebrity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {celebrity.verified && (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-lg">
              <BadgeCheck size={16} />
              Verified
            </div>
          )}
          {celebrity.trending_score >= 90 && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-lg">
              <TrendingUp size={16} />
              Trending
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{celebrity.name}</h3>
            <p className="text-gray-600 text-sm">{celebrity.bio}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={18} className="text-blue-500" />
            <span className="text-sm font-medium">{formatFollowers(celebrity.followers)} followers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <TrendingUp size={18} className="text-green-500" />
            <span className="text-sm font-medium">{celebrity.engagement_rate}% engagement</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Rate Range</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(lowestRate)}</span>
              {lowestRate !== highestRate && (
                <span className="text-sm text-gray-500"> - {formatPrice(highestRate)}</span>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {rateCards.slice(0, 2).map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{card.service_type}</p>
                  <p className="text-xs text-gray-500">{card.duration}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatPrice(card.price)}</span>
              </div>
            ))}
          </div>

          {rateCards.length > 2 && (
            <p className="text-xs text-gray-500 text-center mb-3">
              +{rateCards.length - 2} more service{rateCards.length - 2 !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <button
          onClick={() => onBookNow(celebrity, rateCards[0])}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          View Full Rate Card
        </button>
      </div>
    </div>
  );
}

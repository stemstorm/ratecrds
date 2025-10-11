import { useState } from 'react';
import { X, BadgeCheck, Calendar, DollarSign, Clock } from 'lucide-react';
import { Celebrity, RateCard, supabase } from '../lib/supabase';

interface BookingModalProps {
  celebrity: Celebrity;
  rateCards: RateCard[];
  selectedRateCard?: RateCard;
  onClose: () => void;
}

export function BookingModal({ celebrity, rateCards, selectedRateCard, onClose }: BookingModalProps) {
  const [selectedCard, setSelectedCard] = useState<RateCard | undefined>(selectedRateCard);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_company: '',
    booking_date: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        celebrity_id: celebrity.id,
        rate_card_id: selectedCard.id,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_company: formData.client_company,
        booking_date: formData.booking_date,
        message: formData.message,
        total_amount: selectedCard.price,
        status: 'pending'
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <img
              src={celebrity.avatar_url}
              alt={celebrity.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{celebrity.name}</h2>
                {celebrity.verified && <BadgeCheck size={20} className="text-blue-500" />}
              </div>
              <p className="text-sm text-gray-600">Book Your Collaboration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BadgeCheck size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Submitted!</h3>
            <p className="text-gray-600">
              The talent team will review your request and get back to you within 24-48 hours.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Service</h3>
                <div className="space-y-3">
                  {rateCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedCard?.id === card.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-gray-900">{card.service_type}</span>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(card.price)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} />
                        {card.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Information</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.client_company}
                      onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.booking_date}
                        onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Details
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us about your project, goals, and any specific requirements..."
                    />
                  </div>

                  {selectedCard && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Total Amount</span>
                        <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                          <DollarSign size={20} />
                          {formatPrice(selectedCard.price)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Final pricing may vary based on specific requirements
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedCard || loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Booking Request'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to our terms and conditions. No payment required upfront.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

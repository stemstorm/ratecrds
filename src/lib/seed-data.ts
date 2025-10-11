import { supabase } from './supabase';

export async function seedDatabase() {
  const { data: existingCelebs } = await supabase
    .from('celebrities')
    .select('id')
    .limit(1);

  if (existingCelebs && existingCelebs.length > 0) {
    return;
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .in('name', ['Music', 'Sports', 'Acting', 'Fashion', 'Gaming', 'Business']);

  if (!categories || categories.length === 0) {
    return;
  }

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  const celebs = [
    {
      name: 'Maya Rivers',
      slug: 'maya-rivers',
      bio: 'Grammy-nominated singer & songwriter. Global brand ambassador.',
      avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      category_id: categoryMap['Music'],
      verified: true,
      followers: 8500000,
      engagement_rate: 12.5,
      trending_score: 95
    },
    {
      name: 'Jake Anderson',
      slug: 'jake-anderson',
      bio: 'Professional athlete & Olympic medalist. Fitness brand partner.',
      avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      category_id: categoryMap['Sports'],
      verified: true,
      followers: 6200000,
      engagement_rate: 9.8,
      trending_score: 88
    },
    {
      name: 'Sofia Chen',
      slug: 'sofia-chen',
      bio: 'Award-winning actress & producer. Fashion icon.',
      avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      category_id: categoryMap['Acting'],
      verified: true,
      followers: 12000000,
      engagement_rate: 15.2,
      trending_score: 92
    },
    {
      name: 'Aria Knight',
      slug: 'aria-knight',
      bio: 'International supermodel & creative director. Runway veteran.',
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      category_id: categoryMap['Fashion'],
      verified: true,
      followers: 9800000,
      engagement_rate: 13.7,
      trending_score: 90
    },
    {
      name: 'Tyler Storm',
      slug: 'tyler-storm',
      bio: 'Pro gamer & Twitch streamer. Esports champion.',
      avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      category_id: categoryMap['Gaming'],
      verified: true,
      followers: 4500000,
      engagement_rate: 18.3,
      trending_score: 85
    },
    {
      name: 'Luna Park',
      slug: 'luna-park',
      bio: 'Chart-topping pop artist & social media sensation.',
      avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      category_id: categoryMap['Music'],
      verified: true,
      followers: 15000000,
      engagement_rate: 16.9,
      trending_score: 98
    }
  ];

  const { data: insertedCelebs, error: celebError } = await supabase
    .from('celebrities')
    .insert(celebs)
    .select();

  if (celebError || !insertedCelebs) {
    console.error('Error inserting celebrities:', celebError);
    return;
  }

  const rateCards = [
    { celebrity_slug: 'maya-rivers', service_type: 'Instagram Post', description: 'Dedicated sponsored post on main feed with brand integration', price: 75000, duration: '1 post' },
    { celebrity_slug: 'maya-rivers', service_type: 'Event Appearance', description: 'Live performance or meet & greet at brand event', price: 250000, duration: '2-4 hours' },
    { celebrity_slug: 'maya-rivers', service_type: 'Brand Campaign', description: 'Multi-platform campaign including stories, reels, and posts', price: 500000, duration: '30 days' },
    { celebrity_slug: 'jake-anderson', service_type: 'Instagram Post', description: 'Fitness or sports product endorsement post', price: 50000, duration: '1 post' },
    { celebrity_slug: 'jake-anderson', service_type: 'Event Appearance', description: 'Sports event hosting or brand activation', price: 180000, duration: '3-5 hours' },
    { celebrity_slug: 'jake-anderson', service_type: 'Training Session', description: 'Exclusive training session with brand promotion', price: 120000, duration: '1 day' },
    { celebrity_slug: 'sofia-chen', service_type: 'Instagram Post', description: 'Fashion or lifestyle brand sponsored content', price: 95000, duration: '1 post' },
    { celebrity_slug: 'sofia-chen', service_type: 'Event Appearance', description: 'Red carpet or premiere event attendance', price: 300000, duration: '2-3 hours' },
    { celebrity_slug: 'sofia-chen', service_type: 'Brand Ambassador', description: 'Quarterly campaign as face of brand', price: 1200000, duration: '90 days' },
    { celebrity_slug: 'aria-knight', service_type: 'Instagram Post', description: 'High-fashion product showcase and styling', price: 80000, duration: '1 post' },
    { celebrity_slug: 'aria-knight', service_type: 'Runway Show', description: 'Fashion week runway appearance', price: 150000, duration: '1 show' },
    { celebrity_slug: 'aria-knight', service_type: 'Creative Direction', description: 'Campaign concept and creative consultation', price: 200000, duration: '1 project' },
    { celebrity_slug: 'tyler-storm', service_type: 'Twitch Stream', description: 'Sponsored gaming stream with product integration', price: 35000, duration: '4 hours' },
    { celebrity_slug: 'tyler-storm', service_type: 'Tournament Appearance', description: 'Gaming tournament hosting or participation', price: 100000, duration: '1 event' },
    { celebrity_slug: 'tyler-storm', service_type: 'YouTube Video', description: 'Dedicated product review or sponsored gameplay', price: 45000, duration: '1 video' },
    { celebrity_slug: 'luna-park', service_type: 'TikTok Feature', description: 'Viral challenge or sponsored TikTok content', price: 85000, duration: '1-3 videos' },
    { celebrity_slug: 'luna-park', service_type: 'Concert Performance', description: 'Festival or private event live performance', price: 400000, duration: '45-60 min' },
    { celebrity_slug: 'luna-park', service_type: 'Social Campaign', description: 'Cross-platform promotional campaign', price: 600000, duration: '30 days' }
  ];

  const rateCardsToInsert = rateCards.map(rc => {
    const celeb = insertedCelebs.find(c => c.slug === rc.celebrity_slug);
    if (!celeb) return null;
    return {
      celebrity_id: celeb.id,
      service_type: rc.service_type,
      description: rc.description,
      price: rc.price,
      duration: rc.duration,
      active: true
    };
  }).filter(Boolean);

  await supabase.from('rate_cards').insert(rateCardsToInsert);
}

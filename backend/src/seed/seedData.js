const profiles = [
  {
    name: 'Maya Lin',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Architecture student at Columbia. Spending 80% of my time making models and the other 20% looking for iced matcha lattes.',
    cityOrCollege: 'Columbia University, NYC',
    interests: ['Architecture', 'Film Photography', 'Matcha', 'Museums'],
    hasLikedDemoUser: true
  },
  {
    name: 'Julian Vance',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Software engineer by day, indie film nerd by night. Always down for late-night ramen runs and vinyl hunting.',
    cityOrCollege: 'NYU, Brooklyn',
    interests: ['Indie Rock', 'Ramen', 'A24', 'Vinyl Records'],
    hasLikedDemoUser: false
  },
  {
    name: 'Sophia Patel',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Pre-med senior at UCLA. If we match, you have to tell me your most controversial food opinion.',
    cityOrCollege: 'UCLA, Los Angeles',
    interests: ['Medicine', 'Bouldering', 'Boba', 'Sunset Walks'],
    hasLikedDemoUser: true
  },
  {
    name: 'Leo Morales',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Product designer & marathon trainee. Looking for someone who can match my energy and debate typography.',
    cityOrCollege: 'Austin, TX',
    interests: ['Running', 'Design', 'Coffee', 'House Music'],
    hasLikedDemoUser: false
  },
  {
    name: 'Chloe Dubois',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Literature & creative writing at UC Berkeley. Probably reading three books at once right now.',
    cityOrCollege: 'UC Berkeley, CA',
    interests: ['Poetry', 'Vintage Books', 'Tea', 'Art Galleries'],
    hasLikedDemoUser: true
  },
  {
    name: 'Marcus Chen',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Mechanical engineering @ Georgia Tech. I build drones and bake sourdough. Looking for my co-pilot.',
    cityOrCollege: 'Georgia Tech, Atlanta',
    interests: ['Robotics', 'Sourdough', 'Hiking', 'Board Games'],
    hasLikedDemoUser: false
  },
  {
    name: 'Zoe Kravitz',
    age: 20,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Film & television student at USC. Let’s recreate dramatic movie scenes at 2 AM in an empty parking lot.',
    cityOrCollege: 'USC, Los Angeles',
    interests: ['Cinema', 'Screenwriting', 'Thrifting', 'Tacos'],
    hasLikedDemoUser: true
  },
  {
    name: 'Daniel Kim',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Jazz trumpet player & data analyst. Can cook a mean carbonara from scratch. Tell me your favorite album.',
    cityOrCollege: 'Boston University, MA',
    interests: ['Jazz', 'Cooking', 'Analytics', 'Live Music'],
    hasLikedDemoUser: false
  },
  {
    name: 'Elena Rostova',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Environmental science at UW Seattle. Rain enthusiast, plant mom to 17 houseplants, and amateur ceramicist.',
    cityOrCollege: 'University of Washington, Seattle',
    interests: ['Pottery', 'Plants', 'Camping', 'Sustainability'],
    hasLikedDemoUser: true
  },
  {
    name: 'Tariq Al-Mansoor',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    bio: 'Grad student studying urban planning. Obsessed with walkable cities, street food, and pickup soccer.',
    cityOrCollege: 'University of Chicago, IL',
    interests: ['Urbanism', 'Soccer', 'Street Food', 'Cycling'],
    hasLikedDemoUser: false
  },
  {
    name: 'Aria Montgomery',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Journalism major @ Northwestern. Seeking someone witty who can survive my sarcastic remarks.',
    cityOrCollege: 'Northwestern University, Evanston',
    interests: ['Podcasts', 'True Crime', 'Coffee', 'Newspapers'],
    hasLikedDemoUser: true
  },
  {
    name: 'Lucas Silva',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Exchange student from São Paulo studying business at Penn. Big on bossa nova and beach volleyball.',
    cityOrCollege: 'UPenn, Philadelphia',
    interests: ['Bossa Nova', 'Volleyball', 'Travel', 'Espresso'],
    hasLikedDemoUser: false
  },
  {
    name: 'Nadia Thorne',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1534751516642-a171edd275b2?auto=format&fit=crop&w=800&q=80',
    bio: 'Graphic designer & illustrator. My dog thinks I am a genius. Let’s trade music playlists.',
    cityOrCollege: 'RISD, Providence',
    interests: ['Illustration', 'Dogs', 'Typography', 'Indie Pop'],
    hasLikedDemoUser: true
  },
  {
    name: 'Kevin O’Connor',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80',
    bio: 'Finance analyst trying to live a balanced life. Surfing at dawn, spreadsheet wizard by 9 AM.',
    cityOrCollege: 'San Diego, CA',
    interests: ['Surfing', 'Economics', 'Craft Beer', 'Fitness'],
    hasLikedDemoUser: false
  },
  {
    name: 'Hannah Becker',
    age: 20,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Cognitive science at Stanford. Curious about human behavior and AI ethics. Also really good at Mario Kart.',
    cityOrCollege: 'Stanford University, Palo Alto',
    interests: ['AI Ethics', 'Mario Kart', 'Biking', 'Scones'],
    hasLikedDemoUser: true
  },
  {
    name: 'Rohan Sharma',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Biotech researcher at Johns Hopkins. Trying to cure diseases and find the best street tacos in the city.',
    cityOrCollege: 'Johns Hopkins, Baltimore',
    interests: ['Biotech', 'Tacos', 'Rock Climbing', 'Sci-Fi'],
    hasLikedDemoUser: false
  },
  {
    name: 'Isabella Rossi',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Art history major @ NYU. Can spend 4 hours in the Met without getting bored. Always looking for cannoli.',
    cityOrCollege: 'NYU, Manhattan',
    interests: ['Fine Art', 'Museums', 'Italian Food', 'Photography'],
    hasLikedDemoUser: true
  },
  {
    name: 'Samir Ghosh',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Economics & statistics @ Cornell. Avid chess player and aspiring home chef. Rated 1800 on Chess.com.',
    cityOrCollege: 'Cornell University, Ithaca',
    interests: ['Chess', 'Culinary Arts', 'Statistics', 'Snowboarding'],
    hasLikedDemoUser: false
  },
  {
    name: 'Camila Santos',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Dance & theatre performance major at Florida State. High energy, good vibes only, loves late-night diners.',
    cityOrCollege: 'FSU, Tallahassee',
    interests: ['Contemporary Dance', 'Musical Theatre', 'Diners', 'Karaoke'],
    hasLikedDemoUser: true
  },
  {
    name: 'Liam Gallagher',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Sound engineer and guitarist. Let’s grab a cider and talk about 90s shoegaze bands.',
    cityOrCollege: 'Austin, TX',
    interests: ['Guitar', 'Audio Engineering', 'Live Gigs', 'Vintage Gear'],
    hasLikedDemoUser: false
  },
  {
    name: 'Mei Tanaka',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Psychology student & barista. I can read your personality based on your exact coffee order.',
    cityOrCollege: 'University of Toronto, Canada',
    interests: ['Latte Art', 'Psychology', 'Watercolor', 'Cats'],
    hasLikedDemoUser: true
  },
  {
    name: 'Ethan Brooks',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Civil engineering graduate student. Into trail running, national parks, and building things that last.',
    cityOrCollege: 'CU Boulder, Colorado',
    interests: ['Trail Running', 'National Parks', 'Woodworking', 'Stargazing'],
    hasLikedDemoUser: false
  },
  {
    name: 'Chloe Zhang',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Computer science & math @ Waterloo. Hacker by day, baker of gourmet cookies by night.',
    cityOrCollege: 'University of Waterloo, ON',
    interests: ['Coding', 'Baking', 'Board Games', 'Pickleball'],
    hasLikedDemoUser: true
  },
  {
    name: 'Mateo Hernandez',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    bio: 'Film photographer and barista. Can show you all the hidden rooftop views in the city.',
    cityOrCollege: 'Miami, FL',
    interests: ['Street Photography', 'Cuban Coffee', 'Skateboarding', 'Synthwave'],
    hasLikedDemoUser: false
  },
  {
    name: 'Olivia Sterling',
    age: 20,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Fashion merchandising student at FIT. Thrift store enthusiast with an unhealthy jacket collection.',
    cityOrCollege: 'FIT, New York City',
    interests: ['Fashion', 'Thrifting', 'Flea Markets', 'Matcha'],
    hasLikedDemoUser: true
  },
  {
    name: 'Noah Williams',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Kinesiology student & personal trainer. Here to motivate you or just eat pizza together guilt-free.',
    cityOrCollege: 'Ohio State, Columbus',
    interests: ['Weightlifting', 'Nutrition', 'Dogs', 'Pizza'],
    hasLikedDemoUser: false
  },
  {
    name: 'Tara Alvi',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1534751516642-a171edd275b2?auto=format&fit=crop&w=800&q=80',
    bio: 'Law student at Georgetown. Passionate about civil liberties, iced chai, and long walks along the Potomac.',
    cityOrCollege: 'Georgetown, Washington DC',
    interests: ['Debate', 'Chai', 'Podcasts', 'Museums'],
    hasLikedDemoUser: true
  },
  {
    name: 'Owen Fletcher',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Music production student. In search of the warmest analog synth tones and someone who likes spontaneous road trips.',
    cityOrCollege: 'Nashville, TN',
    interests: ['Synthesizers', 'Vinyl', 'Road Trips', 'Barbecue'],
    hasLikedDemoUser: false
  },
  {
    name: 'Priya Nambiar',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Data science senior at Carnegie Mellon. I turn messy data into nice charts and bake cinnamon rolls on weekends.',
    cityOrCollege: 'Carnegie Mellon, Pittsburgh',
    interests: ['Machine Learning', 'Baking', 'Badminton', 'Sci-Fi'],
    hasLikedDemoUser: true
  },
  {
    name: 'Lucas Wright',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80',
    bio: 'Marine biology researcher. Always happiest near the ocean. Ask me about bioluminescent plankton.',
    cityOrCollege: 'UC Santa Barbara, CA',
    interests: ['Scuba Diving', 'Ocean Conservation', 'Surfing', 'Campfires'],
    hasLikedDemoUser: false
  },
  {
    name: 'Sara Lindqvist',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Exchange student from Stockholm studying international relations. Love minimalist design and fika.',
    cityOrCollege: 'McGill University, Montreal',
    interests: ['Minimalism', 'Fika', 'Skiing', 'Foreign Films'],
    hasLikedDemoUser: true
  },
  {
    name: 'Gabriel Costa',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Culinary arts graduate student. Tell me your favorite childhood meal and I’ll elevate it.',
    cityOrCollege: 'San Francisco, CA',
    interests: ['Gastronomy', 'Wine Pairing', 'Farmers Markets', 'Cycling'],
    hasLikedDemoUser: false
  }
];

module.exports = { profiles };

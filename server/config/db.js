const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Check env file variables or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsharing';
const DATA_DIR = path.join(__dirname, '..', 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'local_db.json');

let dbType = 'json'; // default to json fallback

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Function to initialize MongoDB connection with timeout
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // We try to connect with a 3-second timeout
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    dbType = 'mongo';
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.warn('MongoDB connection failed. Falling back to JSON database.');
    dbType = 'json';
    initializeJsonDb();
  }
};

// Seed Mock Data for JSON Database
const getInitialMockData = () => {
  // Passwords are plain text in seed, but we will support comparing bcrypt hashes or simple password comparisons
  // For the demonstration, we'll hash these passwords using a mock or simple bcrypt.
  // Using simple helper so it works out of the box.
  return {
    users: [
      {
        id: "admin-1",
        name: "Ramesh Kumar",
        email: "admin@skillsharing.org",
        password: "$2a$10$T8Pq4VskRk1yv0u8Hk.6EuxL8g9xXmC9P3g6W4dGbeGf5wM3K3L8K", // hashed 'admin123'
        phone: "9876543210",
        role: "admin",
        village: "Kavitam",
        isVerified: true
      },
      {
        id: "trainer-1",
        name: "Satyanarayana Murthy",
        email: "satya.farmer@gmail.com",
        password: "$2a$10$T8Pq4VskRk1yv0u8Hk.6EuxL8g9xXmC9P3g6W4dGbeGf5wM3K3L8K", // hashed 'admin123'
        phone: "8765432109",
        role: "trainer",
        village: "Penugonda",
        skills: ["Farming Techniques", "Organic Farming"],
        experience: "15",
        languages: ["Telugu", "English"],
        timings: "Morning (6:00 AM - 10:00 AM)",
        fee: "Free",
        bio: "Experienced farmer specializing in natural organic farming techniques, crop rotation, and water-efficient irrigation.",
        photo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=200",
        rating: 4.8,
        isVerified: true,
        reviews: [
          { learnerName: "Kalyan Raju", rating: 5, text: "Excellent guidance on natural pesticides! Saved my paddy crops." }
        ]
      },
      {
        id: "trainer-2",
        name: "Saraswathi Devi",
        email: "saraswathi.tailor@gmail.com",
        password: "$2a$10$T8Pq4VskRk1yv0u8Hk.6EuxL8g9xXmC9P3g6W4dGbeGf5wM3K3L8K", // hashed 'admin123'
        phone: "7654321098",
        role: "trainer",
        village: "Kavitam",
        skills: ["Tailoring", "Handicrafts"],
        experience: "8",
        languages: ["Telugu"],
        timings: "Afternoon (2:00 PM - 5:00 PM)",
        fee: "₹200 per course",
        bio: "Expert tailor specialized in traditional Telugu apparel, modern blouse stitching, and handcrafted embroidery design work.",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        rating: 4.9,
        isVerified: true,
        reviews: [
          { learnerName: "Sravani", rating: 5, text: "Saraswathi is very patient. I learned tailoring in 1 month!" }
        ]
      },
      {
        id: "trainer-3",
        name: "Anand Rao",
        email: "anand.computer@outlook.com",
        password: "$2a$10$T8Pq4VskRk1yv0u8Hk.6EuxL8g9xXmC9P3g6W4dGbeGf5wM3K3L8K", // hashed 'admin123'
        phone: "6543210987",
        role: "trainer",
        village: "Palakollu",
        skills: ["Computer Basics", "Coding"],
        experience: "5",
        languages: ["Telugu", "English"],
        timings: "Evening (5:00 PM - 8:00 PM)",
        fee: "₹500 per month",
        bio: "Software engineering graduate teaching digital literacy, basic computer controls, and introductory Python programming.",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        rating: 4.5,
        isVerified: true,
        reviews: [
          { learnerName: "Chandra", rating: 4, text: "Learned MS Office and typing. Very useful." }
        ]
      },
      {
        id: "trainer-4",
        name: "Prasad Rao",
        email: "prasad.english@gmail.com",
        password: "$2a$10$T8Pq4VskRk1yv0u8Hk.6EuxL8g9xXmC9P3g6W4dGbeGf5wM3K3L8K", // hashed 'admin123'
        phone: "9123456789",
        role: "trainer",
        village: "Marteru",
        skills: ["Spoken English", "Tuition Teaching"],
        experience: "10",
        languages: ["English", "Telugu"],
        timings: "Evening (4:00 PM - 7:00 PM)",
        fee: "Free",
        bio: "Retired school teacher eager to teach village youngsters communication skills, grammar, and school subjects.",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        rating: 4.7,
        isVerified: false, // Pending verification to show Admin workflow
        reviews: []
      },
      {
        id: "learner-1",
        name: "Kalyan Raju",
        email: "kalyan@gmail.com",
        password: "$2a$10$T8Pq4VskRk1yv0u8Hk.6EuxL8g9xXmC9P3g6W4dGbeGf5wM3K3L8K", // hashed 'admin123'
        phone: "9988776655",
        role: "learner",
        village: "Penugonda",
        skills: ["Organic Farming"],
        favorites: ["trainer-1"]
      }
    ],
    bookings: [
      {
        id: "booking-1",
        learnerId: "learner-1",
        learnerName: "Kalyan Raju",
        trainerId: "trainer-1",
        trainerName: "Satyanarayana Murthy",
        skillName: "Organic Farming",
        date: "2026-07-10",
        time: "08:00 AM",
        status: "approved"
      }
    ],
    events: [
      {
        id: "event-1",
        title: "Modern Paddy Cultivation Workshop",
        description: "Join us for a free hands-on workshop detailing natural pest control methods and micro-irrigation systems.",
        date: "2026-07-15",
        time: "10:00 AM",
        village: "Penugonda",
        type: "workshop",
        image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=400",
        likes: 12
      },
      {
        id: "event-2",
        title: "Digital Literacy Campaign",
        description: "Free computer workshop covering smartphone banking, online agriculture market access, and basic browsing.",
        date: "2026-07-22",
        time: "03:00 PM",
        village: "Palakollu",
        type: "event",
        image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=400",
        likes: 8
      },
      {
        id: "event-3",
        title: "How learning spoken English changed my life",
        description: "Kiran from Penugonda shares his success story of learning English on the platform and securing a delivery assistant job in the city.",
        date: "2026-07-01",
        village: "Penugonda",
        type: "story",
        author: "Kiran Kumar",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400",
        likes: 25
      }
    ]
  };
};

const initializeJsonDb = () => {
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(getInitialMockData(), null, 2));
    console.log('JSON database initialized with mock seed data.');
  }
};

// JSON Database Helper Operations to mimic MongoDB
const readJsonDb = () => {
  initializeJsonDb();
  const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
  return JSON.parse(data);
};

const writeJsonDb = (data) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
};

// Abstract Collection Class
class JsonCollection {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async find(query = {}) {
    const db = readJsonDb();
    let items = db[this.collectionName] || [];
    
    // Simple filter matching
    return items.filter(item => {
      for (let key in query) {
        // Support regex skill/village/language search
        if (query[key] && typeof query[key] === 'object' && query[key].$regex) {
          const regex = new RegExp(query[key].$regex, 'i');
          if (Array.isArray(item[key])) {
            if (!item[key].some(val => regex.test(val))) return false;
          } else {
            if (!regex.test(item[key] || '')) return false;
          }
        } else if (Array.isArray(item[key]) && typeof query[key] === 'string') {
          // If searching an array field (e.g. skills: "Coding")
          if (!item[key].includes(query[key])) return false;
        } else if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items[0] || null;
  }

  async findById(id) {
    return this.findOne({ id });
  }

  async create(data) {
    const db = readJsonDb();
    const newItem = {
      id: data.id || `${this.collectionName.slice(0, -1)}-${crypto.randomBytes(4).toString('hex')}`,
      ...data
    };
    db[this.collectionName] = db[this.collectionName] || [];
    db[this.collectionName].push(newItem);
    writeJsonDb(db);
    return newItem;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const db = readJsonDb();
    const index = db[this.collectionName].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    db[this.collectionName][index] = {
      ...db[this.collectionName][index],
      ...updateData
    };
    writeJsonDb(db);
    return db[this.collectionName][index];
  }

  async findByIdAndDelete(id) {
    const db = readJsonDb();
    const index = db[this.collectionName].findIndex(item => item.id === id);
    if (index === -1) return false;
    
    db[this.collectionName].splice(index, 1);
    writeJsonDb(db);
    return true;
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }
}

// Wrapper for DB operations
const db = {
  dbType: () => dbType,
  connect: connectDB,
  User: new JsonCollection('users'),
  Booking: new JsonCollection('bookings'),
  Event: new JsonCollection('events')
};

module.exports = db;

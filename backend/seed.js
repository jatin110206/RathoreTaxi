const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

const sampleUsers = [
  // Existing
  {
    fullname: { firstname: 'Jatin', lastname: 'Rathore' },
    email: 'jatin@rathoretaxi.com',
    password: 'password123',
  },
  {
    fullname: { firstname: 'Priya', lastname: 'Sharma' },
    email: 'priya.sharma@example.com',
    password: 'password123',
  },
  {
    fullname: { firstname: 'Rohit', lastname: 'Verma' },
    email: 'rohit.verma@example.com',
    password: 'password123',
  },
  // Additional Sample Riders
  {
    fullname: { firstname: 'Ananya', lastname: 'Mishra' },
    email: 'ananya.mishra@example.com',
    password: 'password123',
  },
  {
    fullname: { firstname: 'Rahul', lastname: 'Gupta' },
    email: 'rahul.gupta@example.com',
    password: 'password123',
  },
  {
    fullname: { firstname: 'Sneha', lastname: 'Patel' },
    email: 'sneha.patel@example.com',
    password: 'password123',
  },
  {
    fullname: { firstname: 'Aman', lastname: 'Chauhan' },
    email: 'aman.chauhan@example.com',
    password: 'password123',
  },
  {
    fullname: { firstname: 'Kavita', lastname: 'Jain' },
    email: 'kavita.jain@example.com',
    password: 'password123',
  },
];

const sampleCaptains = [
  // Existing
  {
    fullname: { firstname: 'Rajesh', lastname: 'Rathore' },
    email: 'captain.rajesh@rathoretaxi.com',
    password: 'password123',
    status: 'available',
    vehicle: {
      color: 'Silver',
      plate: 'MP 04 AB 4589',
      capacity: 4,
      vehicleType: 'car',
    },
    location: {
      lat: 23.2599,
      lng: 77.4126,
    },
  },
  {
    fullname: { firstname: 'Vikram', lastname: 'Singh' },
    email: 'captain.vikram@rathoretaxi.com',
    password: 'password123',
    status: 'available',
    vehicle: {
      color: 'Yellow Green',
      plate: 'MP 04 CD 1234',
      capacity: 3,
      vehicleType: 'auto',
    },
    location: {
      lat: 23.2325,
      lng: 77.43,
    },
  },
  {
    fullname: { firstname: 'Amit', lastname: 'Patel' },
    email: 'captain.amit@rathoretaxi.com',
    password: 'password123',
    status: 'available',
    vehicle: {
      color: 'Black',
      plate: 'MP 04 EF 9876',
      capacity: 1,
      vehicleType: 'bike',
    },
    location: {
      lat: 23.2156,
      lng: 77.4089,
    },
  },
  // Additional Sample Captains
  {
    fullname: { firstname: 'Suresh', lastname: 'Yadav' },
    email: 'captain.suresh@rathoretaxi.com',
    password: 'password123',
    status: 'available',
    vehicle: {
      color: 'White',
      plate: 'MP 04 ZT 7721',
      capacity: 4,
      vehicleType: 'car',
    },
    location: {
      lat: 23.2458,
      lng: 77.4215,
    },
  },
  {
    fullname: { firstname: 'Deepak', lastname: 'Soni' },
    email: 'captain.deepak@rathoretaxi.com',
    password: 'password123',
    status: 'available',
    vehicle: {
      color: 'Green Yellow',
      plate: 'MP 04 RR 3390',
      capacity: 3,
      vehicleType: 'auto',
    },
    location: {
      lat: 23.2291,
      lng: 77.4198,
    },
  },
  {
    fullname: { firstname: 'Mohit', lastname: 'Rao' },
    email: 'captain.mohit@rathoretaxi.com',
    password: 'password123',
    status: 'available',
    vehicle: {
      color: 'Matte Red',
      plate: 'MP 04 BK 5501',
      capacity: 1,
      vehicleType: 'bike',
    },
    location: {
      lat: 23.2642,
      lng: 77.4055,
    },
  },
  {
    fullname: { firstname: 'Harsh', lastname: 'Vardhan' },
    email: 'captain.harsh@rathoretaxi.com',
    password: 'password123',
    status: 'available',
    vehicle: {
      color: 'Midnight Blue',
      plate: 'MP 09 XY 8812',
      capacity: 4,
      vehicleType: 'car',
    },
    location: {
      lat: 22.7196,
      lng: 75.8577,
    },
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Seed Users
    console.log('--- Seeding Users (Riders) ---');
    for (const u of sampleUsers) {
      const existing = await userModel.findOne({ email: u.email });
      if (!existing) {
        const hashedPassword = await userModel.hashPassword(u.password);
        await userModel.create({
          fullname: u.fullname,
          email: u.email,
          password: hashedPassword,
        });
        console.log(`+ Created Rider: ${u.email} (${u.fullname.firstname} ${u.fullname.lastname})`);
      } else {
        console.log(`• Rider already exists: ${u.email}`);
      }
    }

    // Seed Captains
    console.log('\n--- Seeding Captains (Fleet) ---');
    for (const c of sampleCaptains) {
      const existing = await captainModel.findOne({ email: c.email });
      if (!existing) {
        const hashedPassword = await captainModel.hashPassword(c.password);
        await captainModel.create({
          fullname: c.fullname,
          email: c.email,
          password: hashedPassword,
          status: c.status,
          vehicle: c.vehicle,
          location: c.location,
        });
        console.log(
          `+ Created Captain: ${c.email} - ${c.vehicle.vehicleType.toUpperCase()} (${c.vehicle.plate} • ${c.vehicle.color})`
        );
      } else {
        console.log(`• Captain already exists: ${c.email}`);
      }
    }

    console.log('\n🎉 MongoDB Atlas updated with all expanded sample users & captains!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();

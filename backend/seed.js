// Seeds two demo users so the login screen has something to authenticate against.
// Run with: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const demoUsers = [
  { name: 'Emma Employee', email: 'employee@deskflow.com', password: 'password123', role: 'Employee' },
  { name: 'Alex Admin', email: 'admin@deskflow.com', password: 'password123', role: 'Admin' },
];

const seed = async () => {
  await connectDB();

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`[Seed] Skipping ${u.email} (already exists)`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log(`[Seed] Created ${u.role}: ${u.email} / ${u.password}`);
  }

  console.log('[Seed] Done.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('[Seed] Failed:', err);
  process.exit(1);
});

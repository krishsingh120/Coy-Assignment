const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Profile = require('../src/models/Profile');
const Swipe = require('../src/models/Swipe');
const Match = require('../src/models/Match');

jest.setTimeout(60000);

let mongod;
let user;
let mutualProfile;
let passProfile;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  user = await User.create({
    username: 'demo_user',
    name: 'Alex Johnson',
    age: 22
  });

  mutualProfile = await Profile.create({
    name: 'Sophia Patel',
    age: 22,
    photo: 'https://example.com/sophia.jpg',
    bio: 'Pre-med student',
    cityOrCollege: 'UCLA',
    interests: ['Medicine'],
    hasLikedDemoUser: true
  });

  passProfile = await Profile.create({
    name: 'Leo Morales',
    age: 24,
    photo: 'https://example.com/leo.jpg',
    bio: 'Designer',
    cityOrCollege: 'Austin',
    interests: ['Design'],
    hasLikedDemoUser: false
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Swipe.deleteMany({});
  await Match.deleteMany({});
});

describe('Feed & Privacy', () => {
  test('returns profiles without exposing inbound likes', async () => {
    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);
    expect(res.body.profiles.length).toBe(2);
    res.body.profiles.forEach((p) => {
      expect(p.hasLikedDemoUser).toBeUndefined();
    });
  });

  test('excludes swiped profiles from feed', async () => {
    await Swipe.create({ userId: user._id, profileId: passProfile._id, action: 'PASS' });
    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);
    expect(res.body.profiles.length).toBe(1);
    expect(res.body.profiles[0]._id.toString()).toBe(mutualProfile._id.toString());
  });
});

describe('Swipe & Match', () => {
  test('records PASS swipe', async () => {
    const res = await request(app).post('/swipe').send({ profileId: passProfile._id, action: 'PASS' });
    expect(res.status).toBe(200);
    expect(res.body.matched).toBe(false);
  });

  test('prevents duplicate swipes', async () => {
    await request(app).post('/swipe').send({ profileId: passProfile._id, action: 'PASS' });
    const res = await request(app).post('/swipe').send({ profileId: passProfile._id, action: 'PASS' });
    expect(res.status).toBe(409);
  });

  test('creates match on mutual LIKE', async () => {
    const res = await request(app).post('/swipe').send({ profileId: mutualProfile._id, action: 'LIKE' });
    expect(res.status).toBe(200);
    expect(res.body.matched).toBe(true);

    const match = await Match.findOne({ userId: user._id, matchedProfileId: mutualProfile._id });
    expect(match).toBeTruthy();
  });

  test('GET /matches returns only mutual matches', async () => {
    await request(app).post('/swipe').send({ profileId: mutualProfile._id, action: 'LIKE' });
    const res = await request(app).get('/matches');
    expect(res.status).toBe(200);
    expect(res.body.matches.length).toBe(1);
    expect(res.body.matches[0].profile.name).toBe('Sophia Patel');
  });
});

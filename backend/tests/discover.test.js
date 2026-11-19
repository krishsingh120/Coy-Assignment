const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Profile = require('../src/models/Profile');
const Swipe = require('../src/models/Swipe');
const Match = require('../src/models/Match');

jest.setTimeout(60000);

let mongoServer;
let demoUser;
let profileMutual;
let profileUnilateral;
let profilePass;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Setup Demo User
  demoUser = await User.create({
    username: 'demo_user',
    name: 'Alex Johnson',
    age: 22,
    avatar: 'https://example.com/alex.jpg',
    bio: 'CS Student'
  });

  // Setup Profiles:
  // 1. Profile who likes demo user (Mutual match candidate)
  profileMutual = await Profile.create({
    name: 'Sophia Patel',
    age: 22,
    photo: 'https://example.com/sophia.jpg',
    bio: 'Pre-med senior at UCLA.',
    cityOrCollege: 'UCLA, Los Angeles',
    interests: ['Medicine', 'Boba'],
    hasLikedDemoUser: true
  });

  // 2. Profile who has NOT liked demo user (Unilateral like candidate)
  profileUnilateral = await Profile.create({
    name: 'Marcus Chen',
    age: 23,
    photo: 'https://example.com/marcus.jpg',
    bio: 'Robotics engineer.',
    cityOrCollege: 'Georgia Tech',
    interests: ['Robotics', 'Hiking'],
    hasLikedDemoUser: false
  });

  // 3. Profile to pass on
  profilePass = await Profile.create({
    name: 'Leo Morales',
    age: 24,
    photo: 'https://example.com/leo.jpg',
    bio: 'Product designer.',
    cityOrCollege: 'Austin, TX',
    interests: ['Running', 'Design'],
    hasLikedDemoUser: false
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear Swipes and Matches before each test for isolation
  await Swipe.deleteMany({});
  await Match.deleteMany({});
});

describe('1. Privacy Requirements & Feed API', () => {
  test('GET /feed returns unswiped profiles and NEVER reveals inbound likes', async () => {
    const res = await request(app).get('/feed');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.profiles)).toBe(true);
    expect(res.body.profiles.length).toBe(3);

    // CRITICAL PRIVACY CHECK: hasLikedDemoUser must NOT be present in any profile in the feed
    res.body.profiles.forEach((profile) => {
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('age');
      expect(profile).toHaveProperty('photo');
      expect(profile).toHaveProperty('bio');
      expect(profile).toHaveProperty('cityOrCollege');
      expect(profile).toHaveProperty('interests');
      expect(profile.hasLikedDemoUser).toBeUndefined();
    });
  });

  test('GET /feed excludes previously swiped profiles', async () => {
    // Swipe on profilePass
    await Swipe.create({
      userId: demoUser._id,
      profileId: profilePass._id,
      action: 'PASS'
    });

    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);
    expect(res.body.profiles.length).toBe(2);

    const ids = res.body.profiles.map((p) => p._id.toString());
    expect(ids).not.toContain(profilePass._id.toString());
  });

  test('GET /feed returns empty array when all profiles are swiped', async () => {
    await Swipe.insertMany([
      { userId: demoUser._id, profileId: profileMutual._id, action: 'LIKE' },
      { userId: demoUser._id, profileId: profileUnilateral._id, action: 'LIKE' },
      { userId: demoUser._id, profileId: profilePass._id, action: 'PASS' }
    ]);

    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);
    expect(res.body.profiles.length).toBe(0);
  });
});

describe('2. Swipe Functionality & Validation', () => {
  test('POST /swipe records a PASS swipe correctly without matching', async () => {
    const res = await request(app)
      .post('/swipe')
      .send({ profileId: profilePass._id.toString(), action: 'PASS' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.matched).toBe(false);

    // Verify swipe is persisted in DB
    const persisted = await Swipe.findOne({
      userId: demoUser._id,
      profileId: profilePass._id
    });
    expect(persisted).toBeTruthy();
    expect(persisted.action).toBe('PASS');
  });

  test('POST /swipe prevents duplicate swipe on same profile', async () => {
    // First swipe
    await request(app)
      .post('/swipe')
      .send({ profileId: profilePass._id.toString(), action: 'PASS' });

    // Duplicate swipe
    const duplicateRes = await request(app)
      .post('/swipe')
      .send({ profileId: profilePass._id.toString(), action: 'PASS' });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.success).toBe(false);
    expect(duplicateRes.body.message).toMatch(/already swiped/i);
  });

  test('POST /swipe rejects invalid action or missing profileId', async () => {
    const resInvalidAction = await request(app)
      .post('/swipe')
      .send({ profileId: profilePass._id.toString(), action: 'SUPERLIKE' });
    expect(resInvalidAction.status).toBe(400);

    const resMissingField = await request(app)
      .post('/swipe')
      .send({ action: 'LIKE' });
    expect(resMissingField.status).toBe(400);
  });
});

describe('3. Matching Logic & Matches API', () => {
  test('POST /swipe with LIKE creates a Match ONLY when mutual', async () => {
    // 1. Like a profile that ALREADY liked the demo user (profileMutual)
    const mutualRes = await request(app)
      .post('/swipe')
      .send({ profileId: profileMutual._id.toString(), action: 'LIKE' });

    expect(mutualRes.status).toBe(200);
    expect(mutualRes.body.success).toBe(true);
    expect(mutualRes.body.matched).toBe(true);
    expect(mutualRes.body.match).toBeDefined();
    expect(mutualRes.body.match.profile.name).toBe('Sophia Patel');

    // Verify match persisted in DB
    const persistedMatch = await Match.findOne({
      userId: demoUser._id,
      matchedProfileId: profileMutual._id
    });
    expect(persistedMatch).toBeTruthy();
  });

  test('POST /swipe with LIKE does NOT create match for unilateral like', async () => {
    // 2. Like a profile that did NOT like demo user
    const unilateralRes = await request(app)
      .post('/swipe')
      .send({ profileId: profileUnilateral._id.toString(), action: 'LIKE' });

    expect(unilateralRes.status).toBe(200);
    expect(unilateralRes.body.success).toBe(true);
    expect(unilateralRes.body.matched).toBe(false);
    expect(unilateralRes.body.match).toBeUndefined();

    // Verify NO match was created in DB
    const matchCount = await Match.countDocuments({
      userId: demoUser._id,
      matchedProfileId: profileUnilateral._id
    });
    expect(matchCount).toBe(0);
  });

  test('GET /matches returns ONLY confirmed mutual matches', async () => {
    // Like both profiles
    await request(app)
      .post('/swipe')
      .send({ profileId: profileMutual._id.toString(), action: 'LIKE' });

    await request(app)
      .post('/swipe')
      .send({ profileId: profileUnilateral._id.toString(), action: 'LIKE' });

    const matchesRes = await request(app).get('/matches');

    expect(matchesRes.status).toBe(200);
    expect(matchesRes.body.success).toBe(true);
    expect(matchesRes.body.count).toBe(1);
    expect(matchesRes.body.matches.length).toBe(1);
    expect(matchesRes.body.matches[0].profile.name).toBe('Sophia Patel');
  });
});

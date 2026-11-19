import Database from "better-sqlite3";
import path from "path";
import { SEED_PROFILES } from "./seedData.js";

let dbInstance = null;

export function getDb(dbPath = path.join(process.cwd(), "coy.db")) {
  if (dbInstance && dbPath !== ":memory:") return dbInstance;

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      photo_url TEXT NOT NULL,
      bio TEXT NOT NULL,
      location TEXT NOT NULL,
      interests TEXT NOT NULL,
      liked_me INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL UNIQUE,
      action TEXT NOT NULL CHECK(action IN ('LIKE', 'PASS')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL UNIQUE,
      matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );
  `);

  const { count } = db.prepare("SELECT COUNT(*) as count FROM profiles").get();
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO profiles (name, age, photo_url, bio, location, interests, liked_me)
      VALUES (@name, @age, @photo_url, @bio, @location, @interests, @liked_me)
    `);
    const seedMany = db.transaction((profiles) => {
      for (const p of profiles) {
        insert.run({ ...p, interests: JSON.stringify(p.interests) });
      }
    });
    seedMany(SEED_PROFILES);
  }

  if (dbPath !== ":memory:") dbInstance = db;
  return db;
}

function sanitizeProfile(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    photo_url: row.photo_url,
    bio: row.bio,
    location: row.location,
    interests: JSON.parse(row.interests),
    ...(row.matched_at ? { matched_at: row.matched_at } : {}),
  };
}

export function getFeed(db = getDb()) {
  const rows = db
    .prepare(`
      SELECT id, name, age, photo_url, bio, location, interests
      FROM profiles
      WHERE id NOT IN (SELECT profile_id FROM swipes)
      ORDER BY id ASC
    `)
    .all();

  return rows.map(sanitizeProfile);
}

export function recordSwipe(profileId, action, db = getDb()) {
  if (!Number.isInteger(profileId) || profileId <= 0) {
    throw Object.assign(new Error("Invalid profileId"), { status: 400 });
  }
  if (action !== "LIKE" && action !== "PASS") {
    throw Object.assign(new Error("Action must be LIKE or PASS"), { status: 400 });
  }

  const tx = db.transaction(() => {
    const profile = db
      .prepare("SELECT * FROM profiles WHERE id = ?")
      .get(profileId);

    if (!profile) {
      throw Object.assign(new Error("Profile not found"), { status: 404 });
    }

    const existing = db
      .prepare("SELECT id FROM swipes WHERE profile_id = ?")
      .get(profileId);

    if (existing) {
      throw Object.assign(new Error("Profile already swiped"), { status: 409 });
    }

    db.prepare("INSERT INTO swipes (profile_id, action) VALUES (?, ?)").run(
      profileId,
      action
    );

    if (action === "LIKE" && profile.liked_me === 1) {
      db.prepare("INSERT INTO matches (profile_id) VALUES (?)").run(profileId);
      return {
        matched: true,
        match: sanitizeProfile(profile),
      };
    }

    return { matched: false };
  });

  return tx();
}

export function getMatches(db = getDb()) {
  const rows = db
    .prepare(`
      SELECT p.id, p.name, p.age, p.photo_url, p.bio, p.location, p.interests, m.matched_at
      FROM matches m
      JOIN profiles p ON p.id = m.profile_id
      ORDER BY m.matched_at DESC, m.id DESC
    `)
    .all();

  return rows.map(sanitizeProfile);
}

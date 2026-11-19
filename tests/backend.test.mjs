import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getDb, getFeed, recordSwipe, getMatches } from "../src/lib/db.js";

describe("Coy Discover Backend", () => {
  it("seeds 30+ profiles and never leaks liked_me in feed", () => {
    const db = getDb(":memory:");
    const feed = getFeed(db);

    assert.ok(feed.length >= 30, "Should seed at least 30 profiles");
    for (const profile of feed) {
      assert.equal("liked_me" in profile, false, "liked_me must never be exposed");
    }
  });

  it("removes swiped profiles from feed and blocks duplicate swipes", () => {
    const db = getDb(":memory:");
    const first = getFeed(db)[0];

    recordSwipe(first.id, "PASS", db);
    const updatedFeed = getFeed(db);
    assert.equal(updatedFeed.some((p) => p.id === first.id), false);

    assert.throws(() => recordSwipe(first.id, "LIKE", db), { status: 409 });
  });

  it("only creates a match on mutual LIKE, never on PASS or one-sided LIKE", () => {
    const db = getDb(":memory:");

    const oneSided = recordSwipe(2, "LIKE", db);
    assert.equal(oneSided.matched, false);
    assert.equal(getMatches(db).length, 0);

    const passedMutual = recordSwipe(3, "PASS", db);
    assert.equal(passedMutual.matched, false);
    assert.equal(getMatches(db).length, 0);

    const mutual = recordSwipe(1, "LIKE", db);
    assert.equal(mutual.matched, true);
    assert.equal(mutual.match.id, 1);
    assert.equal("liked_me" in mutual.match, false);
    assert.equal(getMatches(db).length, 1);
  });
});

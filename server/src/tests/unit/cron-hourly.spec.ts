import mongoose from "mongoose";
import setupForTests from "../testUtil";
import { hourlyHotScoreJob } from "../../config/cron-hourly";
import Post from "../../models/Post";

describe("Hourly Cron (Integration)", () => {
  beforeAll(async () => {
    await setupForTests();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  describe("Hourly Hot Score Job", () => {
    it("should not affect posts published over a week ago", async () => {
      await Post.create({
        content: "This is a post",
        approvedTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
        approved: true,
        postNumber: 1,
      });

      await hourlyHotScoreJob();

      const post = await Post.findOne();
      expect(post?.hotScore).toBe(0);
    });

    it("should decrease hot score by 5 for each hour since the post was approved", async () => {
      await Post.create({
        content: "This is a post",
        approvedTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        approved: true,
        postNumber: 1,
        hotScore: 10,
      });

      await hourlyHotScoreJob();

      const post = await Post.findOne();
      expect(post?.hotScore).toBe(5);

      await hourlyHotScoreJob();

      const post2 = await Post.findOne();
      expect(post2?.hotScore).toBe(0);
    });

    it("should update hot score for multiple posts", async () => {
      await Promise.all(
        Array(10)
          .fill(0)
          .map(async (_, i) => {
            await Post.create({
              content: "This is a post",
              approvedTime: new Date(Date.now() - 999 * 60 * 60 * 24 * i),
              approved: true,
              postNumber: 1,
              hotScore: 10,
            });
          })
      );

      await hourlyHotScoreJob();

      const posts = await Post.find();
      expect(posts.length).toBe(10);
      expect(posts[0].hotScore).toBe(5);
      expect(posts[7].hotScore).toBe(5);
      expect(posts[8].hotScore).toBe(10);
      expect(posts[9].hotScore).toBe(10);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

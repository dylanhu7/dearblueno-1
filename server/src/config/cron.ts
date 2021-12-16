import cron from "node-cron";
import User from "../models/User";

export default function setupCron() {
  // Daily at midnight, handle daily streak related stuff
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily cron job! 🚀", new Date().toLocaleString());
    const startDate = new Date();

    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Reset streaks for users that have not logged in today
    await User.updateMany(
      {
        lastLogin: { $lt: yesterday },
        streakDays: { $gt: 0 },
      },
      {
        $set: {
          streakDays: 0,
        },
      }
    );

    // Increment streaks for users that have logged in today
    await User.updateMany(
      {
        lastLogin: { $gte: yesterday },
      },
      {
        $inc: {
          streakDays: 1,
        },
      }
    );

    // Award xp to users that have a streak at multiple of 3 days
    // 5 xp every 3 days for streaks up to streak of 15 days
    await User.updateMany(
      {
        streakDays: { $mod: [3, 0], $gt: 0, $lt: 15 },
      },
      {
        $inc: {
          xp: 5,
        },
      }
    );

    // Starting at 15 days, award 10 xp every 3 days
    await User.updateMany(
      {
        streakDays: { $mod: [3, 0], $gte: 15 },
      },
      {
        $inc: {
          xp: 10,
        },
      }
    );

    // Award a "One Week Streak" badge for streaks of 7 days
    await User.updateMany(
      {
        streakDays: 7,
      },
      {
        $push: {
          badges: "One Week Streak",
        },
      }
    );

    // Award a "One Month Streak" badge for streaks of 30 days
    await User.updateMany(
      {
        streakDays: 30,
      },
      {
        $push: {
          badges: "One Month Streak",
        },
      }
    );

    // Award a "Nice" badge for streaks of 69 days
    await User.updateMany(
      {
        streakDays: 69,
      },
      {
        $push: {
          badges: "Nice",
        },
      }
    );

    // Award a "One Year Streak" badge for streaks of 365 days
    await User.updateMany(
      {
        streakDays: 365,
      },
      {
        $push: {
          badges: "One Year Streak",
        },
      }
    );

    // Remove the "Top Fan" badge from all users
    await User.updateMany(
      {
        badges: "Top Fan",
      },
      {
        $pull: {
          badges: "Top Fan",
        },
      }
    );

    // Award a "Top Fan" badge to users in the top 5% of xp
    const count = await User.count();
    // Find the xp of the user at the 5th percentile
    const user5th = await User.findOne({}, { xp: 1, _id: 0 })
      .sort({ xp: -1 })
      .skip(Math.floor(count * 0.05));
    const minXp = Math.max(user5th ? user5th.xp : 10, 10);
    // Award the "Top Fan" badge to all users with xp >= the 5th percentile xp
    await User.updateMany(
      {
        xp: { $gte: minXp },
      },
      {
        $push: {
          badges: "Top Fan",
        },
      }
    );

    console.log("Daily cron job complete! 🎉", new Date().toLocaleString());
    const completedIn = new Date().getTime() - startDate.getTime();
    console.log(`Completed in ${completedIn}ms`);
  });
}

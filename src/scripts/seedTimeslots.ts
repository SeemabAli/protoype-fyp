// src/scripts/seedTimeslots.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Timeslot from "@/models/Timeslot";

// ✅ Explicitly load `.env.local`
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Please add MONGODB_URI to your .env.local file");

// Timeslot data
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const slots = [
  { start: "08:00", end: "09:30" },
  { start: "09:30", end: "11:00" },
  { start: "11:00", end: "12:30" },
  { start: "13:30", end: "15:00" },
  { start: "15:00", end: "16:30" },
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ MongoDB Connected");

    for (const day of days) {
      for (let i = 0; i < slots.length; i++) {
        const { start, end } = slots[i];

        const exists = await Timeslot.findOne({ day, slotIndex: i });
        if (exists) {
          console.log(`⚠️ Timeslot ${day} ${start}-${end} already exists — skipping`);
          continue;
        }

        await Timeslot.create({
          day,
          start,
          end,
          slotIndex: i,
        });
        console.log(`✅ Created Timeslot ${day} ${start}-${end}`);
      }
    }

    console.log("🎉 Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

run();

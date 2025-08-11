// scripts/seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/automated-timetable";

async function run(){
  await mongoose.connect(MONGODB_URI);
  const users = [
    { name: "Admin User", email: "admin@gmail.com", password: "Admin@123", role: "admin", designation: "Administrator" },
    { name: "Coordinator User", email: "coordinator@gmail.com", password: "Coordinator@123", role: "coordinator", designation: "Coordinator" },
    { name: "Teacher User", email: "teacher@gmail.com", password: "Teacher@123", role: "faculty", designation: "Lecturer" },
    { name: "Student User", email: "student@gmail.com", password: "Student@123", role: "student", designation: "Student" }
  ];

  for (const u of users) {
    const exists = await mongoose.connection.collection("users").findOne({ email: u.email });
    if (exists) {
      console.log(`User ${u.email} exists — skipping`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await mongoose.connection.collection("users").insertOne({
      name: u.name,
      email: u.email,
      password: hashed,
      role: u.role,
      designation: u.designation,
      createdAt: new Date()
    });
    console.log(`Created ${u.email}`);
  }

  console.log("Seeding complete");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });

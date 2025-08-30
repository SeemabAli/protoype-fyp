// src/lib/zodSchemas.ts
import { z } from "zod";

export const designationEnum = z.enum([
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
]);

export const courseSchema = z.object({
  code: z.string().min(2, "Course code is required").transform((s) => s.toUpperCase()),
  title: z.string().min(3, "Course title is required"),
  enrollment: z.number().min(0, "Enrollment must be >= 0"),
  multimediaRequired: z.boolean(),
  studentBatch: z.string().optional().nullable(),
});

export const facultySchema = z.object({
  facultyId: z.string().min(1, "Faculty ID required"),
  name: z.string().min(2, "Name required"),
  email: z.string().email().optional(),
  department: z.string().min(2, "Department required"),
  designation: designationEnum,
  coursePreferences: z.array(z.string().min(1)).min(5, "At least 5 course preferences required"),
  timePreferences: z.array(z.string()).optional(),
});

export const classroomSchema = z.object({
  classroomId: z.string().min(1, "Classroom ID required"),
  building: z.string().optional().nullable(),
  capacity: z.number().min(1, "Capacity must be >= 1"),
  multimediaAvailable: z.boolean(),
  availableSlots: z.array(z.string()).optional(),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type FacultyInput = z.infer<typeof facultySchema>;
export type ClassroomInput = z.infer<typeof classroomSchema>;

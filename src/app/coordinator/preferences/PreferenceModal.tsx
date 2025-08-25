/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  faculty: any; // populated faculty doc with preferences.courseId and preferences.timeSlots populated
}

export default function PreferenceModal({ open, setOpen, faculty }: Props) {
  if (!open) return null;

  const preferences: any[] = Array.isArray(faculty?.preferences)
    ? faculty.preferences
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-[#493737]">
            Preferences — {faculty?.name || "Faculty"}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            Email: {faculty?.email || "-"} • Department:{" "}
            {faculty?.department || "-"}
          </div>
        </DialogHeader>

        <div className="px-2 py-4 space-y-4">
          {preferences.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No preferences submitted by this faculty.</p>
            </div>
          ) : (
            preferences.map((p, idx) => {
              const course = p.courseId;
              const timeslots: any[] = Array.isArray(p.timeSlots)
                ? p.timeSlots
                : [];

              return (
                <div
                  key={idx}
                  className="border border-[#e5d1c2] rounded-lg p-4 bg-[#fffdfc] shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#d89860] text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-[#493737]">
                            {course?.code ??
                              course?.courseCode ??
                              "—"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {course?.title ?? course?.name ?? ""}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm text-gray-500 font-medium">
                          Preferred timeslots:
                        </div>
                        {timeslots.length === 0 ? (
                          <div className="text-sm text-gray-500 mt-1">
                            No specific timeslots selected
                          </div>
                        ) : (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {timeslots.map((ts: any, i: number) => (
                              <div
                                key={i}
                                className="px-2 py-1 rounded-lg bg-[#fdf3eb] text-sm text-[#493737] border border-[#e5d1c2]"
                              >
                                {ts.day ?? ts.slotDay ?? "Day"} •{" "}
                                {ts.start ?? ts.from ?? ts.begin ?? ""} -{" "}
                                {ts.end ?? ts.to ?? ""}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* optional metadata */}
                    <div className="text-xs text-gray-500 mt-1">
                      {p?.submittedAt
                        ? new Date(p.submittedAt).toLocaleString()
                        : ""}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm text-[#493737] border border-[#d6bba7] rounded-lg hover:bg-[#f5ebe4] transition"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

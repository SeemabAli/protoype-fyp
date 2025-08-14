/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface Props {
  data: any[];
  onEdit: (f: any) => void;
  onDelete: (f: any) => void;
}

export default function FacultyTable({ data, onEdit, onDelete }: Props) {
  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Department</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((f) => (
          <tr key={f._id}>
            <td className="p-2 border">{f.name}</td>
            <td className="p-2 border">{f.email}</td>
            <td className="p-2 border">{f.department}</td>
            <td className="p-2 border flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => onEdit(f)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => onDelete(f)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

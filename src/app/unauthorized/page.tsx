// app/unauthorized/page.tsx
import Link from "next/link";
export default function Unauthorized(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
        <p className="mb-4">You don&apos;t have permission to view this page.</p>
        <Link href="/auth/signin" className="text-blue-600">Go back</Link>
      </div>
    </div>
  );
}

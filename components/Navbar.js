import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-500 text-white px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link href="/">MilaVerse</Link>
      </h1>
      <ul className="flex space-x-6">
        <li>
          <Link href="/dashboard" className="text-white hover:text-gray-200">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/leads" className="text-white hover:text-gray-200">
            Leads
          </Link>
        </li>
      </ul>
    </nav>
  );
}

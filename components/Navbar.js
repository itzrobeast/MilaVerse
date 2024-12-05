\import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    router.push('/login'); // Redirect to login
  };

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
        <li>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

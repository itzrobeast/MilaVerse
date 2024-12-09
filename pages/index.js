export default function Home() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-5xl font-bold text-gray-800">Welcome to MilaVerse</h1>
        <p className="mt-4 text-lg text-gray-600">
          Automate your Instagram messaging and grow your business!
        </p>
        <a
          href="/auth/login"
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Get Started
        </a>
      </div>
    );
  }
  

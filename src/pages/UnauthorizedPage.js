// src/pages/UnauthorizedPage.js
const UnauthorizedPage = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">401</h1>
          <p className="text-xl text-gray-600 mt-4">Unauthorized Access</p>
          <p className="text-gray-500 mt-2">You don't have permission to access this page.</p>
          <Link
            to="/"
            className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  };
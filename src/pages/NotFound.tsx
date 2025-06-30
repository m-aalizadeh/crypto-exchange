import { Button } from "../components/Button";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          {/* <Logo className="h-12 w-auto" /> */}
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <svg
            className="mx-auto h-48 w-48 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Oops! Page not found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link to="/">Go to Homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/markets">Browse Markets</Link>
          </Button>
        </div>

        {/* Support Link */}
        <div className="mt-10">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link
              to="/support"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

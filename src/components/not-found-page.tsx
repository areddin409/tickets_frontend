import { Search, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from './ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Display */}
        <div>
          <h1 className="text-9xl font-bold text-purple-700">404</h1>
          <div className="flex justify-center mt-4">
            <div className="rounded-full bg-gray-900 p-4">
              <Search className="h-12 w-12 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-400 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Link to="/">
            <Button className="bg-purple-700 hover:bg-purple-600 cursor-pointer w-full">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-4">Maybe try one of these:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/events">
              <Button
                variant="link"
                className="text-purple-400 hover:text-purple-300"
              >
                Browse Events
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="link"
                className="text-purple-400 hover:text-purple-300"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

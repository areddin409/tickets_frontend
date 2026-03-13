import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Link, useRouteError } from 'react-router';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RouteError {
  statusText?: string;
  message?: string;
  status?: number;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError;

  const getErrorMessage = () => {
    if (error?.message) return error.message;
    if (error?.statusText) return error.statusText;
    return 'Something went wrong';
  };

  const getErrorTitle = () => {
    if (error?.status === 404) return 'Page Not Found';
    if (error?.status === 403) return 'Access Denied';
    if (error?.status === 500) return 'Server Error';
    return 'Oops! An Error Occurred';
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-900/20 p-6">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
        </div>

        {/* Error Title */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{getErrorTitle()}</h1>
          {error?.status && (
            <p className="text-gray-400 text-lg">Error {error.status}</p>
          )}
        </div>

        {/* Error Details */}
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Details</AlertTitle>
          <AlertDescription className="text-left">
            {getErrorMessage()}
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-purple-700 hover:bg-purple-600 cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link to="/">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 cursor-pointer w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <p className="text-gray-500 text-sm">
          If this problem persists, please contact support or try again later.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;

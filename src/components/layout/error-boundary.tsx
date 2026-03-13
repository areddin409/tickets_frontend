import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
          <div className="max-w-2xl w-full space-y-8">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-red-900/20 p-6">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
            </div>

            {/* Error Title */}
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">
                Oops! Something Went Wrong
              </h1>
              <p className="text-gray-400 text-lg">
                An unexpected error has occurred in the application
              </p>
            </div>

            {/* Error Details */}
            <Alert variant="destructive" className="bg-gray-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="text-left">
                {this.state.error?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>

            {/* Stack Trace (dev mode only) */}
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="bg-gray-900 rounded-lg p-4 text-xs">
                <summary className="cursor-pointer text-gray-400 hover:text-white mb-2">
                  Show technical details
                </summary>
                <pre className="overflow-auto text-gray-500 whitespace-pre-wrap">
                  {this.state.error?.stack}
                  {'\n\n'}
                  Component Stack:
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-purple-700 hover:bg-purple-600 cursor-pointer"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 cursor-pointer"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* Additional Help */}
            <p className="text-gray-500 text-sm text-center">
              If this problem persists, please contact support or try refreshing
              the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

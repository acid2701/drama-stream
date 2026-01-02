import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({ message = "Something went wrong", onRetry }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-primary" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Oops!</h3>
        <p className="text-gray-400 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

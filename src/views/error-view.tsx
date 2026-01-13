import { useRouteError, Link } from "react-router-dom";

const ErrorView = () => {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-muted-foreground mb-4">
        {error?.statusText || error?.message || "Something went wrong"}
      </p>
      <Link to="/" className="text-primary hover:underline">
        Go back home
      </Link>
    </div>
  );
};

export default ErrorView;

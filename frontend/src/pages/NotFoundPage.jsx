import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="layout-center not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;

import React from 'react';
import "../error/Error.css";

const Error = () => {
  return (
    <section className="error_page">
      <div className="error_container">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a href="/" className="home_button">Go to Homepage</a>
      </div>
    </section>
  );
};

export default Error;

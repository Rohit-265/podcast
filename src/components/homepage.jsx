import React from 'react';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mt-5 mb-3">
            <h1>Welcome to our Podcast Platform</h1>
            <p className="lead">Discover and share podcasts with the world.</p>
          </div>
          <div className="mb-3">
            <h2 className="h4">Tips for Podcasting Success:</h2>
            <ol className="lead">
              <li>Talk about things you’re interested in. Choose a topic you enjoy discussing to create engaging content consistently.</li>
              <li>Focus on your target audience. Narrow your focus to a specific listener avatar who will benefit most from your content.</li>
              <li>Tell lots of stories. Use the three-act story arc to connect with your audience and make your content memorable.</li>
            </ol>
          </div>
          <div className="d-grid gap-2">
            <button className="btn btn-primary mb-2" onClick={handleLoginClick}>Login</button>
            <button className="btn btn-success mb-2" onClick={handleRegisterClick}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

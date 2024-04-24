import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('podcastName');
        localStorage.setItem('isLoggedIn', 'false'); 
        navigate('/');
    };
    const handlecompose = () => {
        navigate('/compose-pod');
    }
    const handlelisten = () => {
        navigate('/listen-pod');
    }
    const userName = localStorage.getItem('name');

    return (
        <div className="container">
            <h2>Welcome, {userName}!</h2>
            <div className="mt-4">
                <button onClick={handlecompose} className="btn btn-primary me-3">Compose Podcast</button>
                <button onClick={handlelisten} className="btn btn-primary me-3">Listen to Podcast</button>
                <button onClick={handleLogout} className="btn btn-danger">Logout</button> <br /> <br /> <br />
                <p className='lead'> <b>Talk about things you're interested in. ... <br />
                    Focus on your target audience. ... <br />
                    Tell lots of stories. ... <br />
                    Help your audience take the next step. ... <br />
                    Ask your listeners questions and report their responses. ... <br />
                    Stay on topic and don't wander too much. ... <br />
                    Invite unique experts onto your show. </b>
                </p>
            </div>
        </div>
    );
};

export default UserDashboard;

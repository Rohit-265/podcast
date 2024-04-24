import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListenPodPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState('');
  const [likedPodcasts, setLikedPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await axios.get('http://localhost:4107/api/composedpod');
        setPodcasts(response.data);
        const storedLikedPodcasts = JSON.parse(localStorage.getItem('likedPodcasts')) || [];
        setLikedPodcasts(storedLikedPodcasts);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setError('Failed to fetch podcasts');
      }
    };

    fetchPodcasts();
  }, []);

  const handleLike = async (id) => {
    try {
      if (!likedPodcasts.includes(id)) {
        await axios.put(`http://localhost:4107/api/composedpod/${id}/like`);
        setPodcasts(podcasts.map(podcast => {
          if (podcast._id === id) {
            return { ...podcast, likes: podcast.likes + 1 };
          }
          return podcast;
        }));
        localStorage.setItem('likedPodcasts', JSON.stringify([...likedPodcasts, id]));
        setLikedPodcasts([...likedPodcasts, id]);
      }
    } catch (error) {
      console.error('Error liking podcast:', error);
    }
  };

  

  const handleDislike = async (id) => {
    try {
      if (likedPodcasts.includes(id)) {
        await axios.put(`http://localhost:4107/api/composedpod/${id}/unlike`);
        setPodcasts(podcasts.map(podcast => {
          if (podcast._id === id && podcast.likes > 0) {
            return { ...podcast, likes: podcast.likes - 1 };
          }
          return podcast;
        }));
        const updatedLikedPodcasts = likedPodcasts.filter(podcastId => podcastId !== id);
        localStorage.setItem('likedPodcasts', JSON.stringify(updatedLikedPodcasts));
        setLikedPodcasts(updatedLikedPodcasts);
      }
    } catch (error) {
      console.error('Error disliking podcast:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Listen to Podcasts</h2>
      <div className="list-group mt-3">
        {podcasts.map((podcast) => (
          <div key={podcast._id} className="list-group-item">
            <h2 className="mb-1">{podcast.podcastName}</h2>
            <h5 className="mb-1">{podcast.description}</h5>

            <p className="mb-1">Composer Name: {podcast.composerName}</p>
            <p className="mb-1">Composer Podcast Name: {podcast.composerPodcastName}</p>
            <p className="mb-1">Likes: {podcast.likes}</p>
            
            <audio controls preload='auto'>
              <source src={podcast.audioFile} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-2">
              <button onClick={() => handleLike(podcast._id)} className="btn btn-primary me-2">Like</button>
              {likedPodcasts.includes(podcast._id) && (
                <button onClick={() => handleDislike(podcast._id)} className="btn btn-danger">Dislike</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default ListenPodPage;

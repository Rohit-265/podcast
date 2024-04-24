import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ComposePodcast = () => {
  const [formData, setFormData] = useState({
    composerName: '',
    composerPodcastName: '',
    podcastName: '',
    description: '',
    audioFile: null 
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const composerName = localStorage.getItem('name');
    const composerPodcastName = localStorage.getItem('podcastName');
    if (composerName && composerPodcastName) {
      setFormData({
        ...formData,
        composerName,
        composerPodcastName
      });
    }
  }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, audioFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('composerName', formData.composerName);
      formDataObj.append('composerPodcastName', formData.composerPodcastName);
      formDataObj.append('podcastName', formData.podcastName);
      formDataObj.append('description', formData.description);
      formDataObj.append('audioFile', formData.audioFile);
  
      await axios.post('http://localhost:4107/api/composedpod/upload', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Podcast composed and uploaded successfully');
      setError('');
      setFormData({
        composerName: '',
        composerPodcastName: '',
        podcastName: '',
        description: '',
        audioFile: null
      });
    } catch (error) {
      console.error('Error composing podcast:', error);
      setSuccessMessage('');
      setError('Failed to compose and upload podcast');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Compose Podcast</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-3">
        <div className="mb-3">
          <label htmlFor="composerName" className="form-label">Composer Name:</label>
          <input type="text" id="composerName" name="composerName" value={formData.composerName} onChange={handleChange} className="form-control" required readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="composerPodcastName" className="form-label">Composer Podcast Name:</label>
          <input type="text" id="composerPodcastName" name="composerPodcastName" value={formData.composerPodcastName} onChange={handleChange} className="form-control" required readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="podcastName" className="form-label">Podcast Name:</label>
          <input type="text" id="podcastName" name="podcastName" value={formData.podcastName} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="audioFile" className="form-label">Audio File:</label>
          <input type="file" id="audioFile" name="audioFile" onChange={handleFileChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">Upload Podcast</button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {successMessage && <p className="text-success mt-3">{successMessage}</p>}
    </div>
  );
};

export default ComposePodcast;

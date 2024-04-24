import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    PodcastName: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = {};
      if (!formData.Name.trim()) {
        validationErrors.Name = 'Name is required';
      } else if (!/^[a-zA-Z ]+$/.test(formData.Name)) {
        validationErrors.Name = 'Name should only contain letters and spaces';
      }
      if (!formData.Email.trim()) {
        validationErrors.Email = 'Email is required';
      }
      if (!formData.Password.trim()) {
        validationErrors.Password = 'Password is required';
      }
      if (!formData.PodcastName.trim()) {
        validationErrors.PodcastName = 'Podcast Name is required';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await axios.post('http://localhost:4107/api/register', formData);
      setSuccessMessage('Registration successful');

      // Clear form data after successful registration
      setFormData({
        Name: '',
        Email: '',
        Password: '',
        PodcastName: ''
      });

      // Redirect to home page after 1.5 seconds using navigate
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error registering user:', error);
      setSuccessMessage('Failed to Register or Pod Cast Name Already Exist');
    }
  };

  return (
    <div className="container">
      <h2 className="mt-5">Register</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="Name">Name:</label>
          <input type="text" id="Name" name="Name" value={formData.Name} onChange={handleChange} className="form-control" />
          {errors.Name && <span className="error-message">{errors.Name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="Email">Email:</label>
          <input type="email" id="Email" name="Email" value={formData.Email} onChange={handleChange} className="form-control" />
          {errors.Email && <span className="error-message">{errors.Email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="Password">Password:</label>
          <input type="password" id="Password" name="Password" value={formData.Password} onChange={handleChange} className="form-control" />
          {errors.Password && <span className="error-message">{errors.Password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="PodcastName">Podcast Name:</label>
          <input type="text" id="PodcastName" name="PodcastName" value={formData.PodcastName} onChange={handleChange} className="form-control" />
          {errors.PodcastName && <span className="error-message">{errors.PodcastName}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      {successMessage && <p className="success-message mt-3">{successMessage}</p>}
    </div>
  );
};

export default RegisterPage;

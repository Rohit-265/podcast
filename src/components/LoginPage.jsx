import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = {};
      if (!formData.Email.trim()) {
        validationErrors.Email = 'Email is required';
      }
      if (!formData.Password.trim()) {
        validationErrors.Password = 'Password is required';
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await axios.post('http://localhost:4107/api/login', formData);
      if (response.data.success) {
        console.log(response.data);
        localStorage.setItem('email', response.data.user.Email);
        localStorage.setItem('name', response.data.user.Name);
        localStorage.setItem('podcastName', response.data.user.PodcastName);
        localStorage.setItem('isLoggedIn', 'true'); 


        navigate('/user-dashboard');
      } else {
        setErrors({ server: response.data.message });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrors({ server: 'Failed to login. Please try again later.' });
    }
  };

  return (
    <div className="container">
      <h2 className="mt-5">Login</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        {errors.server && <div className="alert alert-danger">{errors.server}</div>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

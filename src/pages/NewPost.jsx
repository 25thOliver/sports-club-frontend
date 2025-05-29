import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const token = localStorage.getItem('token');
  const API = import.meta.env.VITE_API_URL;

  const submitPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/forum/posts`, { title, body }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = '/forum';
    } catch {
      alert("Error submitting post");
    }
  };

  return (
    <Layout>
      <div className="container">
        <h2>Create New Post</h2>
        <form onSubmit={submitPost}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} required />
          <button type="submit">Post</button>
        </form>
      </div>
    </Layout>
  );
};

export default NewPost;

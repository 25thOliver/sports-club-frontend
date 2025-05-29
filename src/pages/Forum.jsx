import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/forum/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setPosts(res.data))
      .catch(() => console.error("Failed to load posts"));
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🗣 Community Forum</h2>
          <Link to="/forum/new" className="btn">+ New Post</Link>
        </div>

        {posts.length === 0 ? (
          <p>No forum posts yet.</p>
        ) : (
          <ul>
            {posts.map(post => (
              <li key={post._id} className="card">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  By {post.author?.name || "Unknown"} • {new Date(post.createdAt).toLocaleString()}
                </p>
                <p>{post.body.slice(0, 100)}...</p>
                <Link to={`/forum/posts/${post._id}`} className="text-blue-600 hover:underline mt-1 block">
                  Read More →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Forum;

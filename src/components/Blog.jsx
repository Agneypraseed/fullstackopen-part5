import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, sortBlogs }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = async () => {
    const newblog = await blogService.addLike(blog.id, likes + 1);
    setLikes(newblog.likes);
    blogService.getAll().then((blogs) => {
      sortBlogs(blogs);
    });
  };

  if (showDetails) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(false)}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {likes}
        <button onClick={addLike}>like</button>
        <br />
        {JSON.parse(window.localStorage.getItem("user")).username}
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(true)}>view</button>
    </div>
  );
};

export default Blog;

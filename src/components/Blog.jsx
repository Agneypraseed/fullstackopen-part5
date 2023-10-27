import { useState } from "react";

const Blog = ({ blog, addLike, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDelete = () => {
    if (window.confirm(`Remove Blog ${blog.title} by ${blog.author}`))
      deleteBlog(blog.id);
  };

  if (showDetails) {
    return (
      <div style={blogStyle} className="blogdetails">
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(false)}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {blog.likes}
        <button id="like" onClick={() => addLike(blog.id, blog.likes + 1)}>like</button>
        <br />
        {blog.user.username}
        <br />
        {blog.user.username ===
        JSON.parse(window.localStorage.getItem("user")).username ? (
          <button id="delete" onClick={handleDelete}>remove</button>
        ) : (
          ""
        )}
      </div>
    );
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(true)}>view</button>
    </div>
  );
};

export default Blog;

import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [newblog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const handleChange = (e) => {
    setNewBlog({
      ...newblog,
      [e.target.name]: e.target.value,
    });
  };

  const addBlog = (e) => {
    e.preventDefault();
    createBlog(newblog);
    setNewBlog({
      title: "",
      author: "",
      url: "",
    });
  };

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:{" "}
          <input id="title" value={newblog.title} onChange={handleChange} name="title" />
        </div>
        <div>
          Author:{" "}
          <input id="author" value={newblog.author} onChange={handleChange} name="author" />
        </div>
        <div>
          Url: <input id="url" value={newblog.url} onChange={handleChange} name="url" />
        </div>
        <button id="addBlog" type="submit">Create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;

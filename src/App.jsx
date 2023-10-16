import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log(exception);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>Log in to Application</h1>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const handleLogOut = () => {
    window.localStorage.removeItem("user");
    window.location.reload();
  };

  const addBlog = (e) => {
    e.preventDefault();
    const newBlog = {
      title,
      author,
      url,
    };

    blogService.createBlog(newBlog).then((savedBlog) => {
      setBlogs(blogs.concat(savedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
    });
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };

  const handleUrl = (e) => {
    setUrl(e.target.value);
  };

  const blogForm = () => {
    return (
      <>
        <h2>Create New</h2>
        <form onSubmit={addBlog}>
          <div>
            Title: <input value={title} onChange={handleTitle} />
          </div>
          <div>
            Author: <input value={author} onChange={handleAuthor} />
          </div>
          <div>
            Url: <input value={url} onChange={handleUrl} />
          </div>
          <button type="submit">Create</button>
        </form>
        <br />
      </>
    );
  };

  if (user === null) {
    return loginForm();
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.username} logged in&nbsp;
        <button onClick={() => handleLogOut()}>log out</button>
      </p>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;

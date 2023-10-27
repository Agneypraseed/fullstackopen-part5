import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import "./app.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [status, setStatus] = useState("success");

  const sortBlogs = (blogs) => {
    setBlogs([...blogs].sort((a, b) => b.likes - a.likes));
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      sortBlogs(blogs);
    });
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
      setStatus("error");
      setNotification("Wrong username or password");
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>Log in to Application</h1>
      {notification && <div className={status}>{notification}</div>}
      <div>
        username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );

  const handleLogOut = () => {
    window.localStorage.removeItem("user");
    window.location.reload();
  };

  const addBlog = (newBlog) => {
    blogService
      .createBlog(newBlog)
      .then((savedBlog) => {
        const savedBlogWithUserName = {
          ...savedBlog,
          user: {
            id: savedBlog.user,
            username: user.username,
            name: user.name,
          },
        };
        setBlogs(blogs.concat(savedBlogWithUserName));
        setStatus("success");
        setNotification(
          `a new blog ${savedBlog.title} by ${savedBlog.author} added`
        );
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        blogFormRef.current.toggleVisibility();
      })
      .catch((error) => {
        setStatus("error");
        setNotification(
          `Could not add blog ${newBlog.title}, Error : ${error}`
        );
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
  };

  const addLike = async (blogId, likes) => {
    const newBlog = await blogService.addLike(blogId, likes);
    const newBlogWithUserName = {
      ...newBlog,
      user: {
        id: newBlog.user,
        username: user.username,
        name: user.name,
      },
    };
    const newBlogs = blogs.map((blog) =>
      blog.id !== blogId ? blog : newBlogWithUserName
    );
    sortBlogs(newBlogs);
  };

  const deleteBlog = async (blogId) => {
    const response = await blogService.deleteBlog(blogId);
    if (response.status !== 204) {
      setStatus("error");
      setNotification(`Could not Delete`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      return;
    }
    const newBlogs = blogs.filter((blog) => blog.id !== blogId);
    sortBlogs(newBlogs);
  };

  const blogFormRef = useRef();

  const blogForm = () => {
    return (
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    );
  };

  if (user === null) {
    return loginForm();
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && <div className={status}>{notification}</div>}
      <p>
        {user.username} logged in&nbsp;
        <button onClick={() => handleLogOut()}>log out</button>
      </p>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          addLike={addLike}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;

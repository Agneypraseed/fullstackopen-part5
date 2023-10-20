import axios from "axios";
const baseUrl = "http://localhost:3003/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const addLike = async (id, likes) => {
  const response = await axios.put(`${baseUrl}/${id}`, { likes });
  if (response.status === 200) return response.data;
};

export default { getAll, setToken, createBlog, addLike };

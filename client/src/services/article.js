import axios from "axios";
import backendUrl from "../backendUrl";
import { token } from "./auth";

const baseUrl = `${backendUrl}/api/articles`;

const setConfig = () => {
  return {
    headers: { "x-auth-token": token },
  };
};

const getAllArticles = async () => {
  const response = await axios.get(`${baseUrl}`);
  console.log(response.data);
  return response.data;
};

const getArticleById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, setConfig());
  return response.data;
};

const addNewArticle = async (articleObj) => {
  const response = await axios.post(`${baseUrl}`, articleObj, setConfig());
  return response.data;
};

const updateArticle = async (articleObj, id) => {
  const response = await axios.put(`${baseUrl}/${id}`, articleObj, setConfig());
  return response.data;
};

const deleteArticle = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, setConfig());
  return response.data;
};

const articleService = {
  getAllArticles,
  getArticleById,
  addNewArticle,
  updateArticle,
  deleteArticle,
};

export default articleService;

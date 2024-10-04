const express = require("express");
const { auth } = require("../utils/middleware");
const {
  createArticle,
  getAllArticles,
  updateArticle,
  getArticleById,
  deleteArticle,
} = require("../controllers/articleController");

const router = express.Router();

router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.post("/", auth, createArticle);
router.put("/:id", auth, updateArticle);
router.delete("/:id", auth, deleteArticle);

module.exports = router;

import express from "express";
import { PostsController } from "../controller/PostsController";
import { PostsBusiness } from "../business/PostsBusiness";
import { PostDatabase } from "../database/PostsDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { likeDislikeDatabase } from "../database/LikeDislikeDatabase";
import { CommentDatabase } from "../database/CommentDatabase";
import { LikeDislikeCommentDatabase } from "../database/LikeDislikeCommentDatabase";
import { TokenManager } from "../services/TokenManager";
import { IdGerator } from "../services/IdGerator";

export const postsRoutes = express.Router();

const postsController = new PostsController(
  new PostsBusiness(
    new PostDatabase(),
    new UserDatabase(),
    new likeDislikeDatabase(),
    new CommentDatabase(),
    new LikeDislikeCommentDatabase(),
    new TokenManager(),
    new IdGerator()
  )
);

postsRoutes.get("/", postsController.getAllPosts);
postsRoutes.get("/:id/comment", postsController.getPostsById);

postsRoutes.post("/", postsController.createPost);

postsRoutes.put("/", postsController.editPost);
postsRoutes.put("/:id/like", postsController.likeDislikePost);

postsRoutes.delete("/", postsController.deletePost);

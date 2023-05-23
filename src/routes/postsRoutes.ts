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
import { CommnetController } from "../controller/CommentController";
import { CommentBusiness } from "../business/CommentBusiness";

export const postsRoutes = express.Router();

const postsController = new PostsController(
  new PostsBusiness(
    new PostDatabase(),
    new UserDatabase(),
    new likeDislikeDatabase(),
    new CommentDatabase(),
    new TokenManager(),
    new IdGerator(),
    new LikeDislikeCommentDatabase()
  )
);

const commentController = new CommnetController(
  new CommentBusiness(
    new PostDatabase(),
    new CommentDatabase(),
    new LikeDislikeCommentDatabase(),
    new TokenManager(),
    new IdGerator()
  )
);

postsRoutes.get("/", postsController.getAllPosts);
postsRoutes.get("/:id", postsController.getPostsById);

postsRoutes.post("/", postsController.createPost);
postsRoutes.post("/:id/comment", commentController.createComment);
postsRoutes.post("/:id/post/like", postsController.likesOrDislikes);
postsRoutes.post("/:id/comment/like", commentController.likesOrDislikesComment);

postsRoutes.put("/:id/post", postsController.editPosts);
postsRoutes.put("/:id/comment", commentController.editComment);

postsRoutes.delete("/:id/post", postsController.deletePost);
postsRoutes.delete("/:id/comment");

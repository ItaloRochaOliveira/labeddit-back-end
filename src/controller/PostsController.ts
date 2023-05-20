import { Request, Response } from "express";
import { PostsBusiness } from "../business/PostsBusiness";
import { UpdatePostScheme } from "../dtos/postDTO/updatePost.dto";
import { CreatePostScheme } from "../dtos/postDTO/createPost.dto";
import { GetPostSchema } from "../dtos/postDTO/GetPosts.dto";
import { DeletePostScheme } from "../dtos/postDTO/deletePost.dto";
import { likeOrDislikeScheme } from "../dtos/postDTO/LikeOrDislike.dto";
import { ZodError } from "zod";
import { BaseError } from "../customErrors/BaseError";
import { GetPostByIdSchema } from "../dtos/postDTO/GetPostsById.dto";

export class PostsController {
  constructor(private postsBusiness: PostsBusiness) {}

  getAllPosts = async (req: Request, res: Response) => {
    try {
      const token = GetPostSchema.parse({
        token: req.headers.authorization,
      });

      const posts = await this.postsBusiness.getAllPosts(token);

      res.status(200).send(posts);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("erro inesperado");
      }
    }
  };

  getPostsById = async (req: Request, res: Response) => {
    try {
      const input = GetPostByIdSchema.parse({
        idPost: req.params.id,
        token: req.headers.authorization,
      });

      const posts = await this.postsBusiness.getPostsById(input);

      res.status(200).send(posts);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("erro inesperado");
      }
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const userPost = CreatePostScheme.parse({
        token: req.headers.authorization,
        content: req.body.content,
      });

      const result = await this.postsBusiness.createPost(userPost);

      res.status(200).send(result);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("erro inesperado");
      }
    }
  };

  editPosts = async (req: Request, res: Response) => {
    try {
      const intensForUpdate = UpdatePostScheme.parse({
        token: req.headers.authorization,
        id: req.params.id,
        content: req.body.content,
      });

      const response = await this.postsBusiness.editPost(intensForUpdate);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("erro inesperado");
      }
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const postForDelete = DeletePostScheme.parse({
        token: req.headers.authorization,
        id: req.params.id,
      });

      const response = await this.postsBusiness.deletePost(postForDelete);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("erro inesperado");
      }
    }
  };

  likesOrDislikes = async (req: Request, res: Response) => {
    try {
      const postLikeOrDislike = likeOrDislikeScheme.parse({
        token: req.headers.authorization,
        id: req.params.id,
        like: req.body.like,
      });

      const response = await this.postsBusiness.likeOrDislike(
        postLikeOrDislike
      );

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("erro inesperado");
      }
    }
  };
}

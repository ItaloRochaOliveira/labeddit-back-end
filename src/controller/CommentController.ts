import { Request, Response } from "express";
import { DeletePostScheme } from "../dtos/postDTO/deletePost.dto";
import { ZodError } from "zod";
import { BaseError } from "../customErrors/BaseError";
import { CommentBusiness } from "../business/CommentBusiness";
import { CreateCommentScheme } from "../dtos/commentDTO/createComment.dto";
import { UpdateCommentScheme } from "../dtos/commentDTO/updatePost.dto";
import { likeOrDislikeCommentScheme } from "../dtos/commentDTO/LikeOrDislikeComment.dto";
import { DeleteCommentScheme } from "../dtos/commentDTO/deletePost.dto";

export class CommnetController {
  constructor(private commentBusiness: CommentBusiness) {}

  createComment = async (req: Request, res: Response) => {
    try {
      const userComment = CreateCommentScheme.parse({
        token: req.headers.authorization,
        content: req.body.content,
        idPost: req.params.id,
      });

      const result = await this.commentBusiness.createCommentsByIdPost(
        userComment
      );

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

  editComment = async (req: Request, res: Response) => {
    try {
      const intensForUpdate = UpdateCommentScheme.parse({
        token: req.headers.authorization,
        idPost: req.params.id,
        content: req.body.content,
      });

      const response = await this.commentBusiness.editCommentsByIdPost(
        intensForUpdate
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

  deleteComment = async (req: Request, res: Response) => {
    try {
      const CommentForDelete = DeleteCommentScheme.parse({
        token: req.headers.authorization,
        id: req.params.id,
      });

      const response = await this.commentBusiness.deleteCommentsByIdPost(
        CommentForDelete
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

  likesOrDislikesComment = async (req: Request, res: Response) => {
    try {
      const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
        token: req.headers.authorization,
        id: req.params.id,
        like: req.body.like,
      });

      const response = await this.commentBusiness.likeOrDislikeComments(
        commentLikeOrDislike
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

import { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getCommentsByAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentsByAuthor(authorId as string);
    res.status(200).json({ result });
  } catch (e) {
    next(e);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.deleteComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.updateComment(
      commentId as string,
      req.body,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const moderateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;

    const result = await commentService.moderateComment(
      commentId as string,
      req.body
    );
    res.status(200).json(result);
  } catch (e: any) {
    next(e);
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};

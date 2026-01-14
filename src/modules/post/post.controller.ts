import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { boolean, string } from "better-auth/*";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (e: any) {
    next(e);
  }
};

const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const searchType = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const authorId = req.query.authorId as string | undefined;

    const isFeatured: boolean | undefined =
      req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined;
    const status: PostStatus | undefined =
      req.query.status === "DRAFT"
        ? "DRAFT"
        : req.query.status === "PUBLISHED"
        ? "PUBLISHED"
        : req.query.status === "ARCHIVED"
        ? "ARCHIVED"
        : undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postService.getAllPost({
      search: searchType,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post Id is required!");
    }
    const result = await postService.getPostById(postId);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const result = await postService.getMyPosts(user?.id as string);
    res.status(200).json(result);
  } catch (e: any) {
    next(e);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }

    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const { postId } = req.params;
    const isAdmin = UserRole.ADMIN === user.role;
    const result = await postService.deletePost(
      postId as string,
      user.id,
      isAdmin
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await postService.getStats();
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};

import { Request, Response } from "express";
import { postService } from "./post.service";
import { boolean, string } from "better-auth/*";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (err: any) {
    const errorMessage = err?.message || "Unknown error";
    res.status(400).json({
      error: "Post creation failed",
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
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
  } catch (err) {
    res.status(400).json({
      error: "Post getting error",
      details: err,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post Id is required!");
    }
    const result = await postService.getPostById(postId);

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post creation failed",
      details: e,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const result = await postService.getMyPosts(user?.id as string);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Post getting error",
      details: e.message,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
};

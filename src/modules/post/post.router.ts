import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getMyPosts
);
router.get("/", postController.getAllPost);
router.get("/:postId", postController.getPostById);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);
router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.updatePost
);

router.delete(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.deletePost
);

export const postRouter = router;

import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  console.log(payload);
  return await prisma.comment.create({
    data: payload,
  });
};

export const commentService = {
  createComment,
};

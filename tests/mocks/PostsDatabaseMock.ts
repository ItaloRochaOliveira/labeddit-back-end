import { BaseDatabase } from "../../src/database/BaseDatabase";
import { PostDB } from "../../src/models/Post";

const postsMock: PostDB[] = [
  {
    id: "id-do-post-1-mock",
    content: "Primeiro post para test",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
    creator_id: "id-do-normal",
  },
  {
    id: "id-do-post-2-mock",
    content: "Segundo post para test",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
    creator_id: "id-do-admin",
  },
];

export class PostDatabaseMock extends BaseDatabase {
  private POST_TABLE = "post";

  findAllPosts = async (): Promise<PostDB[]> => {
    return postsMock;
  };

  findPostById = async (id: string): Promise<PostDB[]> => {
    const postsDB: PostDB[] = postsMock.filter(
      (postMock) => postMock.id === id
    );

    return postsDB;
  };

  createPost = async (newPost: PostDB): Promise<void> => {};

  editPost = async (newPost: PostDB, id: string): Promise<any> => {};

  deletePost = async (id: string): Promise<any> => {};
}

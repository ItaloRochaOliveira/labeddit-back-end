import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  private POST_TABLE = "post";

  findAllPosts = async (): Promise<PostDB[]> => {
    const postsDB: PostDB[] = await BaseDatabase.connection(this.POST_TABLE);

    return postsDB;
  };

  findPostById = async (id: string): Promise<PostDB[]> => {
    const postsDB: PostDB[] = await BaseDatabase.connection(
      this.POST_TABLE
    ).where(id);

    return postsDB;
  };

  createPost = async (newPost: PostDB): Promise<void> => {
    await BaseDatabase.connection(this.POST_TABLE).insert(newPost);
  };

  editPost = async (newPost: PostDB, id: string): Promise<any> => {
    await BaseDatabase.connection(this.POST_TABLE).update(newPost).where(id);
  };

  deletePost = async (id: string): Promise<any> => {
    await BaseDatabase.connection(this.POST_TABLE).del().where(id);
  };
}

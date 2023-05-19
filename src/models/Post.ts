export interface PostModel {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  creator: CreatorObj | undefined;
}

export interface PostDB {
  id: string;
  creator_id?: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

interface CreatorObj {
  id: string;
  name: string;
}

export class Post {
  constructor(
    private id: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string,
    private creator?: CreatorObj,
    private creatorId?: string
  ) {}

  public get ID(): string {
    return this.id;
  }

  public get CONTENT(): string {
    return this.content;
  }

  public get LIKES(): number {
    return this.likes;
  }

  public get DISLIKES(): number {
    return this.dislikes;
  }

  public get CREATEDAT(): string {
    return this.createdAt;
  }

  public get UPDATEDAT(): string {
    return this.updatedAt;
  }

  public get CREATOR(): CreatorObj | undefined {
    return this.creator;
  }

  public set ID(newId: string) {
    this.id = newId;
  }

  public set CONTENT(newContent: string) {
    this.content = newContent;
  }

  public set LIKES(newLikes: number) {
    this.likes = newLikes;
  }

  public set DISLIKES(newDislikes: number) {
    this.dislikes = newDislikes;
  }

  public set CREATEDAT(newCreatedAt: string) {
    this.createdAt = newCreatedAt;
  }

  public set UPDATEDAT(newUpdateAt: string) {
    this.updatedAt = newUpdateAt;
  }

  public set CREATOR(newCreator: CreatorObj | undefined) {
    this.creator = newCreator;
  }

  public PostToDB(): PostDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

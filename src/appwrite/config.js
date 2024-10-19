import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteurl)
      .setProject(conf.appwriteProjectid);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userid }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseid,
        conf.appwriteCollectionid,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userid,
        }
      );
    } catch (error) {
      console.log("create post error " + error);
    }
  }
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseid,
        conf.appwriteCollectionid,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("update post error " + error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseid,
        conf.appwriteCollectionid,
        slug
      );
      return true;
    } catch (error) {
      console.log("delete post error " + error);
      return false;
    }
  }

  async getpost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseid,
        conf.appwriteCollectionid,
        slug
      );
    } catch (error) {
      console.log("get post error " + error);
      return false;
    }
  }

  async getposts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseid,
        conf.appwriteCollectionid,
        queries
      );
    } catch (error) {
      console.log("get all post error " + error);
      return false;
    }
  }

  //file upload services

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketid,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("upload file error " + error);
      return false;
    }
  }

  async deleteFile(fileID) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketid, fileID);
    } catch (error) {
      console.log("delete file error " + error);
      return false;
    }
  }

  getFilePreview(fileID) {
    return this.bucket.getFilePreview(conf.appwriteBucketid, fileID);
  }
}

const service = new Service();

export default service;

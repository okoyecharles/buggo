import { Response } from "express";
import Project, { ProjectType } from './../models/projectModel';
import AuthorizedRequest from '../types/request';

export const createProject = async (req: AuthorizedRequest<ProjectType>, res: Response) => {
  const { title } = req.body;
  const project = new Project({
    title,
    author: req.user
  });

  try {
    const newProject = await project.save();
    res.status(201).json({ project: newProject });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


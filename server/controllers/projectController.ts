import { Request, Response } from "express";
import Project, { ProjectType } from './../models/projectModel';
import AuthorizedRequest from '../types/request';

/*
* @route   POST /projects
* @desc    Create a new project
* @access  Private
*/
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

/*
* @route   GET /projects
* @desc    Get all projects
* @access  Private
*/
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate('author', 'name');
    res.status(200).json({ projects });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
* @route   GET /projects/:id
* @desc    Get a project by id
* @access  Private
*/
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project
      .findById(id)
      .populate('author', 'name');
    
    res.status(200).json({ project });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
* @route   PUT /projects/:id
* @desc    Update a project by id
* @access  Private
*/
export const updateProject = async (req: AuthorizedRequest<ProjectType>, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const project = await Project
      .findById(id)
      .populate('author', 'name');
    
    if (project?.author.id !== req.user) {
      return res.status(401).json({ message: 'User not authorized' })
    }

    if (project) {
      project.title = title;
      const updatedProject = await project.save();
      res.status(200).json({ project: updatedProject });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
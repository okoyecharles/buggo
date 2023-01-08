import { Request, Response } from "express";
import AuthorizedRequest from '../types/request';
import Ticket, { TicketType } from "../models/ticketModel";
import Project, { ProjectType } from './../models/projectModel';

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
      .populate('author', 'name')
      .populate('tickets')
      .populate('team', "name image email");
    
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
    const { title, team } = req.body;
    const project = await Project
      .findById(id)
      .populate('author', 'name');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found'})
    };
  
    if (project?.author.id !== req.user) {
      return res.status(401).json({ message: 'User not authorized' })
    }

    if (project) {
      if (title) project.title = title;
      if (team) project.team = team;

      const updatedProject = await project.save();
      res.status(200).json({ project: updatedProject });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
* @route   DELETE /projects/:id
* @desc    Delete a project by id
* @access  Private
*/
export const deleteProject = async (req: AuthorizedRequest<ProjectType>, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project
      .findById(id)
      .populate('author', 'name');
    
    if (project?.author.id !== req.user) {
      return res.status(401).json({ message: 'User not authorized' })
    }

    if (project) {
      await project.remove();
      res.status(200).json({ message: 'Project removed' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
*  @route   POST /projects/:id/tickets
*  @desc    Create ticket for a project
*  @access  Private
*/
export const createTicket = async (req: AuthorizedRequest<TicketType>, res: Response) => {
  const { priority, status, type, time_estimate, title, description } = req.body;
  const { id } = req.params;

  // Get ticket's project and author
  const ticketProject = await Project.findById(id);
  const ticketAuthor: any = req.user;

  let ticket = new Ticket({
    priority,
    status,
    type,
    time_estimate,
    title,
    description
  });

  try {
    // Assign project and author to tickets relationship
    ticket.project = ticketProject?.id;
    ticket.author = ticketAuthor;

    ticket = await ticket.save();

    // Assign ticket to projects relationship
    ticketProject?.tickets.push(ticket._id);
    await ticketProject?.save();
  
    res.status(200).json({ ticket });
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

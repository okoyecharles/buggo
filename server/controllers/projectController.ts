import { Request, Response } from 'express';
import AuthorizedRequest from '../types/request';
import Ticket, { TicketType } from '../models/ticketModel';
import Project, { ProjectType } from './../models/projectModel';
import { Types } from 'mongoose';
import { pusher, pusherChannel } from '..';

const fetchProject = async (id: Types.ObjectId | string) => {
  const project = await Project.findById(id)
    .populate('author', 'name')
    .populate('team', 'name image email')
    .populate({
      path: 'tickets',
      populate: {
        path: 'team',
        select: 'name image email',
      },
    })
    .populate('invitees.user', 'name image email');

  return project;
};

/*
 * @route   GET /projects
 * @desc    Get all projects
 * @access  Private
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .populate('author', 'name')
      .populate('team', 'name email image')
      .populate('invitees.user', 'name image email')
      .sort({ createdAt: -1 });

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
    const project = await fetchProject(id);

    res.status(200).json({ project });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
 * @route   POST /projects
 * @desc    Create a new project
 * @access  Private
 */
export const createProject = async (
  req: AuthorizedRequest<ProjectType>,
  res: Response
) => {
  try {
    const { title } = req.body;
    const socketId = req.headers['x-pusher-socket-id'];
    const project = new Project({
      title,
      author: req.user,
      team: [req.user],
    });

    const newProject = await project.save();
    await pusher.trigger(
      pusherChannel,
      'project-create',
      {
        projectId: newProject?._id.toString(),
      },
      { socket_id: socketId as string }
    );
    const returnProject = await fetchProject(newProject._id);
    res.status(201).json({ project: returnProject });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
 * @route   PUT /projects/:id
 * @desc    Update a project by id
 * @access  Private
 */
export const updateProject = async (
  req: AuthorizedRequest<ProjectType>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { title, team } = req.body;
    const socketId = req.headers['x-pusher-socket-id'];
    const project = await Project.findById(id).populate('author', 'name');

    if (!project)
      return res.status(404).json({ message: 'Project not found' });

    if (project?.author._id.toString() !== req.user && !req.admin)
      return res.status(401).json({ message: 'User not authorized' });

    if (title) project.title = title;
    if (team) project.team = team;

    const updatedProject = await project.save();
    await pusher.trigger(
      pusherChannel,
      'project-update',
      {
        projectId: updatedProject?._id.toString(),
      },
      { socket_id: socketId as string }
    );
    const returnProject = await fetchProject(updatedProject.id);
    res.status(200).json({ project: returnProject });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
  * @route   PUT /projects/:id/invite
  * @desc    Invite users to a project
  * @access  Private
*/
export const inviteToProject = async (
  req: AuthorizedRequest<ProjectType>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { invitees } = req.body;
    const socketId = req.headers['x-pusher-socket-id'];
    const project = await Project.findById(id).populate('author', 'name');

    if (!project)
      return res.status(404).json({ message: 'Project not found' });

    if (project?.author.id.toString() !== req.user && !req.admin)
      return res.status(401).json({ message: 'User not authorized' });

    project.invitees = [...project.invitees, ...invitees];

    const updatedProject = await project.save();
    await pusher.trigger(
      pusherChannel,
      'project-invite',
      {
        projectId: updatedProject?._id.toString(),
      },
      { socket_id: socketId as string }
    );

    const returnProject = await fetchProject(updatedProject.id);

    res.status(200).json({ project: returnProject });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
  * @route   PUT /projects/:id/accept-invite
  * @desc    Accept an invite to a project
  * @access  Private
*/
export const acceptInvite = async (
  req: AuthorizedRequest<ProjectType>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const socketId = req.headers['x-pusher-socket-id'];
    const project = await Project.findById(id).populate('author', 'name');

    if (!project)
      return res.status(404).json({ message: 'Project not found' });

    const invitees = project.invitees.map((invitee) => {
      return invitee.user.toString();
    });

    if (invitees.includes(req.user as string)) {
      project.invitees = project.invitees.filter(
        (invitee) => invitee.user.toString() !== req.user
      );

      project.team.push(req.user as any);
      await project.save();
      await pusher.trigger(
        pusherChannel,
        'accept-project-invite',
        {
          projectId: project?._id.toString(),
        },
        { socket_id: socketId as string }
      );

      const returnProject = await fetchProject(project.id);

      res.status(200).json({ project: returnProject });
    } else {
      res.status(400).json({ message: 'Invitation invalid or expired' });
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
export const deleteProject = async (
  req: AuthorizedRequest<ProjectType>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const socketId = req.headers['x-pusher-socket-id'];
    const project = await Project.findById(id).populate('author', 'name');

    if (!project)
      return res.status(404).json({ message: 'Project not found' });

    if (project.author._id.toString() !== req.user && !req.admin)
      return res.status(401).json({ message: 'User not authorized' });

    await project.remove();
    await pusher.trigger(pusherChannel, 'delete-project', {
      projectId: id,
    }, {
      socket_id: socketId as string
    });

    res.status(200).json({ message: 'Project removed' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
 *  @route   POST /projects/:id/tickets
 *  @desc    Create ticket for a project
 *  @access  Private
 */
export const createTicket = async (
  req: AuthorizedRequest<TicketType & { socketId: string }>,
  res: Response
) => {
  const { priority, status, type, time_estimate, title, description } =
    req.body;
  const { id } = req.params;
  const socketId = req.headers['x-pusher-socket-id'];

  try {
    // Get ticket's project and author
    const ticketProject = await Project.findById(id);
    const ticketAuthor: any = req.user;

    let ticket = new Ticket({
      priority,
      status,
      type,
      time_estimate,
      title,
      description,
    });

    // Assign project and author to tickets relationship
    ticket.project = ticketProject?.id;
    ticket.author = ticketAuthor;

    const ticketProjectMembers = ticketProject?.team.map((member) => {
      return member.toString();
    });

    if (!req.admin && !ticketProjectMembers?.some((member) => member === req.user)) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    ticket = await ticket.save();
    await pusher.trigger(
      pusherChannel,
      'create-project-ticket',
      {
        ticket: {
          _id: ticket.id.toString(),
          author: ticket.author.toString(),
        },
      },
      { socket_id: socketId as string }
    );

    // Assign ticket to project's relationship
    ticketProject?.tickets.unshift(ticket._id);
    await ticketProject?.save();

    res.status(200).json({ ticket });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
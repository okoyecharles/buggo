import { CommentType } from './../models/commentModel';
import { Response } from 'express';
import Ticket, { TicketType } from '../models/ticketModel';
import Project from '../models/projectModel';
import AuthorizedRequest from '../types/request';
import Comment from '../models/commentModel';
import { pusher, pusherChannel } from '..';

const fetchTicket = async (id: string) => {
  const ticket = Ticket.findById(id)
    .populate('author', 'name')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'name image email'
      }
    })
    .populate('team', 'name image email');

  return ticket;
}

/*
* @route    GET /tickets
* @desc     Get all tickets created by a specific user
* @access   Private
*/
export const getUserTickets = async (req: AuthorizedRequest<TicketType>, res: Response) => {
  try {
    const tickets = await Ticket.find({ author: req.user }).populate('project', 'title');
    res.status(200).json({ tickets });
  } catch (error: any) {
    res.status(200).json({ message: error.message });
  }
}

/*
* @route    GET /tickets/:id
* @desc     Get a ticket by id
* @access   Private
*/
export const getTicketById = async (req: AuthorizedRequest<TicketType>, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await fetchTicket(id);
    res.status(200).json({ ticket });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
* @route    PUT /tickets/:id
* @desc     Update a ticket by id
* @access   Private
*/
export const updateTicketById = async (req: AuthorizedRequest<TicketType>, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, type, time_estimate, team, comments } = req.body;
    const socketId = req.headers['x-pusher-socket-id'];
    const ticket = await Ticket.findById(id);
    const project = await Project.findById(ticket?.project);
    const projectTeam = project!.team.map((member) => member.toString());

    if (!ticket)
      return res.status(404).json({ message: 'Ticket not found' });

    if (
      !req.admin &&
      ticket.author.toString() !== req.user &&
      project?.author.toString() !== req.user &&
      !projectTeam.includes(req.user as string)
    )
      return res.status(401).json({ message: 'User not authorized' });

    await Ticket.updateOne({ _id: id }, {
      title,
      description,
      priority,
      status,
      type,
      time_estimate,
      team,
      comments
    });
    pusher.trigger(pusherChannel, 'update-project-ticket', {
      ticket: {
        _id: id,
        author: ticket?.author._id.toString(),
      },
    }, {
      socket_id: socketId as string
    });

    const updatedTicket = await fetchTicket(id);

    res.status(200).json({ ticket: updatedTicket });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

/*
* @route    DELETE /tickets/:id
* @desc     Delete a ticket
* @access   Private
*/
export const deleteTicket = async (req: AuthorizedRequest<TicketType>, res: Response) => {
  try {
    const { id } = req.params;
    const socketId = req.headers['x-pusher-socket-id'];

    const ticket = await Ticket.findById(id);
    const project = await Project.findById(ticket?.project);

    if (!ticket)
      return res.status(404).json({ message: 'Ticket not found' });

    if (!project)
      return res.status(404).json({ message: 'Project not found' });

    if (
      !req.admin &&
      ticket?.author.toString() !== req.user &&
      project?.author.toString() !== req.user
    ) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await ticket.remove();
    pusher.trigger(pusherChannel, 'delete-project-ticket', {
      ticket: {
        _id: id,
        author: ticket.author._id.toString(),
      },
    }, {
      socket_id: socketId as string
    });


    // Remove ticket reference from the project without using pull
    project.tickets = project.tickets.filter((ticketId) => ticketId.toString() !== id);
    await project?.save();

    res.status(200).json({ message: 'Ticket removed' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/*
* @route    POST /tickets/:id/comments
* @desc     Comment on a ticket
* @access   Private
*/
export const createTicketComment = async (req: AuthorizedRequest<CommentType>, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const author = req.user;
    const ticket: any = await Ticket.findById(id).populate('project', 'author');
    const project = ticket?.project;
    const socketId = req.headers['x-pusher-socket-id'];

    if (!ticket)
      return res.status(404).json({ message: 'Comment\'s ticket not found' });

    if (
      !req.admin &&
      ticket?.author.toString() !== req.user &&
      project?.author.toString() !== req.user &&
      !ticket?.team.some((member: any) => member.toString() === req.user)
    )
      return res.status(401).json({ message: 'User not authorized' });

    const comment = await Comment.create({
      text,
      author: author,
      ticket: ticket?._id
    });
    pusher.trigger(pusherChannel, 'new-ticket-comment', {
      ticketId: id,
      comment: {
        _id: comment?._id.toString(),
        author: comment?.author.toString(),
      }
    }, {
      socket_id: socketId as string
    });

    // Add comment reference to the ticket
    ticket?.comments.push(comment.id);
    await ticket?.save();

    const savedComment = await Comment.findById(comment.id)
      .populate('author', 'name image email');

    res.status(200).json({ comment: savedComment });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

/*
  * @route    GET /tickets/:id/comments/:commentId
  * @desc     Get a comment
  * @access   Private
*/

export const getTicketComment = async (req: AuthorizedRequest<CommentType>, res: Response) => {
  try {
    const { id, commentId } = req.params;

    const comment = await Comment.findById(commentId)
      .populate('author', 'name image email');

    if (comment?.ticket.toString() !== id)
      return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json({ comment });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}
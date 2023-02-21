import { CommentType } from './../models/commentModel';
import { Response } from 'express';
import Ticket, { TicketType } from '../models/ticketModel';
import Project from '../models/projectModel';
import AuthorizedRequest from '../types/request';
import Comment from '../models/commentModel';
import { pusher, pusherChannel } from '..';

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

    // Get a ticket by id and populate the author and comments (with comments author)
    const ticket = await Ticket.findById(id).populate('author', 'name').populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'name image email'
      }
    });

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
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.author.toString() !== req.user) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (ticket) {
      await ticket.update({
        $set: {
          title,
          description,
          priority,
          status,
          type,
          time_estimate,
          team,
          comments
        }
      });
      const updatedTicket = await Ticket.findById(id).populate('author', 'name').populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name image email'
        }
      });

      pusher.trigger(pusherChannel, 'update-project-ticket', {
        ticket: {
          _id: id,
          author: updatedTicket?.author._id.toString(),
        },
      });

      res.status(200).json({ ticket: updatedTicket });
    };
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
    const ticket = await Ticket.findById(id).populate('author', 'name');
    const project = await Project.findById(ticket?.project);

    if (ticket?.author._id.toString() !== req.user) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (ticket && project) {
      await ticket.remove();
      // Remove ticket reference from the project without using pull
      project.tickets = project.tickets.filter((ticketId) => ticketId.toString() !== id);
      await project?.save();

      pusher.trigger(pusherChannel, 'delete-project-ticket', {
        ticket: {
          _id: id,
          author: ticket.author._id.toString(),
        },
      });

      res.status(200).json({ message: 'Ticket removed' });
    }
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
    const commentAuthor = req.user;
    const commentTicket = await Ticket.findById(id);

    const comment = await Comment.create({
      text,
      author: commentAuthor,
      ticket: commentTicket?._id
    });

    // Add comment reference to the ticket
    commentTicket?.comments.push(comment.id);
    await commentTicket?.save();

    const savedComment = await Comment.findById(comment.id)
      .populate('author', 'name image email');

    pusher.trigger(pusherChannel, 'new-ticket-comment', {
      ticketId: id,
      comment: {
        _id: savedComment?._id.toString(),
        author: savedComment?.author._id.toString(),
      }
    });

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
    const ticket = await Ticket.findById(id);

    if (!comment || !ticket)
      return res.status(404).json('Comment not found');

    if (!ticket?.comments.includes(comment?._id))
      return res.status(404).json({
        message: 'Couldn\'t find comment in specified ticket'
      })

    res.status(200).json({ comment });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}
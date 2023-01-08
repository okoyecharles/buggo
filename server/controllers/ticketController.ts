import { CommentType } from './../models/commentModel';
import { Response } from 'express';
import Ticket, { TicketType } from '../models/ticketModel';
import AuthorizedRequest from '../types/request';
import Comment from '../models/commentModel';

/*
* @route    GET /tickets
* @desc     Get all tickets created by a specific user
* @access   Private
*/
export const getUserTickets = async (req: AuthorizedRequest<TicketType>, res: Response) => {
  try {
    const tickets = await Ticket.find({ author: req.user });
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
      const updatedTicket = await Ticket.findById(id);
      res.status(200).json({ ticket: updatedTicket });
    };
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

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

    res.status(200).json({ comment });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}

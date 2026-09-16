import { validateIdList } from './common';

// The values the selects offer, and the only ones the server accepts.
export const ticketStatus = { open: 'open', closed: 'closed' };
export const ticketStatuses = Object.values(ticketStatus);
export const ticketPriorities = ['low', 'medium', 'high'];
export const ticketTypes = ['issue', 'feature', 'bug', 'other'];

export const validateTicketTitle = (title: string) => {
  // validate title is not empty
  if (!title.trim()) {
    return 'Title cannot be empty';
  };

  // validate title is not shorter than 5 characters
  if (title.length < 5) {
    return 'Title cannot be shorter than 5 characters';
  }

  // validate title is not longer than 50 characters
  if (title.length > 50) {
    return 'Title cannot be longer than 50 characters';
  }
  return null;
}

export const validateTicketDescription = (description: string) => {
  // validate description is not empty
  if (!description.trim()) {
    return 'Description cannot be empty';
  };
  // validate description is not longer than 500 characters
  if (description.length > 500) {
    return 'Description is too long';
  }
  return null;
}

export const validateTicketPriority = (priority: string) => {
  // validate priority is not empty
  if (!priority.trim()) {
    return 'Please select one';
  };

  // validate priority is one of the offered options
  if (!ticketPriorities.includes(priority)) {
    return 'Please select one';
  }
  return null;
}

export const validateTicketType = (type: string) => {
  // validate type is not empty
  if (!type.trim()) {
    return 'Please select one';
  };

  // validate type is one of the offered options
  if (!ticketTypes.includes(type)) {
    return 'Please select one';
  }
  return null;
}

export const validateTicketStatus = (status: string) => {
  // validate status is one of the offered options
  if (!ticketStatuses.includes(status)) {
    return 'Please select one';
  }
  return null;
}

export const validateTicketTeam = (team: any) => {
  return validateIdList(team, 'Team');
}

export const validateTicketTimeEstimate = (timeEstimate: number | string) => {
  // validate time_estimate is not empty
  if (!+timeEstimate) {
    return 'Enter a valid number';
  };
  return null;
}
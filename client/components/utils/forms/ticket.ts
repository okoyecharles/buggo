export const validateTicketTitle = (title: string) => {
  // validate title is not empty
  if (!title.trim()) {
    return 'Title cannot be empty';
  };
  // validate title is not longer than 50 characters
  if (title.length > 25) {
    return 'Title cannot be longer than 25 characters';
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
  return null;
}

export const validateTicketType = (type: string) => {
  // validate type is not empty
  if (!type.trim()) {
    return 'Please select one';
  };
  return null;
}

export const validateTicketTimeEstimate = (timeEstimate: number | string) => {
  // validate time_estimate is not empty
  if (!+timeEstimate) {
    return 'Enter a valid number';
  };
  return null;
}
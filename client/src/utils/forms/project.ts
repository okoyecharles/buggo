import { validateIdList, isObjectId } from './common';
import { validateEmail } from './register';

export const validateProjectTitle = (title: string) => {
  // validate title is not empty
  if (!title.trim()) {
    return 'Title cannot be empty';
  };

  // validate title is not shorter than 5 characters
  if (title.length < 5) {
    return 'Title must be at least 5 characters';
  }

  // validate title is not longer than 25 characters
  if (title.length > 25) {
    return 'Title cannot be longer than 25 characters';
  }
  return null;
};

export const validateProjectTeam = (team: any) => {
  return validateIdList(team, 'Team');
};

export const validateInvitees = (invitees: any) => {
  // validate at least one member is being invited
  if (!Array.isArray(invitees) || invitees.length === 0) {
    return 'Select at least one member to invite';
  }

  // validate every invitee carries a valid user and email
  for (const invitee of invitees) {
    if (!isObjectId(invitee?.user)) {
      return 'An invited member is invalid';
    }
    if (validateEmail(invitee?.email)) {
      return 'An invited member has an invalid email';
    }
  }
  return null;
};

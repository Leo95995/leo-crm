import { ObjectId, Types } from "mongoose";

// Public user interface
export interface PublicUser {
  _id?: any;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  termsCondition: string;
  role?: string;
  password?: string;
}

// Function to sanitize userdata

const sanitizeUserData = (
  user: PublicUser,
  viewerRole: string
): Partial<PublicUser> => {
  const base = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  if (viewerRole === "admin") {
    return {
      ...base,
      _id: user._id,
      termsCondition: user.termsCondition
    };
  }

  if (viewerRole === "manager") {
    return {
      ...base,
      _id: user._id,
      termsCondition: user.termsCondition

    };
  }
  if (viewerRole === "viewer") {
    return {
      ...base,
    };
  }
  return base;
};

// per liste:
const sanitizeUserList = (users: PublicUser[], viewerRole: string) =>
  users.map((user) => sanitizeUserData(user, viewerRole));

export const userSanitizer = { sanitizeUserData, sanitizeUserList };

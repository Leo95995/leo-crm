export interface PublicClient {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  user_id: string;
}

const sanitizeClientDatas = (
  contact: PublicClient,
  viewerRole: string
): Partial<PublicClient> => {
  const base = {
    name: contact.name,
    email: contact?.email,
    phone: contact._id,
    user_id: contact.user_id,
  };

  if (viewerRole === "admin") {
    return {
      ...base,
      _id: contact._id,
    };
  }

  if (viewerRole === "manager") {
    return {
      ...base,
      _id: contact._id,
    };
  }

  //   Viewer don't need contact id because it should not manipulate anything
  if (viewerRole === "viewer") {
    return {
      ...base,
    };
  }
  return base;
};

const sanitizeClientList = (clients: PublicClient[], viewerRole: string) =>
    clients.map((client) => sanitizeClientDatas(client, viewerRole));

export const clientSanitizer = {
  sanitizeClientDatas,
  sanitizeClientList,
};

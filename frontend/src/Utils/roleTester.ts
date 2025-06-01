const verifyOperations = (role: string, allowedRoles: string[]) => {
  if (allowedRoles.includes(role)) {
    return true;
  }
  return false;
};

export const RoleTester = {
  verifyOperations,
};

export const roles = [
  {
    name: "admin",
    permissions: ["create", "read", "update", "delete"],
  },
  {
    name: "manager",
    permissions: ["create", "read"],
  },
  {
    name: "viewer",
    permissions: ["read"],
  },
];

export enum RoleConfiguration {
  FULL = 1,
  HIGH = 2,
  MIDDLE = 3,
  LOW = 4,
}

export const roleConfig = (roleStatus: RoleConfiguration) => {
  switch (roleStatus) {
    case RoleConfiguration.FULL:
      return ["admin"];
    case RoleConfiguration.HIGH:
      return ["admin", "manager"];
    case RoleConfiguration.MIDDLE:
      return ["admin", "manager"];
    case RoleConfiguration.LOW:
      return ["admin", "manager", "viewer"];
  }
};

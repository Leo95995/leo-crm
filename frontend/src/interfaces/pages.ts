export interface UserRole {
  name: string;
  permissions: string[];
}

export interface IPage {
  authorizedRoles: string[];
  userRole : UserRole;
}

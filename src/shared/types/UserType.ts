export interface Permission {
    permissionid: number;
    permissionName: string;
}

export interface Role {
    id: number;
    roleName: string;
    permissions: Permission[];
}

export interface UserType {
    userId: number;
    name: string;
    email: string;
    role: Role;
}
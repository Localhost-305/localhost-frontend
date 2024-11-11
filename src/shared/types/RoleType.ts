import { PermissionsType } from "./PermissionsType";

export interface RoleType {
    id: number;
    roleName: string;
    permissions: PermissionsType[];
}
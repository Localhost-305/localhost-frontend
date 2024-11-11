interface permissions{
    permissionName: string;
    translated: string;
}

export const PERMISSIONS_TRANSLATED: permissions[] = [
    {permissionName: 'allowed_to_add_role', translated: 'Adicionar cargo'},
    {permissionName: 'allowed_to_change', translated: 'Editar usuário'},
    {permissionName: 'allowed_to_import', translated: 'Importar dados'},
    {permissionName: 'allowed_to_see', translated: 'Visualizar dados'},
    {permissionName: 'allowed_to_see_money', translated: 'Visualizar dados financeiros'}
] 
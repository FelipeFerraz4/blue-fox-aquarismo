/**
 * Roles do realm "blue-fox-global-group" (blue-fox-iam). O Keycloak é a fonte da verdade:
 * use só estas constantes em guards e `data.roles`, nunca strings soltas.
 */
export const KeycloakRole = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
  AQUARIUM_ADMIN: 'ROLE_AQUARIUM_ADMIN',
  AQUARIUM_EDITOR: 'ROLE_AQUARIUM_EDITOR',
  AQUARIUM_USER: 'ROLE_AQUARIUM_USER',
} as const;

export type KeycloakRole = (typeof KeycloakRole)[keyof typeof KeycloakRole];

/** Quem gerencia o conteúdo do Aquarismo (painel /admin). */
export const CONTENT_MANAGER_ROLES: KeycloakRole[] = [
  KeycloakRole.ADMIN,
  KeycloakRole.AQUARIUM_ADMIN,
  KeycloakRole.AQUARIUM_EDITOR,
];

/** Ações destrutivas (excluir de vez). */
export const CONTENT_ADMIN_ROLES: KeycloakRole[] = [KeycloakRole.ADMIN, KeycloakRole.AQUARIUM_ADMIN];

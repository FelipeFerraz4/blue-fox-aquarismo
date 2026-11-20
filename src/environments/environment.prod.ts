export const environment = {
  production: true,
  allowedHosts: [
    'bluefoxaquarismo.space',
    'www.bluefoxaquarismo.space',
    '*.bluefoxaquarismo.space',
    '*.bluefoxglobalgroup.com',
  ],
    keycloak: {
        url: 'https://sso.bluefoxglobalgroup.com/auth/',
        realm: 'blue-fox-global-group',
        clientId: 'blue-fox-aquariums-web',
    },
    /** E-mail para correções e contato (troca futura para contato@bluefoxglobalgroup.com é só aqui). */
    contactEmail: 'bluefoxglobalgroup@gmail.com',
    blogApi: {
        blogId: '77e2c400-28ab-4add-b219-112233445566',
        urlBase: 'https://blog-api.bluefoxglobalgroup.com/',
        request: {
            post: 'api/v1/posts',
            category: 'api/v1/categories',
            author: 'api/v1/authors',
            aquarismo: 'api/v1/aquarismo',
        }
    }
};
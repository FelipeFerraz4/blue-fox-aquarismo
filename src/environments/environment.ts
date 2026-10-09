export const environment = {
  production: false,
  allowedHosts: [
    'localhost',
    'localhost:4000',
    '127.0.0.1',
    '127.0.0.1:4000',
  ],
    keycloak: {
        url: 'http://localhost:8080/auth/',
        realm: 'blue-fox-global-group',
        clientId: 'blue-fox-aquariums-web-local',
    },
    blogApi: {
        blogId: '77e2c400-28ab-4add-b219-112233445566',
        urlBase: 'http://localhost:8081/',
        request: {
            post: 'api/v1/posts',
            category: 'api/v1/categories',
            author: 'api/v1/authors',
        } 
    },
};
# securityrat-vuejs

This is an updated version for the SecurityRAT frontend. It is based on Vue.js. It is fully compatible with SecurityRat
1.8.

For testing purpose you can run the frontend with the old backend behind a nginx proxy.
See [NGINX configuration](nginx.conf) and replace `<dev-ip>` with your host IP where you run the frontend.
Replace `<securityRat-ip>` with your securityRat instance IP.

## Run the frontend

```
npm install
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

## What is working

* Editor
* Account
* Browse
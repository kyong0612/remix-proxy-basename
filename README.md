# Remix proxy basename

This example uses a reverse proxy for both a Remix app that has been *mounted* as a sub-route of another app.

To run this app, make sure Docker is running.
```shell
npm run dev
```
Then browse to http://localhost:8000

You'll see that by default, it will serve up the non-Remix app. Click on the `shop` link and you'll now be served the Remix app.

## nginx
We're using `nginx` to mount the Remix app at the `/shop` path. The requirements state that the base path is customizable, so
this config file would be generated when the user configures this path.

We also create the rule for `/__remix__` route to always serve the Remix assets. This
simplifies the process of setting up *remix.config.js* so it doesn't have to be changed
when the user changes the path.

Finally, we proxy everything else to the other app. In our example, this is a simple
Express app running on port 3001 (*other-server.mjs*)


```conf
# nginx.conf
server {
  listen 8000;

  location /shop {
    proxy_pass http://host.docker.internal:3000/shop;
  }
  location /__remix__ {
    proxy_pass http://host.docker.internal:3000/__remix__;
  }
  location / {
    proxy_pass http://host.docker.internal:3001/;
  }

  error_page 500 502 503 504 /50x.html;
  location = /50x.html {
    root /usr/share/nginx/html;
  }
}
```
## remix.config.js

Since Remix needs to serve routes at `/shop/*` and *shop* must be dynamic, we're going to setup routes with a dynamic param `$basename` at the head of our routes. Since we're using `v2` flat routes, we would have to repeat this `$basename` prefix for *every* route.

The `remix-flat-routes` package is a superset of `v2` routes and supports *hybrid* routes. It allows us to use folders to organize our routes.

```js
module.exports = {
  ignoredRouteFiles: ["**/*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  publicPath: "/__remix__/build/",
  serverModuleFormat: "cjs",
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },

```
```
app/routes
└── $basename+
    ├── _index.tsx
    └── products.tsx
```
```xml
<Routes>
  <Route file="root.tsx">
    <Route path=":basename/" index file="routes/$basename+/_index.tsx" />
    <Route path=":basename/products" file="routes/$basename+/products.tsx" />
  </Route>
</Routes>
```

## Remix context
The `basename` is passed to Remix via loader context.
```js
// remix-server.mjs

function getLoadContext(req, res) {
  const basename = req.cookies["basename"] ?? "/shop";
  return { basename };
}

app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? createDevRequestHandler()
    : createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
        getLoadContext, // set remix context
      })
);
```
The *root* `loader` gets the context and returns it as part of the loader data.
```ts
// root.tsx
type AppContext = {
  basename: string;
};

export async function loader({ context }: LoaderArgs) {
  const { basename } = context as AppContext;
  return json({ basename });
}
```
The main reason we need this is so that links work properly. By default, the Remix `<Link>` component will treat all routes as Remix routes and will use React Router to navigate. Since routes outside of `basename` or `/shop` in this case are not in the scope of our Remix app, we need to ensure that the browser treats this as a regular `<a>` element.

We create a custom `<Link>` component that sets the `reloadDocument` prop correctly. It gets the `basename` from the root loader data using a custom hook.
```ts
// components/link.tsx
import { type LinkProps, Link as RemixLink } from '@remix-run/react';
import { useRootLoaderData } from '~/utils/hooks';

// custom Link component that automatically reloads the document if the link is
// external to the app or base path
export function Link({ to, ...props }: LinkProps) {
  const { basename } = useRootLoaderData();
  return (
    <RemixLink
      to={to}
      {...props}
      reloadDocument={props.reloadDocument || !String(to).startsWith(basename)}
    />
  );
}
```

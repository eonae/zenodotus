# Zenodotus

When using GraphQL a tool to visualize the schema would be very handy. And there is one: [graphql-voyager](https://github.com/graphql-kit/graphql-voyager).

Voyager is great if you have a living GraphQL server. Just add a middleware and get a nice looking interactive schema!

The problem comes where you need to share this docs with your teammates. You cirtainly can send them a docker image with your server, or repository so that they can do everything themselves. But both ways aren't very comfortable when collaborating with less "technical" people.

> The downside of voyager is that it needs a real working GraphQL server with introspection.

Here is where **zenodotus** comes to play. The idea is simple: deploy zenodotus as a docker container to machine you like. Set a repository, branch (or tag or event commit hash) and paths to schema files. The service will fetch files, checkout what is needed and run it's own introspection "sub-server".

# Usage

Atm the repository is set with environment variable and the ref is passed by **ref** query parameter (default is _master_)

```
http://localhost:4001?ref=develop
```

# Deploy

See [compose.yaml](/compose.yaml). Note that two ports must be forwarded - one for the voyager page itself and the second - for introspection server.

# TODO

The plan is to do user-friendly branch (and maybe repos) switching with React.



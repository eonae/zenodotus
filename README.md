# Zenodotus

When using GraphQL it's very useful to have a tool to visualize the schema. There is a great thing for it - [graphql-voyager](https://github.com/graphql-kit/graphql-voyager).

Voyager is great if you have a living GraphQL server. Just add a middleware and get a nice looking schema documentation.

The problem comes where you need to share this docs with your teammates. You cirtainly can send them a docker image with your server, or repository so that they can do everything else. Both scenarios is not very comfortable when collaborating with less technical people.

Downside of voyager is that it needs a real working GraphQL server with introspection to work.

Here is where **zenodotus** comes to play. The idea is simple: deploy zenodotus as a docker container to any place you like. Set a repository, branch (or tag or event commit hash) and paths to schema files. The service will fetch files, checkout what is needed and run it's own introspection for new schema.

# Usage

Atm the repository is set with environment variable and the ref is passed by **ref** query parameter (default is _master_)

```
http://localhost:4001?ref=develop
```

# Deploy

See [compose.yaml](/compose.yaml). Note that two ports must be forwarded - one for the voyager page itself and the second is for introspection server.

# TODO

The plan is to do user-friendly branch (and maybe repos) switching with React.



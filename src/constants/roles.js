const Roles = Object.freeze({
  USER: "user",
  AGENT: "agent",
  ADMIN: "admin"
});

// Optionally, create a reverse lookup
const RoleValues = Object.freeze({
  "f47c3b7a-82d9-4d3d-b0b8-95db10b92b43": "user",
  "ab2e0f29-cdf4-4a67-b76d-22dbf9d5683a": "agent",
  "7c7dfe56-fb6d-4e6a-8337-47fbd4b5f067": "admin"
});


module.exports = {
    Roles,
    RoleValues
}
schema "public" {
  comment = "standard public schema"
}

extension "uuid-ossp" {
  schema = schema.public
}

extension "citext" {
  schema = schema.public
}

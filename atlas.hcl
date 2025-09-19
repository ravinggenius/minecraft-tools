env "default" {
  src = "file://src/services/datastore-service/schema.pg.hcl"
  url = getenv("DATABASE_URL")
}

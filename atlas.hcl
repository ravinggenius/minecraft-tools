data "hcl_schema" "domains" {
  paths = fileset("src/domains/**/*.hcl")
}

env "default" {
  src = data.hcl_schema.domains.url
  url = getenv("DATABASE_URL")
}

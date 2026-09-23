CREATE DOMAIN public.email AS public.citext
  CONSTRAINT valid_email_check CHECK (
    VALUE ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
  );

CREATE TABLE public.accounts (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  profile_id uuid NOT NULL,
  email public.email NOT NULL,
  email_verified_at timestamptz,
  hashword text NOT NULL,
  token_nonce text NOT NULL DEFAULT '',
  token_nonce_count integer NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT accounts_profile_id_fkey FOREIGN KEY (profile_id)
    REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT accounts_email_key UNIQUE (email)
);

CREATE TABLE public.password_resets (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  email public.email NOT NULL,
  expires_at timestamptz,
  nonce text NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT password_resets_email_key UNIQUE (email)
);

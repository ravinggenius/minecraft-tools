CREATE TABLE public.sessions (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  account_id uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT sessions_account_id_fkey FOREIGN KEY (account_id)
    REFERENCES public.accounts (id) ON UPDATE CASCADE ON DELETE CASCADE
);

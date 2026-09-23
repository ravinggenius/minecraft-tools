CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  is_welcome_needed boolean NOT NULL DEFAULT true,
  PRIMARY KEY (id)
);

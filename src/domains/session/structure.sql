CREATE TABLE public.sessions (
	id UUID NOT NULL DEFAULT public.uuid_generate_v4 (),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	account_id UUID NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT sessions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts (id) ON UPDATE CASCADE ON DELETE CASCADE
);

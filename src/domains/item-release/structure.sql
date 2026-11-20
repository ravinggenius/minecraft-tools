CREATE TABLE public.item_releases (
	id UUID NOT NULL DEFAULT public.uuid_generate_v4 (),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	release_id UUID NOT NULL,
	item_id UUID NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT item_releases_release_id_fkey FOREIGN KEY (release_id) REFERENCES public.releases (id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT item_releases_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX item_releases_release_id_key ON public.item_releases (release_id);

CREATE INDEX item_releases_item_id_key ON public.item_releases (item_id);

CREATE UNIQUE INDEX item_releases_release_id_item_id_key ON public.item_releases (release_id, item_id);

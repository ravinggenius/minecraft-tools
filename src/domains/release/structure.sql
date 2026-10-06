CREATE TYPE public.edition AS ENUM ('bedrock', 'java');

CREATE TABLE public.releases (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  cycle_id uuid,
  edition public.edition NOT NULL,
  version text NOT NULL,
  development_released_on date,
  changelog text,
  is_available_for_tools boolean NOT NULL DEFAULT false,
  is_latest boolean NOT NULL DEFAULT false,
  PRIMARY KEY (id),
  CONSTRAINT releases_cycle_id_fkey FOREIGN KEY (cycle_id)
    REFERENCES public.release_cycles (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT releases_edition_version_key UNIQUE (edition, version)
);

CREATE TABLE public.platform_releases (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  platform_id uuid NOT NULL,
  release_id uuid NOT NULL,
  production_released_on date NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT platform_releases_platform_id_fkey FOREIGN KEY (platform_id)
    REFERENCES public.platforms (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT platform_releases_release_id_fkey FOREIGN KEY (release_id)
    REFERENCES public.releases (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT platform_releases_platform_id_release_id_key UNIQUE (platform_id, release_id)
);

CREATE FUNCTION public.update_release_flags()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF pg_trigger_depth() = 1 THEN
    WITH latest AS (
      SELECT
        r.id,
        ROW_NUMBER() OVER (
          PARTITION BY r.edition
          ORDER BY min(pr.production_released_on) DESC
        ) = 1 AS is_latest
      FROM releases AS r
      INNER JOIN platform_releases AS pr ON r.id = pr.release_id
      GROUP BY r.id
    )
    UPDATE releases
    SET
      is_latest = latest.is_latest
    FROM latest
    WHERE releases.id = latest.id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_release_flags
AFTER INSERT OR UPDATE OR DELETE ON public.releases
FOR EACH ROW
EXECUTE FUNCTION public.update_release_flags();

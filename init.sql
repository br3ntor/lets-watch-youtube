-- Create usertable
-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    p_key SERIAL NOT NULL,
    id uuid NOT NULL,
    name character varying(20) COLLATE pg_catalog."default" NOT NULL,
    password character varying(120) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (p_key)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;
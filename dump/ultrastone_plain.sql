--
-- PostgreSQL database dump
--

\restrict aYKwvtSHgGobEFRdMfC9NICb5aE7bdXPuwa7rDL66pClN98o1SN0YDN92ODUig5

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-12 23:19:18 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16385)
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- TOC entry 4065 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- TOC entry 3 (class 3079 OID 16466)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4066 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 282 (class 1255 OID 17178)
-- Name: update_stone_product_seo_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_stone_product_seo_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_stone_product_seo_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16497)
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(100),
    resource_type character varying(100),
    resource_id bigint,
    description text,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(50),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    module_name character varying(100),
    changed_fields jsonb,
    request_id uuid,
    created_by_name character varying(255)
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16504)
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO postgres;

--
-- TOC entry 4067 (class 0 OID 0)
-- Dependencies: 222
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- TOC entry 232 (class 1259 OID 17047)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17046)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 4068 (class 0 OID 0)
-- Dependencies: 231
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 240 (class 1259 OID 17186)
-- Name: showrooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.showrooms (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(150) NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    zip_code character varying(20),
    country character varying(100),
    primary_phone character varying(30),
    secondary_phone character varying(30),
    company_phone character varying(30),
    email character varying(255),
    latitude numeric(10,8),
    longitude numeric(11,8),
    google_maps_url text,
    short_description text,
    long_description text,
    business_hours_mon_fri character varying(100),
    business_hours_saturday character varying(100),
    business_hours_sunday character varying(100),
    image_url text,
    banner_image_url text,
    meta_title character varying(255),
    meta_description text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.showrooms OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17185)
-- Name: showrooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.showrooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.showrooms_id_seq OWNER TO postgres;

--
-- TOC entry 4069 (class 0 OID 0)
-- Dependencies: 239
-- Name: showrooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.showrooms_id_seq OWNED BY public.showrooms.id;


--
-- TOC entry 223 (class 1259 OID 16705)
-- Name: stone_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stone_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    parent_id integer,
    thumbnail_url character varying(500),
    banner_url character varying(500),
    is_active boolean DEFAULT true,
    display_order integer,
    meta_description text,
    meta_keywords text,
    seo_title character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stone_categories OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16716)
-- Name: stone_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stone_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stone_categories_id_seq OWNER TO postgres;

--
-- TOC entry 4070 (class 0 OID 0)
-- Dependencies: 224
-- Name: stone_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stone_categories_id_seq OWNED BY public.stone_categories.id;


--
-- TOC entry 225 (class 1259 OID 16729)
-- Name: stone_product_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stone_product_media (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    media_type character varying(30) NOT NULL,
    media_url text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    public_id text,
    alt_text text
);


ALTER TABLE public.stone_product_media OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16740)
-- Name: stone_product_media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stone_product_media_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stone_product_media_id_seq OWNER TO postgres;

--
-- TOC entry 4071 (class 0 OID 0)
-- Dependencies: 226
-- Name: stone_product_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stone_product_media_id_seq OWNED BY public.stone_product_media.id;


--
-- TOC entry 238 (class 1259 OID 17151)
-- Name: stone_product_seo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stone_product_seo (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    meta_title character varying(255),
    meta_description text,
    canonical_url text,
    og_title character varying(255),
    og_description text,
    og_image text,
    schema_markup jsonb,
    robots_index boolean DEFAULT true NOT NULL,
    robots_follow boolean DEFAULT true NOT NULL,
    seo_content text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.stone_product_seo OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17150)
-- Name: stone_product_seo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stone_product_seo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stone_product_seo_id_seq OWNER TO postgres;

--
-- TOC entry 4072 (class 0 OID 0)
-- Dependencies: 237
-- Name: stone_product_seo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stone_product_seo_id_seq OWNED BY public.stone_product_seo.id;


--
-- TOC entry 227 (class 1259 OID 16741)
-- Name: stone_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stone_products (
    id bigint NOT NULL,
    product_id uuid DEFAULT public.uuid_generate_v4(),
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    small_description text,
    long_description text,
    finishes_available text[],
    pattern character varying(100),
    thicknesses_cm text[],
    average_sizes_inches text[],
    stone_group character varying(100),
    translucent boolean DEFAULT false,
    cut_to_size boolean DEFAULT false,
    origin_country character varying(100),
    pantone_colour character varying(100),
    color_enhancing boolean DEFAULT false,
    countertops_vanities boolean DEFAULT false,
    interior_floor boolean DEFAULT false,
    shower_wall boolean DEFAULT false,
    shower_floor boolean DEFAULT false,
    exterior_floor boolean DEFAULT false,
    exterior_wall boolean DEFAULT false,
    pool_fountain boolean DEFAULT false,
    fireplace boolean DEFAULT false,
    furniture_top boolean DEFAULT false,
    abrasion_resistance character varying(20),
    stain_resistance character varying(20),
    etching_resistance character varying(20),
    heat_resistance character varying(20),
    uv_resistance character varying(20),
    color_range character varying(20),
    movement_index character varying(20),
    variation_level character varying(10),
    is_featured boolean DEFAULT false,
    is_trending boolean DEFAULT false,
    is_new_arrival boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    interior_wall boolean,
    sealer character varying(100)
);


ALTER TABLE public.stone_products OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16769)
-- Name: stone_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stone_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stone_products_id_seq OWNER TO postgres;

--
-- TOC entry 4073 (class 0 OID 0)
-- Dependencies: 228
-- Name: stone_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stone_products_id_seq OWNED BY public.stone_products.id;


--
-- TOC entry 234 (class 1259 OID 17087)
-- Name: sys_lookup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_lookup (
    id bigint NOT NULL,
    lookup_code character varying(100) NOT NULL,
    lookup_name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sys_lookup OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17105)
-- Name: sys_lookup_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_lookup_details (
    id bigint NOT NULL,
    lookup_id bigint NOT NULL,
    value_code character varying(255),
    value_name character varying(255) NOT NULL,
    description text,
    display_order integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sys_lookup_details OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17104)
-- Name: sys_lookup_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_lookup_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_lookup_details_id_seq OWNER TO postgres;

--
-- TOC entry 4074 (class 0 OID 0)
-- Dependencies: 235
-- Name: sys_lookup_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_lookup_details_id_seq OWNED BY public.sys_lookup_details.id;


--
-- TOC entry 233 (class 1259 OID 17086)
-- Name: sys_lookup_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_lookup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_lookup_id_seq OWNER TO postgres;

--
-- TOC entry 4075 (class 0 OID 0)
-- Dependencies: 233
-- Name: sys_lookup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_lookup_id_seq OWNED BY public.sys_lookup.id;


--
-- TOC entry 229 (class 1259 OID 16796)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    role_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16810)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4076 (class 0 OID 0)
-- Dependencies: 230
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3775 (class 2604 OID 16811)
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- TOC entry 3809 (class 2604 OID 17050)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3829 (class 2604 OID 17189)
-- Name: showrooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showrooms ALTER COLUMN id SET DEFAULT nextval('public.showrooms_id_seq'::regclass);


--
-- TOC entry 3777 (class 2604 OID 16829)
-- Name: stone_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories ALTER COLUMN id SET DEFAULT nextval('public.stone_categories_id_seq'::regclass);


--
-- TOC entry 3781 (class 2604 OID 16831)
-- Name: stone_product_media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_media ALTER COLUMN id SET DEFAULT nextval('public.stone_product_media_id_seq'::regclass);


--
-- TOC entry 3824 (class 2604 OID 17154)
-- Name: stone_product_seo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_seo ALTER COLUMN id SET DEFAULT nextval('public.stone_product_seo_id_seq'::regclass);


--
-- TOC entry 3784 (class 2604 OID 16832)
-- Name: stone_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_products ALTER COLUMN id SET DEFAULT nextval('public.stone_products_id_seq'::regclass);


--
-- TOC entry 3814 (class 2604 OID 17090)
-- Name: sys_lookup id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup ALTER COLUMN id SET DEFAULT nextval('public.sys_lookup_id_seq'::regclass);


--
-- TOC entry 3819 (class 2604 OID 17108)
-- Name: sys_lookup_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup_details ALTER COLUMN id SET DEFAULT nextval('public.sys_lookup_details_id_seq'::regclass);


--
-- TOC entry 3804 (class 2604 OID 16835)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4040 (class 0 OID 16497)
-- Dependencies: 221
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, user_id, action, resource_type, resource_id, description, old_values, new_values, ip_address, user_agent, created_at, module_name, changed_fields, request_id, created_by_name) FROM stdin;
2	\N	CREATE	USER	\N	\N	null	{"email": "test1@gmail.com", "roles": {"id": 1, "name": "Admin", "role_id": "df0439d2-6fae-45da-9f0a-757a658083c4"}, "user_id": "90ac901b-cec0-4d9f-b0f8-a275fdee070a", "is_active": true, "last_name": "test", "created_at": "2026-06-08T19:27:05.015Z", "first_name": "test"}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-08 19:27:05.023	User Management	null	\N	undefined undefined
3	1	CREATE	USER	14	\N	null	{"id": 14, "email": "kkpatel@gmail.com", "roles": {"id": 6, "name": "SEO", "role_id": "62990a07-c360-4d2a-b4b5-194da01fc3d7"}, "user_id": "b926f348-08b8-48c4-b5ac-8e89dfc13732", "is_active": true, "last_name": "Pandya", "created_at": "2026-06-08T19:44:41.453Z", "first_name": "Khush"}	::1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-08 19:44:41.464	User Management	null	\N	Khush Patel
4	1	UPDATE	USER	14	\N	{"id": 14, "email": "kkpatel@gmail.com", "role_id": 6, "user_id": "b926f348-08b8-48c4-b5ac-8e89dfc13732", "is_active": true, "last_name": "Pandya", "created_at": "2026-06-08T19:44:41.453Z", "deleted_at": null, "first_name": "Khush", "last_login": null, "updated_at": "2026-06-08T19:44:41.453Z", "password_hash": "$2b$10$fsIcluJOAVd6yGyqw9RRiOt7m54aIj7YAGCNBn9kmM9jWvkQ3ASTu"}	{"id": 14, "email": "kkpatel@gmail.co", "roles": {"id": 6, "name": "SEO", "role_id": "62990a07-c360-4d2a-b4b5-194da01fc3d7"}, "user_id": "b926f348-08b8-48c4-b5ac-8e89dfc13732", "is_active": true, "last_name": "Pandya", "first_name": "Khush", "updated_at": "2026-06-08T19:45:18.584Z"}	::1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-08 19:45:18.655	User Management	{"email": {"new": "kkpatel@gmail.co", "old": "kkpatel@gmail.com"}, "roles": {"new": {"id": 6, "name": "SEO", "role_id": "62990a07-c360-4d2a-b4b5-194da01fc3d7"}}, "role_id": {"old": 6}, "created_at": {"old": "2026-06-08T19:44:41.453Z"}, "deleted_at": {"old": null}, "last_login": {"old": null}, "updated_at": {"new": "2026-06-08T19:45:18.584Z", "old": "2026-06-08T19:44:41.453Z"}, "password_hash": {"old": "$2b$10$fsIcluJOAVd6yGyqw9RRiOt7m54aIj7YAGCNBn9kmM9jWvkQ3ASTu"}}	\N	Khush Patel
5	1	DELETE	USER	13	\N	{"id": 13, "email": "test1@gmail.com", "role_id": 1, "user_id": "90ac901b-cec0-4d9f-b0f8-a275fdee070a", "is_active": true, "last_name": "test", "created_at": "2026-06-08T19:27:05.015Z", "deleted_at": null, "first_name": "test", "last_login": null, "updated_at": "2026-06-08T19:27:05.015Z", "password_hash": "$2b$10$LysRaZK2x8LjSxG9kDoNTex2s8DULQ3Bxcb67OdytHEpLAX2mEKha"}	{"id": 13, "email": "test1@gmail.com", "role_id": 1, "user_id": "90ac901b-cec0-4d9f-b0f8-a275fdee070a", "is_active": false, "last_name": "test", "created_at": "2026-06-08T19:27:05.015Z", "deleted_at": "2026-06-08T19:50:46.092Z", "first_name": "test", "last_login": null, "updated_at": "2026-06-08T19:27:05.015Z", "password_hash": "$2b$10$LysRaZK2x8LjSxG9kDoNTex2s8DULQ3Bxcb67OdytHEpLAX2mEKha"}	::1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-08 19:50:46.098	User Management	{"is_active": {"new": false, "old": true}, "deleted_at": {"new": "2026-06-08T19:50:46.092Z", "old": null}}	\N	Khush Patel
6	1	UPDATE	CATEGORY	42	\N	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test this is test", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	::1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-08 20:25:18.698	Stone Management	{"description": {"new": "this is test ", "old": "this is test this is test"}}	\N	Khush Patel
7	1	CREATE	CATEGORY	43	\N	null	{"id": 43, "name": "Dev", "slug": "dev", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-08T20:25:50.369Z", "updated_at": "2026-06-08T20:25:50.369Z", "description": "this is just test", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	::1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-08 20:25:50.385	Stone Management	null	\N	Khush Patel
8	1	UPDATE	PRODUCT	16	\N	{"id": "16", "name": "test", "slug": "cattest1", "media": [{"id": "146", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png", "public_id": null, "created_at": "2026-06-09T13:52:06.802Z", "media_type": "CLOSEUP_IMAGE", "product_id": "16", "display_order": 0}, {"id": "147", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png", "public_id": null, "created_at": "2026-06-09T13:52:06.802Z", "media_type": "SLAB_IMAGE", "product_id": "16", "display_order": 0}, {"id": "148", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg", "public_id": null, "created_at": "2026-06-09T13:52:06.802Z", "media_type": "BOOKMATCH_SLIPMATCH", "product_id": "16", "display_order": 0}], "pattern": "Bookmatch", "fireplace": true, "is_active": true, "created_at": "2026-06-04T13:31:14.517Z", "product_id": "c9402baf-ce76-4549-811e-f4739633dfec", "updated_at": "2026-06-04T13:31:14.517Z", "category_id": 42, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": false, "stone_group": "SUPER EXOTIC", "translucent": false, "shower_floor": true, "exterior_wall": false, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": false, "interior_floor": true, "is_new_arrival": false, "movement_index": "LOW", "origin_country": "India", "pantone_colour": "12346", "thicknesses_cm": ["2 CM"], "color_enhancing": true, "heat_resistance": "LOW", "variation_level": "V1", "long_description": "this is long desc", "stain_resistance": "LOW", "small_description": "this is short desc", "etching_resistance": "LOW", "finishes_available": ["POLISHED"], "abrasion_resistance": "LOW", "average_sizes_inches": ["12x25"], "countertops_vanities": false}	{"id": "16", "name": "test", "slug": "cattest1", "media": [{"id": "149", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "CLOSEUP_IMAGE", "product_id": "16", "display_order": 0}, {"id": "150", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "SLAB_IMAGE", "product_id": "16", "display_order": 0}, {"id": "151", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "BOOKMATCH_SLIPMATCH", "product_id": "16", "display_order": 0}], "pattern": "Bookmatch", "fireplace": true, "is_active": true, "created_at": "2026-06-04T13:31:14.517Z", "product_id": "c9402baf-ce76-4549-811e-f4739633dfec", "updated_at": "2026-06-04T13:31:14.517Z", "category_id": 42, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": false, "stone_group": "SUPER EXOTIC", "translucent": false, "shower_floor": true, "exterior_wall": false, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": false, "interior_floor": true, "is_new_arrival": false, "movement_index": "LOW", "origin_country": "India", "pantone_colour": "12346", "thicknesses_cm": ["2 CM"], "color_enhancing": true, "heat_resistance": "LOW", "variation_level": "V1", "long_description": "this is long desc", "stain_resistance": "LOW", "small_description": "this is short desc", "etching_resistance": "LOW", "finishes_available": ["POLISHED"], "abrasion_resistance": "LOW", "average_sizes_inches": ["12x25"], "countertops_vanities": false}	::1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2026-06-09 13:54:11.643	Stone Management	{"media": {"new": [{"id": "149", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "CLOSEUP_IMAGE", "product_id": "16", "display_order": 0}, {"id": "150", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "SLAB_IMAGE", "product_id": "16", "display_order": 0}, {"id": "151", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "BOOKMATCH_SLIPMATCH", "product_id": "16", "display_order": 0}], "old": [{"id": "146", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png", "public_id": null, "created_at": "2026-06-09T13:52:06.802Z", "media_type": "CLOSEUP_IMAGE", "product_id": "16", "display_order": 0}, {"id": "147", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png", "public_id": null, "created_at": "2026-06-09T13:52:06.802Z", "media_type": "SLAB_IMAGE", "product_id": "16", "display_order": 0}, {"id": "148", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg", "public_id": null, "created_at": "2026-06-09T13:52:06.802Z", "media_type": "BOOKMATCH_SLIPMATCH", "product_id": "16", "display_order": 0}]}}	\N	Khush Patel
9	1	UPDATE	PRODUCT	16	\N	{"id": "16", "name": "test", "slug": "cattest1", "media": [{"id": "149", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "CLOSEUP_IMAGE", "product_id": "16", "display_order": 0}, {"id": "150", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "SLAB_IMAGE", "product_id": "16", "display_order": 0}, {"id": "151", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "BOOKMATCH_SLIPMATCH", "product_id": "16", "display_order": 0}], "sealer": null, "pattern": "Bookmatch", "fireplace": true, "is_active": true, "created_at": "2026-06-04T13:31:14.517Z", "product_id": "c9402baf-ce76-4549-811e-f4739633dfec", "updated_at": "2026-06-04T13:31:14.517Z", "category_id": 42, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": false, "stone_group": "SUPER EXOTIC", "translucent": false, "shower_floor": true, "exterior_wall": false, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": false, "interior_floor": true, "is_new_arrival": false, "movement_index": "LOW", "origin_country": "India", "pantone_colour": "12346", "thicknesses_cm": ["2 CM"], "color_enhancing": true, "heat_resistance": "LOW", "variation_level": "V1", "long_description": "this is long desc", "stain_resistance": "LOW", "small_description": "this is short desc", "etching_resistance": "LOW", "finishes_available": ["POLISHED"], "abrasion_resistance": "LOW", "average_sizes_inches": ["12x25"], "countertops_vanities": false}	{"id": "16", "name": "test", "slug": "cattest1", "media": [{"id": "152", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png", "public_id": null, "created_at": "2026-06-10T13:57:08.913Z", "media_type": "CLOSEUP_IMAGE", "product_id": "16", "display_order": 0}, {"id": "153", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png", "public_id": null, "created_at": "2026-06-10T13:57:08.913Z", "media_type": "SLAB_IMAGE", "product_id": "16", "display_order": 0}, {"id": "154", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg", "public_id": null, "created_at": "2026-06-10T13:57:08.913Z", "media_type": "BOOKMATCH_SLIPMATCH", "product_id": "16", "display_order": 0}], "sealer": "Filamp90 or Mapei Ultra Care", "pattern": "Bookmatch", "fireplace": true, "is_active": true, "created_at": "2026-06-04T13:31:14.517Z", "product_id": "c9402baf-ce76-4549-811e-f4739633dfec", "updated_at": "2026-06-04T13:31:14.517Z", "category_id": 42, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": false, "stone_group": "SUPER EXOTIC", "translucent": false, "shower_floor": true, "exterior_wall": false, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": false, "interior_floor": true, "is_new_arrival": false, "movement_index": "LOW", "origin_country": "India", "pantone_colour": "12346", "thicknesses_cm": ["2 CM"], "color_enhancing": true, "heat_resistance": "LOW", "variation_level": "V1", "long_description": "this is long desc", "stain_resistance": "LOW", "small_description": "this is short desc", "etching_resistance": "LOW", "finishes_available": ["POLISHED"], "abrasion_resistance": "LOW", "average_sizes_inches": ["12x25"], "countertops_vanities": false}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 13:57:08.919	Stone Management	{"media": {"new": [{"id": "152", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png", "public_id": null, "created_at": "2026-06-10T13:57:08.913Z", "media_type": "CLOSEUP_IMAGE", "product_id": "16", "display_order": 0}, {"id": "153", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png", "public_id": null, "created_at": "2026-06-10T13:57:08.913Z", "media_type": "SLAB_IMAGE", "product_id": "16", "display_order": 0}, {"id": "154", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg", "public_id": null, "created_at": "2026-06-10T13:57:08.913Z", "media_type": "BOOKMATCH_SLIPMATCH", "product_id": "16", "display_order": 0}], "old": [{"id": "149", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "CLOSEUP_IMAGE", "product_id": "16", "display_order": 0}, {"id": "150", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "SLAB_IMAGE", "product_id": "16", "display_order": 0}, {"id": "151", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg", "public_id": null, "created_at": "2026-06-09T13:54:11.639Z", "media_type": "BOOKMATCH_SLIPMATCH", "product_id": "16", "display_order": 0}]}, "sealer": {"new": "Filamp90 or Mapei Ultra Care", "old": null}}	\N	Khush Patel
10	1	UPDATE	PRODUCT	19	\N	{"id": "19", "name": "test4", "slug": "cattest4", "media": [], "sealer": null, "pattern": "Slipmatch", "fireplace": false, "is_active": true, "created_at": "2026-06-05T13:16:11.149Z", "product_id": "af25227a-aef3-4fcf-93f9-3cfcf8523016", "updated_at": "2026-06-05T13:16:11.149Z", "category_id": 42, "color_range": "LOW", "cut_to_size": false, "is_featured": false, "is_trending": false, "shower_wall": false, "stone_group": "ENGINEERED PORCELAIN", "translucent": false, "shower_floor": false, "exterior_wall": false, "furniture_top": false, "interior_wall": null, "pool_fountain": false, "uv_resistance": "LOW", "exterior_floor": false, "interior_floor": false, "is_new_arrival": false, "movement_index": "LOW", "origin_country": "India", "pantone_colour": "888181", "thicknesses_cm": ["1.5 CM"], "color_enhancing": true, "heat_resistance": "LOW", "variation_level": "V3", "long_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", "stain_resistance": "LOW", "small_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", "etching_resistance": "LOW", "finishes_available": ["LEATHER/HONED"], "abrasion_resistance": "LOW", "average_sizes_inches": ["12x12"], "countertops_vanities": false}	{"id": "19", "name": "test4", "slug": "cattest4", "media": [{"id": "155", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1781099881/ultrastones/products/featured/hihs2shrvqjtbv2rauvl.jpg", "public_id": null, "created_at": "2026-06-10T13:58:02.649Z", "media_type": "CLOSEUP_IMAGE", "product_id": "19", "display_order": 0}], "sealer": "", "pattern": "Slipmatch", "fireplace": false, "is_active": true, "created_at": "2026-06-05T13:16:11.149Z", "product_id": "af25227a-aef3-4fcf-93f9-3cfcf8523016", "updated_at": "2026-06-05T13:16:11.149Z", "category_id": 42, "color_range": "LOW", "cut_to_size": false, "is_featured": false, "is_trending": false, "shower_wall": false, "stone_group": "ENGINEERED PORCELAIN", "translucent": false, "shower_floor": false, "exterior_wall": false, "furniture_top": false, "interior_wall": false, "pool_fountain": false, "uv_resistance": "LOW", "exterior_floor": false, "interior_floor": false, "is_new_arrival": false, "movement_index": "LOW", "origin_country": "India", "pantone_colour": "888181", "thicknesses_cm": ["1.5 CM"], "color_enhancing": true, "heat_resistance": "LOW", "variation_level": "V3", "long_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", "stain_resistance": "LOW", "small_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", "etching_resistance": "LOW", "finishes_available": ["LEATHER/HONED"], "abrasion_resistance": "LOW", "average_sizes_inches": ["12x12"], "countertops_vanities": false}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 13:58:02.653	Stone Management	{"media": {"new": [{"id": "155", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1781099881/ultrastones/products/featured/hihs2shrvqjtbv2rauvl.jpg", "public_id": null, "created_at": "2026-06-10T13:58:02.649Z", "media_type": "CLOSEUP_IMAGE", "product_id": "19", "display_order": 0}], "old": []}, "sealer": {"new": "", "old": null}, "interior_wall": {"new": false, "old": null}}	\N	Khush Patel
11	1	UPDATE	PRODUCT	18	\N	{"id": "18", "name": "test3", "slug": "cattest3", "media": [{"id": "107", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665045/ultrastones/products/featured/n1isfaohqgn5avl1wfls.jpg", "public_id": null, "created_at": "2026-06-05T13:13:38.125Z", "media_type": "CLOSEUP_IMAGE", "product_id": "18", "display_order": 0}, {"id": "108", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665217/ultrastones/products/gallery/foofpr2ycqorms1zvmng.jpg", "public_id": null, "created_at": "2026-06-05T13:13:38.125Z", "media_type": "SLAB_IMAGE", "product_id": "18", "display_order": 0}], "sealer": null, "pattern": "Bookmatch", "fireplace": false, "is_active": true, "created_at": "2026-06-05T13:09:37.824Z", "product_id": "d038a134-f8d8-447d-a934-a4fc2f7238d6", "updated_at": "2026-06-05T13:09:37.824Z", "category_id": 42, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "HIGH END", "translucent": false, "shower_floor": true, "exterior_wall": false, "furniture_top": true, "interior_wall": null, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": false, "interior_floor": true, "is_new_arrival": false, "movement_index": "LOW", "origin_country": "Angola", "pantone_colour": "12345", "thicknesses_cm": ["6 MM"], "color_enhancing": false, "heat_resistance": "LOW", "variation_level": "V1", "long_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", "stain_resistance": "LOW", "small_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", "etching_resistance": "LOW", "finishes_available": ["HONED"], "abrasion_resistance": "LOW", "average_sizes_inches": ["12X12"], "countertops_vanities": true}	{"id": "18", "name": "test3", "slug": "cattest3", "media": [{"id": "156", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665045/ultrastones/products/featured/n1isfaohqgn5avl1wfls.jpg", "public_id": null, "created_at": "2026-06-10T14:02:29.642Z", "media_type": "CLOSEUP_IMAGE", "product_id": "18", "display_order": 0}, {"id": "157", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665217/ultrastones/products/gallery/foofpr2ycqorms1zvmng.jpg", "public_id": null, "created_at": "2026-06-10T14:02:29.642Z", "media_type": "SLAB_IMAGE", "product_id": "18", "display_order": 0}], "sealer": "Filamp90 or Mapei Ultra Care", "pattern": "Bookmatch", "fireplace": false, "is_active": true, "created_at": "2026-06-05T13:09:37.824Z", "product_id": "d038a134-f8d8-447d-a934-a4fc2f7238d6", "updated_at": "2026-06-05T13:09:37.824Z", "category_id": 42, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "HIGH END", "translucent": false, "shower_floor": true, "exterior_wall": false, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": false, "interior_floor": true, "is_new_arrival": false, "movement_index": "LOW", "origin_country": "Angola", "pantone_colour": "12345", "thicknesses_cm": ["6 MM"], "color_enhancing": false, "heat_resistance": "LOW", "variation_level": "V1", "long_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", "stain_resistance": "LOW", "small_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", "etching_resistance": "LOW", "finishes_available": ["HONED"], "abrasion_resistance": "LOW", "average_sizes_inches": ["12X12"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 14:02:29.647	Stone Management	{"media": {"new": [{"id": "156", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665045/ultrastones/products/featured/n1isfaohqgn5avl1wfls.jpg", "public_id": null, "created_at": "2026-06-10T14:02:29.642Z", "media_type": "CLOSEUP_IMAGE", "product_id": "18", "display_order": 0}, {"id": "157", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665217/ultrastones/products/gallery/foofpr2ycqorms1zvmng.jpg", "public_id": null, "created_at": "2026-06-10T14:02:29.642Z", "media_type": "SLAB_IMAGE", "product_id": "18", "display_order": 0}], "old": [{"id": "107", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665045/ultrastones/products/featured/n1isfaohqgn5avl1wfls.jpg", "public_id": null, "created_at": "2026-06-05T13:13:38.125Z", "media_type": "CLOSEUP_IMAGE", "product_id": "18", "display_order": 0}, {"id": "108", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665217/ultrastones/products/gallery/foofpr2ycqorms1zvmng.jpg", "public_id": null, "created_at": "2026-06-05T13:13:38.125Z", "media_type": "SLAB_IMAGE", "product_id": "18", "display_order": 0}]}, "sealer": {"new": "Filamp90 or Mapei Ultra Care", "old": null}, "interior_wall": {"new": false, "old": null}}	\N	Khush Patel
12	1	UPDATE	CATEGORY	23	\N	{"id": 23, "name": "Porcelain Tile", "slug": "porcelain-tile", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-05-06T19:06:56.480Z", "updated_at": "2026-05-06T19:06:56.480Z", "description": "Porcelain tile collection", "display_order": 9, "meta_keywords": null, "thumbnail_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108104/Porcelain_edo11k.webp", "meta_description": null}	{"id": 23, "name": "Porcelain Tile", "slug": "porcelain-tile", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-05-06T19:06:56.480Z", "updated_at": "2026-05-06T19:06:56.480Z", "description": "Porcelain tile collection test", "display_order": 9, "meta_keywords": null, "thumbnail_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108104/Porcelain_edo11k.webp", "meta_description": null}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 18:20:43.755	Stone Management	{"description": {"new": "Porcelain tile collection test", "old": "Porcelain tile collection"}}	\N	Khush Patel
13	1	UPDATE	CATEGORY	23	\N	{"id": 23, "name": "Porcelain Tile", "slug": "porcelain-tile", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-05-06T19:06:56.480Z", "updated_at": "2026-05-06T19:06:56.480Z", "description": "Porcelain tile collection test", "display_order": 9, "meta_keywords": null, "thumbnail_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108104/Porcelain_edo11k.webp", "meta_description": null}	{"id": 23, "name": "Porcelain Tile", "slug": "porcelain-tile", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-05-06T19:06:56.480Z", "updated_at": "2026-05-06T19:06:56.480Z", "description": "Porcelain tile collection", "display_order": 9, "meta_keywords": null, "thumbnail_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108104/Porcelain_edo11k.webp", "meta_description": null}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 18:20:54.087	Stone Management	{"description": {"new": "Porcelain tile collection", "old": "Porcelain tile collection test"}}	\N	Khush Patel
14	1	UPDATE	CATEGORY	42	\N	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 18:28:02.395	Stone Management	{}	\N	Khush Patel
15	1	UPDATE	CATEGORY	42	\N	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 18:29:00.11	Stone Management	{}	\N	Khush Patel
16	1	UPDATE	CATEGORY	42	\N	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 18:29:49.246	Stone Management	{}	\N	Khush Patel
17	1	UPDATE	CATEGORY	42	\N	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": false, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 18:31:07.267	Stone Management	{"is_active": {"new": false, "old": true}}	\N	Khush Patel
18	1	UPDATE	CATEGORY	42	\N	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": false, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 19:11:10.584	Stone Management	{"is_active": {"new": true, "old": false}}	\N	Khush Patel
19	1	UPDATE	CATEGORY	42	\N	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": true, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	{"id": 42, "name": "testCategory1", "slug": "cattest1", "is_active": false, "parent_id": null, "seo_title": null, "banner_url": null, "created_at": "2026-06-03T20:37:11.052Z", "updated_at": "2026-06-03T20:37:11.052Z", "description": "this is test ", "display_order": 1, "meta_keywords": null, "thumbnail_url": null, "meta_description": null}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-10 19:11:13.533	Stone Management	{"is_active": {"new": false, "old": true}}	\N	Khush Patel
20	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "77", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-05-22T13:51:28.614Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "76", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-05-22T13:51:28.614Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "75", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-05-22T13:51:28.614Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}], "sealer": null, "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": null, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "158", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "159", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "160", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 20:20:28.692	Stone Management	{"media": {"new": [{"id": "158", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "159", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "160", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "old": [{"id": "77", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-05-22T13:51:28.614Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "76", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-05-22T13:51:28.614Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "75", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-05-22T13:51:28.614Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}]}, "sealer": {"new": "", "old": null}, "interior_wall": {"new": false, "old": null}}	\N	Khush Patel
21	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "158", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "159", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "160", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "161", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "162", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "163", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 20:21:00.021	Stone Management	{"media": {"new": [{"id": "161", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "162", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "163", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "old": [{"id": "158", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "159", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "160", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:20:28.685Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}]}}	\N	Khush Patel
22	1	UPDATE	PRODUCT_MEDIA	3	\N	[{"id": "161", "alt_text": null}, {"id": "162", "alt_text": "test"}, {"id": "163", "alt_text": null}]	null	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 20:33:39.302	Stone Management	{"0": {"old": {"id": "161", "alt_text": null}}, "1": {"old": {"id": "162", "alt_text": "test"}}, "2": {"old": {"id": "163", "alt_text": null}}}	\N	Khush Patel
23	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "161", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "162", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "163", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": "test update", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 20:33:39.329	Stone Management	{"media": {"new": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": "test update", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "old": [{"id": "161", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "162", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "163", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:21:00.019Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}]}}	\N	Khush Patel
24	1	UPDATE	PRODUCT_MEDIA	3	\N	[{"id": "164", "alt_text": null}, {"id": "165", "alt_text": "test update"}, {"id": "166", "alt_text": null}]	null	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 20:34:42.566	Stone Management	{"0": {"old": {"id": "164", "alt_text": null}}, "1": {"old": {"id": "165", "alt_text": "test update"}}, "2": {"old": {"id": "166", "alt_text": null}}}	\N	Khush Patel
25	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": "test update", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": "test update 165", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 20:34:42.58	Stone Management	{"media": {"new": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": "test update 165", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}], "old": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": "test update", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}]}}	\N	Khush Patel
26	1	UPDATE	PRODUCT_MEDIA	3	\N	[{"id": "164", "alt_text": null}, {"id": "166", "alt_text": null}, {"id": "165", "alt_text": "test update 165"}]	null	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 20:35:21.658	Stone Management	{"0": {"old": {"id": "164", "alt_text": null}}, "1": {"old": {"id": "166", "alt_text": null}}, "2": {"old": {"id": "165", "alt_text": "test update 165"}}}	\N	Khush Patel
27	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": "test update 165", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 20:35:21.668	Stone Management	{"media": {"new": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "old": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": "test update 165", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}]}}	\N	Khush Patel
28	1	UPDATE	PRODUCT_MEDIA	3	\N	[{"id": "164", "alt_text": null}, {"id": "165", "alt_text": null}, {"id": "166", "alt_text": null}]	null	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 12:14:19.209	Stone Management	{"0": {"old": {"id": "164", "alt_text": null}}, "1": {"old": {"id": "165", "alt_text": null}}, "2": {"old": {"id": "166", "alt_text": null}}}	\N	Khush Patel
29	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 12:14:19.226	Stone Management	{"media": {"new": [{"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}], "old": [{"id": "164", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}]}}	\N	Khush Patel
30	1	UPDATE	PRODUCT_MEDIA	3	\N	[{"id": "164", "alt_text": "test"}, {"id": "166", "alt_text": null}, {"id": "165", "alt_text": null}]	null	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 13:08:02.978	Stone Management	{"0": {"old": {"id": "164", "alt_text": "test"}}, "1": {"old": {"id": "166", "alt_text": null}}, "2": {"old": {"id": "165", "alt_text": null}}}	\N	Khush Patel
31	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "Engineered Quartz", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.", "etching_resistance": "HIGH", "finishes_available": ["Polished"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "Filamp90 or Mapei Ultra Care", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "ENGINEERED QUARTZ", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3 CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey gi", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture.", "etching_resistance": "HIGH", "finishes_available": ["HONED"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 13:08:02.992	Stone Management	{"media": {"new": [{"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}], "old": [{"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}]}, "sealer": {"new": "Filamp90 or Mapei Ultra Care", "old": ""}, "stone_group": {"new": "ENGINEERED QUARTZ", "old": "Engineered Quartz"}, "thicknesses_cm": {"new": ["3 CM"], "old": ["3CM"]}, "long_description": {"new": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey gi", "old": ""}, "small_description": {"new": "Arabesque is a beautiful white and grey quartz, valued for its natural texture.", "old": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces."}, "finishes_available": {"new": ["HONED"], "old": ["Polished"]}}	\N	Khush Patel
32	1	UPDATE	PRODUCT_MEDIA	3	\N	[{"id": "166", "alt_text": null}, {"id": "165", "alt_text": null}, {"id": "164", "alt_text": "test"}]	null	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 13:12:58.901	Stone Management	{"0": {"old": {"id": "166", "alt_text": null}}, "1": {"old": {"id": "165", "alt_text": null}}, "2": {"old": {"id": "164", "alt_text": "test"}}}	\N	Khush Patel
33	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "Filamp90 or Mapei Ultra Care", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "ENGINEERED QUARTZ", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3 CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey gi", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture.", "etching_resistance": "HIGH", "finishes_available": ["HONED"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "Filamp90 or Mapei Ultra Care", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "ENGINEERED QUARTZ", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3 CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey gi", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture.", "etching_resistance": "HIGH", "finishes_available": ["HONED"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 13:12:58.913	Stone Management	{}	\N	Khush Patel
34	1	UPDATE	PRODUCT_MEDIA	3	\N	[{"id": "166", "alt_text": null}, {"id": "165", "alt_text": null}, {"id": "164", "alt_text": "test"}]	null	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 13:22:09.528	Stone Management	{"0": {"old": {"id": "166", "alt_text": null}}, "1": {"old": {"id": "165", "alt_text": null}}, "2": {"old": {"id": "164", "alt_text": "test"}}}	\N	Khush Patel
35	1	UPDATE	PRODUCT_MEDIA	3	\N	[{"id": "164", "alt_text": "test"}, {"id": "166", "alt_text": null}, {"id": "165", "alt_text": null}]	null	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 13:33:23.386	Stone Management	{"0": {"old": {"id": "164", "alt_text": "test"}}, "1": {"old": {"id": "166", "alt_text": null}}, "2": {"old": {"id": "165", "alt_text": null}}}	\N	Khush Patel
36	1	UPDATE	PRODUCT	3	\N	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "Filamp90 or Mapei Ultra Care", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "ENGINEERED QUARTZ", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3 CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey gi", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture.", "stone_product_seo": null, "etching_resistance": "HIGH", "finishes_available": ["HONED"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	{"id": "3", "name": "Arabesque", "slug": "arabesque", "media": [{"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}], "sealer": "Filamp90 or Mapei Ultra Care", "pattern": "SlipMatch", "fireplace": true, "is_active": true, "created_at": "2026-05-20T14:43:16.808Z", "product_id": "cd5153eb-7353-4895-b818-3698fd8ff6b8", "updated_at": "2026-05-20T14:43:16.808Z", "category_id": 24, "color_range": "LOW", "cut_to_size": true, "is_featured": false, "is_trending": false, "shower_wall": true, "stone_group": "ENGINEERED QUARTZ", "translucent": false, "shower_floor": true, "exterior_wall": true, "furniture_top": true, "interior_wall": false, "pool_fountain": true, "uv_resistance": "LOW", "exterior_floor": true, "interior_floor": true, "is_new_arrival": false, "movement_index": "HIGH", "origin_country": "Brazil", "pantone_colour": "123456", "thicknesses_cm": ["3 CM"], "color_enhancing": false, "heat_resistance": "HIGH", "variation_level": "V1", "long_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey gi", "stain_resistance": "HIGH", "small_description": "Arabesque is a beautiful white and grey quartz, valued for its natural texture.", "stone_product_seo": {"id": "1", "og_image": "test", "og_title": "tes", "created_at": "2026-06-12T13:33:23.401Z", "meta_title": "test", "product_id": "3", "updated_at": "2026-06-12T13:33:23.401Z", "seo_content": "Test", "robots_index": false, "canonical_url": "tes", "robots_follow": false, "schema_markup": "{\\n\\"@context\\": \\"https://schema.org/\\",\\n\\"@type\\": \\"WebPage\\",\\n\\"name\\": \\"Umbraco\\"\\n}", "og_description": "test", "meta_description": "test"}, "etching_resistance": "HIGH", "finishes_available": ["HONED"], "abrasion_resistance": "HIGH", "average_sizes_inches": ["138 X 79"], "countertops_vanities": true}	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-12 13:33:23.408	Stone Management	{"media": {"new": [{"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}, {"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}], "old": [{"id": "164", "alt_text": "test", "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "CLOSEUP_IMAGE", "product_id": "3", "display_order": 0}, {"id": "166", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "FEATURED_VIDEO", "product_id": "3", "display_order": 0}, {"id": "165", "alt_text": null, "media_url": "https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg", "public_id": null, "created_at": "2026-06-11T20:33:39.325Z", "media_type": "SLAB_IMAGE", "product_id": "3", "display_order": 0}]}, "stone_product_seo": {"new": {"id": "1", "og_image": "test", "og_title": "tes", "created_at": "2026-06-12T13:33:23.401Z", "meta_title": "test", "product_id": "3", "updated_at": "2026-06-12T13:33:23.401Z", "seo_content": "Test", "robots_index": false, "canonical_url": "tes", "robots_follow": false, "schema_markup": "{\\n\\"@context\\": \\"https://schema.org/\\",\\n\\"@type\\": \\"WebPage\\",\\n\\"name\\": \\"Umbraco\\"\\n}", "og_description": "test", "meta_description": "test"}, "old": null}}	\N	Khush Patel
37	\N	UPDATE	SHOWROOM	1	\N	{"id": 1, "city": "Farmingdale", "name": "New York Showroom", "slug": "new-york", "email": "ny@ultrastones.com", "state": "NY", "address": "55 Central Drive, Farmingdale", "country": "USA", "latitude": null, "zip_code": "11735", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-05-06T18:50:16.988Z", "is_featured": true, "company_phone": null, "display_order": 1, "primary_phone": "631-873-4747", "google_maps_url": null, "secondary_phone": null, "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": null, "business_hours_sunday": null, "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	{"id": 1, "city": "Farmingdale", "name": "New York Showroom", "slug": "new-york", "email": "ny@ultrastones.com", "state": "NY", "address": "55 Central Drive, Farmingdale", "country": "USA", "latitude": null, "zip_code": "11735", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-06-12T16:05:11.708Z", "is_featured": true, "company_phone": "", "display_order": 1, "primary_phone": "631-873-4747", "google_maps_url": "", "secondary_phone": "", "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": "", "business_hours_sunday": "Closed", "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	\N	\N	2026-06-12 16:05:11.728	Showroom Management	{"updated_at": {"new": "2026-06-12T16:05:11.708Z", "old": "2026-05-06T18:50:16.988Z"}, "company_phone": {"new": "", "old": null}, "google_maps_url": {"new": "", "old": null}, "secondary_phone": {"new": "", "old": null}, "short_description": {"new": "", "old": null}, "business_hours_sunday": {"new": "Closed", "old": null}}	\N	\N
38	\N	UPDATE	SHOWROOM	1	\N	{"id": 1, "city": "Farmingdale", "name": "New York Showroom", "slug": "new-york", "email": "ny@ultrastones.com", "state": "NY", "address": "55 Central Drive, Farmingdale", "country": "USA", "latitude": null, "zip_code": "11735", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-06-12T16:05:11.708Z", "is_featured": true, "company_phone": "", "display_order": 1, "primary_phone": "631-873-4747", "google_maps_url": "", "secondary_phone": "", "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": "", "business_hours_sunday": "Closed", "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	{"id": 1, "city": "Farmingdale", "name": "New York Showroom", "slug": "new-york", "email": "ny@ultrastones.com", "state": "NY", "address": "55 Central Drive, Farmingdale", "country": "USA", "latitude": null, "zip_code": "11735", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-06-12T16:06:45.107Z", "is_featured": true, "company_phone": "631-873-4749", "display_order": 1, "primary_phone": "631-873-4747", "google_maps_url": "https://maps.app.goo.gl/uRCpMybNu2ejLiuG8", "secondary_phone": "631-873-4748", "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": "", "business_hours_sunday": "Closed", "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	\N	\N	2026-06-12 16:06:45.115	Showroom Management	{"updated_at": {"new": "2026-06-12T16:06:45.107Z", "old": "2026-06-12T16:05:11.708Z"}, "company_phone": {"new": "631-873-4749", "old": ""}, "google_maps_url": {"new": "https://maps.app.goo.gl/uRCpMybNu2ejLiuG8", "old": ""}, "secondary_phone": {"new": "631-873-4748", "old": ""}}	\N	\N
39	\N	UPDATE	SHOWROOM	2	\N	{"id": 2, "city": "Levittown", "name": "Philadelphia Showroom", "slug": "philadelphia", "email": "pa@ultrastones.com", "state": "PA", "address": "3907 Nebraska St, Levittown", "country": "USA", "latitude": null, "zip_code": "19056", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-05-06T18:50:16.988Z", "is_featured": true, "company_phone": null, "display_order": 2, "primary_phone": "215-647-3972", "google_maps_url": null, "secondary_phone": null, "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": null, "business_hours_sunday": null, "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	{"id": 2, "city": "Levittown", "name": "Philadelphia Showroom", "slug": "philadelphia", "email": "pa@ultrastones.com", "state": "PA", "address": "3907 Nebraska St, Levittown", "country": "USA", "latitude": null, "zip_code": "19056", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-06-12T16:07:57.216Z", "is_featured": true, "company_phone": "215-647-3977", "display_order": 2, "primary_phone": "215-647-3972", "google_maps_url": "https://maps.app.goo.gl/3Y5e6uNxxjkNiQYx8", "secondary_phone": "215-647-3974", "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": "", "business_hours_sunday": "Closed", "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	\N	\N	2026-06-12 16:07:57.22	Showroom Management	{"updated_at": {"new": "2026-06-12T16:07:57.216Z", "old": "2026-05-06T18:50:16.988Z"}, "company_phone": {"new": "215-647-3977", "old": null}, "google_maps_url": {"new": "https://maps.app.goo.gl/3Y5e6uNxxjkNiQYx8", "old": null}, "secondary_phone": {"new": "215-647-3974", "old": null}, "short_description": {"new": "", "old": null}, "business_hours_sunday": {"new": "Closed", "old": null}}	\N	\N
40	\N	UPDATE	SHOWROOM	1	\N	{"id": 1, "city": "Farmingdale", "name": "New York Showroom", "slug": "new-york", "email": "ny@ultrastones.com", "state": "NY", "address": "55 Central Drive, Farmingdale", "country": "USA", "latitude": null, "zip_code": "11735", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-06-12T16:06:45.107Z", "is_featured": true, "company_phone": "631-873-4749", "display_order": 1, "primary_phone": "631-873-4747", "google_maps_url": "https://maps.app.goo.gl/uRCpMybNu2ejLiuG8", "secondary_phone": "631-873-4748", "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": "", "business_hours_sunday": "Closed", "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	{"id": 1, "city": "Farmingdale", "name": "New York Showroom", "slug": "new-york", "email": "ny@ultrastones.com", "state": "NY", "address": "55 Central Drive, Farmingdale", "country": "USA", "latitude": null, "zip_code": "11735", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-06-12T16:09:08.806Z", "is_featured": true, "company_phone": "631-873-4749", "display_order": 1, "primary_phone": "631-873-4747", "google_maps_url": "https://maps.app.goo.gl/uRCpMybNu2ejLiuG8", "secondary_phone": "631-873-4748", "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": "Find the perfect slab at Ultra Stones' New York showroom in Farmingdale. Our curated inventory features a vast selection of natural and engineered stones, including marble, quartzite, quartz, and more.", "business_hours_sunday": "Closed", "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	\N	\N	2026-06-12 16:09:08.809	Showroom Management	{"updated_at": {"new": "2026-06-12T16:09:08.806Z", "old": "2026-06-12T16:06:45.107Z"}, "short_description": {"new": "Find the perfect slab at Ultra Stones' New York showroom in Farmingdale. Our curated inventory features a vast selection of natural and engineered stones, including marble, quartzite, quartz, and more.", "old": ""}}	\N	\N
41	\N	UPDATE	SHOWROOM	2	\N	{"id": 2, "city": "Levittown", "name": "Philadelphia Showroom", "slug": "philadelphia", "email": "pa@ultrastones.com", "state": "PA", "address": "3907 Nebraska St, Levittown", "country": "USA", "latitude": null, "zip_code": "19056", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-06-12T16:07:57.216Z", "is_featured": true, "company_phone": "215-647-3977", "display_order": 2, "primary_phone": "215-647-3972", "google_maps_url": "https://maps.app.goo.gl/3Y5e6uNxxjkNiQYx8", "secondary_phone": "215-647-3974", "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": "", "business_hours_sunday": "Closed", "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	{"id": 2, "city": "Levittown", "name": "Philadelphia Showroom", "slug": "philadelphia", "email": "pa@ultrastones.com", "state": "PA", "address": "3907 Nebraska St, Levittown", "country": "USA", "latitude": null, "zip_code": "19056", "image_url": null, "is_active": true, "longitude": null, "created_at": "2026-05-06T18:50:16.988Z", "meta_title": null, "updated_at": "2026-06-12T16:09:30.148Z", "is_featured": true, "company_phone": "215-647-3977", "display_order": 2, "primary_phone": "215-647-3972", "google_maps_url": "https://maps.app.goo.gl/3Y5e6uNxxjkNiQYx8", "secondary_phone": "215-647-3974", "banner_image_url": null, "long_description": null, "meta_description": null, "short_description": "Ultra Stones Philadelphia showroom welcomes you to a world of breathtaking natural and engineered stone surfaces including marble, quartzite, quartz and porcelain slabs.", "business_hours_sunday": "Closed", "business_hours_mon_fri": "8:00 AM to 5:00 PM", "business_hours_saturday": "9:00 AM to 1:00 PM"}	\N	\N	2026-06-12 16:09:30.152	Showroom Management	{"updated_at": {"new": "2026-06-12T16:09:30.148Z", "old": "2026-06-12T16:07:57.216Z"}, "short_description": {"new": "Ultra Stones Philadelphia showroom welcomes you to a world of breathtaking natural and engineered stone surfaces including marble, quartzite, quartz and porcelain slabs.", "old": ""}}	\N	\N
\.


--
-- TOC entry 4051 (class 0 OID 17047)
-- Dependencies: 232
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role_id, name, description, is_active, created_at, updated_at) FROM stdin;
1	df0439d2-6fae-45da-9f0a-757a658083c4	Admin	Full system access	t	2026-06-02 23:06:52.533744	2026-06-02 23:06:52.533744
2	c3abfa88-b899-4bb7-9c6a-dc658c81ad38	Viewer	Read-only access	t	2026-06-02 23:06:52.533744	2026-06-02 23:06:52.533744
3	c957ec42-e9e1-4c5c-a826-6bea615d1f35	Designer	Manage designs, creatives and media assets	t	2026-06-02 23:06:52.533744	2026-06-02 23:06:52.533744
4	5fc306d6-9114-488e-ae73-650ec58da999	Logistic	Manage logistics and operational activities	t	2026-06-02 23:06:52.533744	2026-06-02 23:06:52.533744
5	7b4971c8-1cf2-450e-b7a4-2ca871b20345	Content	Manage blogs, pages and content publishing	t	2026-06-02 23:06:52.533744	2026-06-02 23:06:52.533744
6	62990a07-c360-4d2a-b4b5-194da01fc3d7	SEO	Manage SEO settings and optimization	t	2026-06-02 23:06:52.533744	2026-06-02 23:06:52.533744
\.


--
-- TOC entry 4059 (class 0 OID 17186)
-- Dependencies: 240
-- Data for Name: showrooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.showrooms (id, name, slug, address, city, state, zip_code, country, primary_phone, secondary_phone, company_phone, email, latitude, longitude, google_maps_url, short_description, long_description, business_hours_mon_fri, business_hours_saturday, business_hours_sunday, image_url, banner_image_url, meta_title, meta_description, is_active, is_featured, display_order, created_at, updated_at) FROM stdin;
1	New York Showroom	new-york	55 Central Drive, Farmingdale	Farmingdale	NY	11735	USA	631-873-4747	631-873-4748	631-873-4749	ny@ultrastones.com	\N	\N	https://maps.app.goo.gl/uRCpMybNu2ejLiuG8	Find the perfect slab at Ultra Stones' New York showroom in Farmingdale. Our curated inventory features a vast selection of natural and engineered stones, including marble, quartzite, quartz, and more.	\N	8:00 AM to 5:00 PM	9:00 AM to 1:00 PM	Closed	\N	\N	\N	\N	t	t	1	2026-05-06 18:50:16.988781	2026-06-12 16:09:08.806
2	Philadelphia Showroom	philadelphia	3907 Nebraska St, Levittown	Levittown	PA	19056	USA	215-647-3972	215-647-3974	215-647-3977	pa@ultrastones.com	\N	\N	https://maps.app.goo.gl/3Y5e6uNxxjkNiQYx8	Ultra Stones Philadelphia showroom welcomes you to a world of breathtaking natural and engineered stone surfaces including marble, quartzite, quartz and porcelain slabs.	\N	8:00 AM to 5:00 PM	9:00 AM to 1:00 PM	Closed	\N	\N	\N	\N	t	t	2	2026-05-06 18:50:16.988781	2026-06-12 16:09:30.148
\.


--
-- TOC entry 4042 (class 0 OID 16705)
-- Dependencies: 223
-- Data for Name: stone_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stone_categories (id, name, slug, description, parent_id, thumbnail_url, banner_url, is_active, display_order, meta_description, meta_keywords, seo_title, created_at, updated_at) FROM stdin;
30	12MM Kaolin Slabs	12mm-kaolin-slabs	12MM Kaolin porcelain slabs	29	\N	\N	t	1	\N	\N	\N	2026-05-06 19:07:55.033721	2026-05-06 19:07:55.033721
31	2CM Full Body Slabs Atlas Plan	2cm-full-body-slabs-atlas-plan	2CM Full Body Atlas Plan slabs	29	\N	\N	t	2	\N	\N	\N	2026-05-06 19:07:55.033721	2026-05-06 19:07:55.033721
15	Calcite	calcite	Calcite stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108104/Calcite_cn7hom.webp	\N	t	1	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
20	Marble	marble	Marble stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108103/Marble_ekj3so.png	\N	t	6	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
22	Precious Stone	precious-stone	Precious stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108103/Precious_Stone_iusiam.webp	\N	t	8	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
24	Ultra Quartz	ultra-quartz	Ultra Quartz collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108104/Quartz_s1or2m.webp	\N	t	10	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
25	Quartzite	quartzite	Quartzite stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108104/Quartzite_r1njvy.png	\N	t	11	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
26	Soapstone	soapstone	Soapstone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108105/Soapstone_ylo1mc.webp	\N	t	12	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
27	Slate	slate	Slate collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108105/Slate_kzdxil.webp	\N	t	13	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
28	Travertine	travertine	Travertine collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108105/Travertine_npzal4.webp	\N	t	14	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
16	Dolomite	dolomite	Dolomite stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781109151/Dolomite_gaeche.webp	\N	t	2	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
17	Granite	granite	Granite stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781109151/Granite_khwfla.webp	\N	t	3	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
18	Glass	glass	Glass stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781109151/Glass_gtlfst.webp	\N	t	4	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
19	Limestone	limestone	Limestone stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781109152/Limestone_wpr4an.webp	\N	t	5	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
21	Onyx	onyx	Onyx stone collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781109151/onyx_oc1bcx.webp	\N	t	7	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
29	Porcelain Slabs	porcelain-slabs	Porcelain slab collection	\N	\N	\N	f	15	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
23	Porcelain Tile	porcelain-tile	Porcelain tile collection	\N	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781108104/Porcelain_edo11k.webp	\N	t	9	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
42	testCategory1	cattest1	this is test 	\N	\N	\N	f	1	\N	\N	\N	2026-06-03 20:37:11.052	2026-06-03 20:37:11.052
\.


--
-- TOC entry 4044 (class 0 OID 16729)
-- Dependencies: 225
-- Data for Name: stone_product_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stone_product_media (id, product_id, media_type, media_url, display_order, created_at, public_id, alt_text) FROM stdin;
45	6	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779373929/ultrastones/products/videos/obbqtelz0phdgj9lwtz3.mp4	0	2026-05-22 13:41:08.352	\N	\N
48	7	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779374075/ultrastones/products/videos/gobnltne0udds0l44qxr.mp4	0	2026-05-22 13:41:15.674	\N	\N
51	8	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779374038/ultrastones/products/videos/ojylcn3swfblyvfghnxu.mp4	0	2026-05-22 13:41:21.05	\N	\N
56	4	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779290637/ultrastones/products/videos/xv2bozxjiehmexioeugi.mp4	0	2026-05-22 13:41:38.727	\N	\N
59	5	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779291054/ultrastones/products/videos/xbymjyz0zdkynt2a8ep0.mp4	0	2026-05-22 13:41:45.334	\N	\N
62	14	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779375772/ultrastones/products/videos/tc5kz1xqmn99q2e9llrz.mp4	0	2026-05-22 13:41:49.561	\N	\N
65	13	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779375521/ultrastones/products/videos/rwm5qma5fbs3rp3slwdg.mp4	0	2026-05-22 13:41:53.609	\N	\N
70	10	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779374297/ultrastones/products/videos/hzh9y2a7avyfmvpkkyik.mp4	0	2026-05-22 13:42:08.362	\N	\N
152	16	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png	0	2026-06-10 13:57:08.913	\N	\N
153	16	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png	0	2026-06-10 13:57:08.913	\N	\N
154	16	BOOKMATCH_SLIPMATCH	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg	0	2026-06-10 13:57:08.913	\N	\N
156	18	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665045/ultrastones/products/featured/n1isfaohqgn5avl1wfls.jpg	0	2026-06-10 14:02:29.642	\N	\N
157	18	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665217/ultrastones/products/gallery/foofpr2ycqorms1zvmng.jpg	0	2026-06-10 14:02:29.642	\N	\N
166	3	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4	0	2026-06-11 20:33:39.325	\N	\N
165	3	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg	0	2026-06-11 20:33:39.325	\N	\N
164	3	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg	0	2026-06-11 20:33:39.325	\N	test
43	6	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779373912/ultrastones/products/featured/hcygv08sf4s0eykqrn8x.jpg	0	2026-05-22 13:41:08.352	\N	\N
46	7	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374065/ultrastones/products/featured/l9ovbvxaqa2ttyiys3rn.jpg	0	2026-05-22 13:41:15.674	\N	\N
49	8	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374028/ultrastones/products/featured/oxhu6kgjckbev1b6sote.jpg	0	2026-05-22 13:41:21.05	\N	\N
52	11	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374352/ultrastones/products/featured/qfhgunvwl9zxwrhwliyz.jpg	0	2026-05-22 13:41:32.738	\N	\N
44	6	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779373914/ultrastones/products/gallery/plkzrnsy4syku51julez.jpg	0	2026-05-22 13:41:08.352	\N	\N
47	7	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374067/ultrastones/products/gallery/iwiv2i0itinkolcokf46.jpg	0	2026-05-22 13:41:15.674	\N	\N
50	8	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374030/ultrastones/products/gallery/apbcxob28il8bzdy6i7u.jpg	0	2026-05-22 13:41:21.05	\N	\N
53	11	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374354/ultrastones/products/gallery/swldyhnut2awf9fly6he.jpg	0	2026-05-22 13:41:32.738	\N	\N
55	4	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779290635/ultrastones/products/gallery/ekos27xz6p89i2co5azm.jpg	0	2026-05-22 13:41:38.727	\N	\N
58	5	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779291050/ultrastones/products/gallery/z9gix4gkrbg5ctoambxs.jpg	0	2026-05-22 13:41:45.334	\N	\N
61	14	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375771/ultrastones/products/gallery/jxvnfgpgxbkm5glyeixl.jpg	0	2026-05-22 13:41:49.561	\N	\N
64	13	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375519/ultrastones/products/gallery/mp2idvbz5kdg4rk5qetx.jpg	0	2026-05-22 13:41:53.609	\N	\N
67	15	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375905/ultrastones/products/gallery/i6j3voshyjojk163io6d.jpg	0	2026-05-22 13:41:57.379	\N	\N
69	10	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374296/ultrastones/products/gallery/qexiswapbgglcmmcsg7j.jpg	0	2026-05-22 13:42:08.362	\N	\N
72	12	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374426/ultrastones/products/gallery/ww2rzg6b3dqssydek4qz.jpg	0	2026-05-22 13:42:15.192	\N	\N
74	9	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374239/ultrastones/products/gallery/ubx8czjabe2uvdv2wwxy.jpg	0	2026-05-22 13:42:34.11	\N	\N
142	17	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780663076/ultrastones/products/featured/fhmyuvsqulcpfszuzvo2.jpg	0	2026-06-05 19:12:51.098	\N	\N
143	17	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780663078/ultrastones/products/gallery/aic0qxotcltol19k37oz.jpg	0	2026-06-05 19:12:51.098	\N	\N
144	17	APPLICATION_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780663079/ultrastones/products/application/gpln4fdlheyrgmiyckkq.jpg	0	2026-06-05 19:12:51.098	\N	\N
145	17	BOOKMATCH_SLIPMATCH	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780663080/ultrastones/products/bookmatch-slipmatch/qrjequpbjos3ne5lcb5h.jpg	0	2026-06-05 19:12:51.098	\N	\N
155	19	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1781099881/ultrastones/products/featured/hihs2shrvqjtbv2rauvl.jpg	0	2026-06-10 13:58:02.649	\N	\N
118	22	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1780666600/ultrastones/products/videos/b7kmgyh8i4msibrookox.mp4	0	2026-06-05 13:36:41.63	\N	\N
119	22	BOOKMATCH_SLIPMATCH	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780666529/ultrastones/products/bookmatch-slipmatch/yhb7wd8lopmbyoapkyzw.jpg	0	2026-06-05 13:36:41.63	\N	\N
128	23	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780679791/ultrastones/products/featured/eh0oamgecvlf2tvhior0.jpg	0	2026-06-05 17:16:33.492	\N	\N
129	23	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780679792/ultrastones/products/gallery/ydyw3mlilstudrvicj5i.jpg	0	2026-06-05 17:16:33.492	\N	\N
54	4	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779290634/ultrastones/products/featured/u96abfnfh0fopgljgmcw.jpg	0	2026-05-22 13:41:38.727	\N	\N
57	5	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779291048/ultrastones/products/featured/ixikrbprowo3c2srujsj.jpg	0	2026-05-22 13:41:45.334	\N	\N
60	14	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375768/ultrastones/products/featured/etmjjlkmvspvrd3pyhof.jpg	0	2026-05-22 13:41:49.561	\N	\N
63	13	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375517/ultrastones/products/featured/fvwfkugrijsin6seqp2x.jpg	0	2026-05-22 13:41:53.609	\N	\N
66	15	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375904/ultrastones/products/featured/z1w959bzvaaas4bcargn.jpg	0	2026-05-22 13:41:57.379	\N	\N
68	10	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374294/ultrastones/products/featured/jgrj7k05qs1o3p6wfzkm.jpg	0	2026-05-22 13:42:08.362	\N	\N
71	12	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374424/ultrastones/products/featured/ophkymars9m8h3fv3c20.jpg	0	2026-05-22 13:42:15.192	\N	\N
73	9	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374237/ultrastones/products/featured/xlxyajeij5wcjr63fvox.jpg	0	2026-05-22 13:42:34.11	\N	\N
109	21	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665789/ultrastones/products/featured/ixqku9adzwu8b8a3ymwh.jpg	0	2026-06-05 13:23:12.219	\N	\N
116	22	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780666438/ultrastones/products/featured/quzixc48cxq7ocl5yblr.jpg	0	2026-06-05 13:36:41.63	\N	\N
110	21	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665790/ultrastones/products/gallery/xpsspfqbyfraihitzh9p.jpg	0	2026-06-05 13:23:12.219	\N	\N
117	22	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780666440/ultrastones/products/gallery/tu02exnv1muh3uhsye7a.jpg	0	2026-06-05 13:36:41.63	\N	\N
\.


--
-- TOC entry 4057 (class 0 OID 17151)
-- Dependencies: 238
-- Data for Name: stone_product_seo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stone_product_seo (id, product_id, meta_title, meta_description, canonical_url, og_title, og_description, og_image, schema_markup, robots_index, robots_follow, seo_content, created_at, updated_at) FROM stdin;
1	3	test	test	tes	tes	test	test	"{\\n\\"@context\\": \\"https://schema.org/\\",\\n\\"@type\\": \\"WebPage\\",\\n\\"name\\": \\"Umbraco\\"\\n}"	f	f	Test	2026-06-12 13:33:23.401	2026-06-12 13:33:23.401
\.


--
-- TOC entry 4046 (class 0 OID 16741)
-- Dependencies: 227
-- Data for Name: stone_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stone_products (id, product_id, category_id, name, slug, small_description, long_description, finishes_available, pattern, thicknesses_cm, average_sizes_inches, stone_group, translucent, cut_to_size, origin_country, pantone_colour, color_enhancing, countertops_vanities, interior_floor, shower_wall, shower_floor, exterior_floor, exterior_wall, pool_fountain, fireplace, furniture_top, abrasion_resistance, stain_resistance, etching_resistance, heat_resistance, uv_resistance, color_range, movement_index, variation_level, is_featured, is_trending, is_new_arrival, is_active, created_at, updated_at, interior_wall, sealer) FROM stdin;
6	6e8b85e0-ea6e-48a4-9b3b-81fab31bffeb	24	Ariston	ariston	Ariston Polished Quartz is a striking modern style statement, celebrated for its visually captivating surface and gentle white and grey variations that lend an organic, natural appeal. Its subtle palette blends effortlessly with both traditional and contemporary design styles, offering versatility across a variety of interiors. The polished finish enhances brightness by reflecting natural light, making any space feel open, airy, and subtly refined.\r\n\r\n		{"Polished "," Polished"}	SlipMatch	{"3 CM "," 3 CM"}	{"138 X 79 "," 126 X 63"}	Engineered Quartz	f	t	India	456789	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	MEDIUM	V1	f	f	f	t	2026-05-21 13:58:51.457	2026-05-21 13:58:51.457	\N	\N
5	38011aa0-c68a-4bc3-849c-e234dea57669	24	Indigo Blue	indigo_blue	Indigo Blue quartz is a perfect stone for creating subtle and charming spaces. The stone flaunts a soothing interplay of blues, greys, and whites, creating a captivating textured look. Its cool tones blend into an artistic expression of beauty. Create a sensory feast for your eyes using indigo-blue quartz in your interior applications.\r\n\r\n		{Polished}	SlipMatch	{3CM}	{"126 X 63"}	Engineered Quartz	f	t	Turkey	546321	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	HIGH	V1	f	f	f	t	2026-05-20 15:30:18.295	2026-05-20 15:30:18.295	\N	\N
10	17d259f6-6e8a-4d99-bab1-7dc619b694c4	24	Breccia Violetta 3D Jumbo	breccia_violetta_3d_jumbo	Breccia Violetta is an one-of-a-kind, industry-first 3D through body quartz. It flaunts a warm white background adorned with a brecciated veining pattern in contrasting deep blue, purple and golden hues. The medley of colors add a visual depth to the stone. Breccia Violetta comes in Jumbo size, making it suitable for large scale applications. Its classic, marble-like charm lends a refined sense of luxury and opulence to any setting.		{"Polished "," Polished"}	BookMatch	{"2CM "," 3CM "}	{"126 X 63 "," 126 X 63"}	Engineered Quartz	f	f	Italy	478569	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	HIGH	HIGH	V1	f	f	f	t	2026-05-21 14:10:43.219	2026-05-21 14:10:43.219	\N	\N
12	b9a531fa-341b-485d-ab30-f9ac6da73982	24	Chamonix Crystal	chamonix_crystal	Our premium Chamonix Crystal quartz evokes the unmistakable beauty of Macaubas Fantasy quartzite. Its bluish-grey and golden-brown angular veining on the white background mimics the natural patterns of the quartzite, making it a perfect alternative for designing elegant and durable spaces.		{Polished}	BookMatch	{" 3CM"}	{"138 X 79"}	Engineered Quartz	f	t		236541	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	HIGH	V1	f	f	f	t	2026-05-21 14:29:53.861	2026-05-21 14:29:53.861	\N	\N
7	df287f17-c4f0-4271-8f5b-c096a5e8460c	24	Ariston Leather	ariston_leather	Ariston quartz is a beautiful modern style statement. It features a visually captivating surface with soft white and grey variations lending an organic appeal to the stone. The subtle palette of Aristo quartz blends perfectly with traditional and contemporary design schemes. Durable and sophisticated, this textured quartz is an ideal choice for designing stylish and functional interiors.		{Leather}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t	Brazil	123456	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	MEDIUM	V1	f	f	f	t	2026-05-21 14:00:47.167	2026-05-21 14:00:47.167	\N	\N
11	03458ba4-3e93-4a95-9cbf-4cca39eacb35	24	Calacatta Montana	calacatta_montana	Calacatta Montana enchants with marble-like allure, exuding timeless elegance and remarkable resilience. Its white surface is elevated by rustic golden veins, as natural in appearance as fine Italian marble. Subtle tone-on-tone striations in the background add depth and character, making it a coveted choice for those seeking organic charm. Calacatta Montana quartz is the perfect alternative to high-end marble where both aesthetics and functionality are essential.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	f	Turkey	456792	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	MEDIUM	V1	f	f	f	t	2026-05-21 14:13:13.526	2026-05-21 14:13:13.526	\N	\N
8	e58bae8b-ceb8-420b-bafd-983acfad46bc	24	Baccara Rose	baccara_rose	Baccara Rose embodies timeless elegance with its subtle hues and organic look. It showcases intricate details in soft grey, warm white, and golden tones. Its patterns resemble the shapes of rose petals. Artistic and durable, Baccara Rose is a perfect choice for stylish and sustainable residential and commercial spaces.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t	Brazil	456789	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	MEDIUM	V1	f	f	f	t	2026-05-21 14:02:43.633	2026-05-21 14:02:43.633	\N	\N
4	f781bc72-d593-4ebb-906f-04a70b258293	24	Crema Taj	crema_taj	Crema Taj is warm-tone quartz. It flaunts a soft white background mottled with subtle beige-golden veins and flecks, lending a sense of gentle charm to the stone. Crema Taj quartz is valued for its undisputed beauty and durability, making it a perfect choice for both residential and commercial applications. Design elegant flooring, countertops, and wall cladding with the wonderful Crema Taj quartz.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	f	Turkey	987654	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	MEDIUM	V1	f	f	f	t	2026-05-20 14:46:24.055	2026-05-20 14:46:24.055	\N	\N
9	7ed4e135-63e6-4336-83ce-e7265bf9fcf0	24	Belize Gold	belize_gold	Belize Gold Quartz captivates with its uniform appearance and exceptional durability. It flaunts a pristine white background accentuated by taupe veining. The subtle golden hints in the veining give the quartz an elevated look, making it an ideal choice for countertops, backsplashes, flooring, and more.		{Polished}	BookMatch	{3CM}	{"138 x 79"}	Engineered Quartz	f	t	Brazil	124563	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	LOW	V1	f	f	f	t	2026-05-21 14:04:13.863	2026-05-21 14:04:13.863	\N	\N
14	4f6f215f-2b80-48d7-8a47-73d12ce44355	24	Namibian Delight	namibian_delight	Namibian Delight is a beautiful quartz known for its organic appeal and superior durability. Subtle strokes of grey and tone-on-tone white veins on the pristine white background make this quartz more visually captivating, making it a great feature for designing statement countertops, vanities, shower walls, and more. Moreover, its durability contributes to the overall durability of a space.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t		123145	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	LOW	V1	f	f	f	t	2026-05-21 15:00:35.257	2026-05-21 15:00:35.257	\N	\N
13	062ef223-efa5-47f6-957d-de55dd56b785	24	Luccicoso Gold	luccicoso_gold	Defined by a gorgeous white background embellished with subtle, brecciated veins, Luccicoso Gold is a sight to behold. The soft grey veins are outlined with golden streaks, adding a touch of elegance and glamor to the stone. Its somber appearance transforms spaces into cozy and inviting retreats. Its enduring durability makes Luccicoso Gold quartz a perfect material to use in high-traffic areas such as living rooms, kitchens and bathrooms.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t		456189	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	MEDIUM	V1	f	f	f	t	2026-05-21 14:58:01.297	2026-05-21 14:58:01.297	\N	\N
15	93d7f238-3933-48f7-9c47-a5dfda0f5d8c	24	Ocean Sand	ocean_sand	Ocean Sand quartz is a perfect choice for designing residential and commercial spaces. It features a sand-hued surface embellished with small quartz crystals and subtle blue veins, adding an elegant touch to the stone’s appearance. Design high-end and luxurious countertops, islands, floors, and other decorative features with our premium Ocean Sand quartz slabs.		{Polished}	SlipMatch	{" 3CM"}	{"138 X 79"}	Engineered Quartz	f	t		741258	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	HIGH	V1	f	f	f	t	2026-05-21 15:04:30.711	2026-05-21 15:04:30.711	\N	\N
21	3dab7e63-aaf0-4795-8302-b786f3f5cbd2	42	test5	cattest5	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	{"DUAL FINISH POL/HON"}	Slipmatch	{"3 CM"}	{12x12}	HIGH END SEMI PRECIOUS	f	t	Brazil	666161	f	t	f	f	f	f	f	f	f	f	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V1	f	f	f	t	2026-06-05 13:23:12.219	2026-06-05 13:23:12.219	\N	\N
19	af25227a-aef3-4fcf-93f9-3cfcf8523016	42	test4	cattest4	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	{LEATHER/HONED}	Slipmatch	{"1.5 CM"}	{12x12}	ENGINEERED PORCELAIN	f	f	India	888181	t	f	f	f	f	f	f	f	f	f	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V3	f	f	f	t	2026-06-05 13:16:11.149	2026-06-05 13:16:11.149	f	
18	d038a134-f8d8-447d-a934-a4fc2f7238d6	42	test3	cattest3	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	{HONED}	Bookmatch	{"6 MM"}	{12X12}	HIGH END	f	t	Angola	12345	f	t	t	t	t	f	f	t	f	t	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V1	f	f	f	t	2026-06-05 13:09:37.824	2026-06-05 13:09:37.824	f	Filamp90 or Mapei Ultra Care
23	e2152bd9-e21d-4baf-a84b-53535370ce08	42	test7	cattest77	this is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbf	this is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbfthis is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbfthis is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbfthis is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbfthis is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbf	{"DUAL FINISH POLISHED/LEATHER"}	Bookmatch	{"6.35 CM"}	{12x12}	ENGINEERED QUARTZ	f	t	Algeria	12345	t	f	f	t	t	t	f	f	f	f	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V1	f	f	f	t	2026-06-05 17:16:33.492	2026-06-05 17:16:33.492	\N	\N
22	c8832597-9800-40b6-81bb-9975306b7e92	42	test6	cattest6	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	{FLAMMED}	Slipmatch	{"5 CM"}	{12x12}	HIGH END SEMI PRECIOUS	f	t		000000	f	t	f	f	f	f	f	f	f	f	HIGH	LOW	MEDIUM	HIGH	MEDIUM	HIGH	MEDIUM	V1	f	f	f	t	2026-06-05 13:34:02.535	2026-06-05 13:34:02.535	\N	\N
17	80295db3-9b60-476b-95db-03aa09844d5b	42	test2	cattest2	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.this is working testing from the blog login to check 12	{POLISHED}	Bookmatch	{"3 CM"}	{12X34}	ENGINEERED QUARTZ	f	t	Afghanistan	12345	f	t	t	t	t	f	f	t	f	t	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V3	f	f	f	t	2026-06-05 12:35:36.189	2026-06-05 12:35:36.189	t	\N
16	c9402baf-ce76-4549-811e-f4739633dfec	42	test	cattest1	this is short desc	this is long desc	{POLISHED}	Bookmatch	{"2 CM"}	{12x25}	SUPER EXOTIC	f	t	India	12346	t	f	t	f	t	f	f	t	t	t	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V1	f	f	f	t	2026-06-04 13:31:14.517	2026-06-04 13:31:14.517	f	Filamp90 or Mapei Ultra Care
3	cd5153eb-7353-4895-b818-3698fd8ff6b8	24	Arabesque	arabesque	Arabesque is a beautiful white and grey quartz, valued for its natural texture.	Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey gi	{HONED}	SlipMatch	{"3 CM"}	{"138 X 79"}	ENGINEERED QUARTZ	f	t	Brazil	123456	f	t	t	t	t	t	t	t	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	HIGH	V1	f	f	f	t	2026-05-20 14:43:16.808	2026-05-20 14:43:16.808	f	Filamp90 or Mapei Ultra Care
\.


--
-- TOC entry 4053 (class 0 OID 17087)
-- Dependencies: 234
-- Data for Name: sys_lookup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_lookup (id, lookup_code, lookup_name, description, is_active, display_order, created_at, updated_at) FROM stdin;
2	GROUP	Groups	Stone Groups	t	1	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
3	ORIGIN	Origins	Country Of Origin	t	1	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
4	THICKNESS	Thickness	Stone Thickness	t	1	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
5	FINISH	Finish	Stone Finish Types	t	1	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
\.


--
-- TOC entry 4055 (class 0 OID 17105)
-- Dependencies: 236
-- Data for Name: sys_lookup_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_lookup_details (id, lookup_id, value_code, value_name, description, display_order, is_active, created_at, updated_at) FROM stdin;
19	2	\N	BASIC	\N	1	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
20	2	\N	EXOTIC	\N	2	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
21	2	\N	SUPER EXOTIC	\N	3	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
22	2	\N	HIGH END	\N	4	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
23	2	\N	SUPER HIGH END	\N	5	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
24	2	\N	HIGH END SEMI PRECIOUS	\N	6	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
25	2	\N	ENGINEERED QUARTZ	\N	7	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
26	2	\N	ENGINEERED PORCELAIN	\N	8	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
27	2	\N	COMM	\N	9	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
29	2	\N	ULTRA LINE	\N	11	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
30	2	\N	SAMPLES	\N	12	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
31	3	\N	Afghanistan	\N	1	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
32	3	\N	Africa	\N	2	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
33	3	\N	Algeria	\N	3	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
34	3	\N	Angola	\N	4	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
35	3	\N	Austria	\N	5	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
36	3	\N	Belgium	\N	6	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
37	3	\N	Brazil	\N	7	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
38	3	\N	Bulgaria	\N	8	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
39	3	\N	Canada	\N	9	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
40	3	\N	Chile	\N	10	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
41	3	\N	China	\N	11	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
42	3	\N	Columbia	\N	12	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
43	3	\N	Croatia	\N	13	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
44	3	\N	Cuba	\N	14	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
45	3	\N	Czechoslovakia	\N	15	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
46	3	\N	Ecuador	\N	16	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
47	3	\N	Egypt	\N	17	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
48	3	\N	England	\N	18	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
49	3	\N	Ethiopia	\N	19	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
50	3	\N	Finland	\N	20	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
51	3	\N	France	\N	21	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
52	3	\N	Germany	\N	22	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
53	3	\N	Greece	\N	23	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
54	3	\N	Guatemala	\N	24	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
55	3	\N	Honduras	\N	25	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
56	3	\N	Hong Kong	\N	26	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
57	3	\N	India	\N	27	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
58	3	\N	Indonesia	\N	28	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
59	3	\N	Iran	\N	29	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
60	3	\N	Ireland	\N	30	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
61	3	\N	Israel	\N	31	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
62	3	\N	Italy	\N	32	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
63	3	\N	Japan	\N	33	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
64	3	\N	Jordan	\N	34	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
65	3	\N	Kenya	\N	35	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
66	3	\N	Korea	\N	36	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
67	3	\N	Lebanon	\N	37	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
68	3	\N	Malaysia	\N	38	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
69	3	\N	Mexico	\N	39	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
70	3	\N	Mongolia	\N	40	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
71	3	\N	Morocco	\N	41	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
72	3	\N	Netherlands (Holland)	\N	42	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
73	3	\N	New Zealand	\N	43	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
74	3	\N	Norway	\N	44	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
75	3	\N	Oman	\N	45	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
76	3	\N	Pakistan	\N	46	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
77	3	\N	Palestine	\N	47	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
78	3	\N	Peru	\N	48	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
79	3	\N	Philippines	\N	49	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
80	3	\N	Portugal	\N	50	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
81	3	\N	Ghana	\N	51	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
82	3	\N	Jamaica	\N	52	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
83	3	\N	Libya	\N	53	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
84	3	\N	Puerto Rico	\N	54	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
85	3	\N	Saudi Arabia	\N	55	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
86	3	\N	Serbia	\N	56	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
87	3	\N	Singapore	\N	57	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
88	3	\N	South Africa	\N	58	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
89	3	\N	Spain	\N	59	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
90	3	\N	Sri Lanka	\N	60	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
91	3	\N	Sweden	\N	61	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
92	3	\N	Switzerland	\N	62	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
28	2	\N	A FRAMES	\N	10	f	2026-06-04 21:24:19.024993	2026-06-10 19:47:41.936
93	3	\N	Taiwan	\N	63	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
94	3	\N	Thailand	\N	64	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
95	3	\N	Tunisia	\N	65	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
96	3	\N	Turkey	\N	66	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
97	3	\N	Ukraine	\N	67	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
98	3	\N	United Arab Emirates	\N	68	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
99	3	\N	United States	\N	69	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
100	3	\N	Venezuela	\N	70	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
101	3	\N	Vietnam	\N	71	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
102	3	\N	Yugoslavia	\N	72	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
103	3	\N	Argentina	\N	73	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
104	3	\N	test	\N	74	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
105	3	\N	test1	\N	75	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
106	3	\N	LA SPEZIA, ITALY	\N	76	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
107	3	\N	Zimbabwe	\N	77	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
108	3	\N	NAMIBIA	\N	78	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
109	4	\N	2 CM	\N	1	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
110	4	\N	3 CM	\N	2	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
111	4	\N	5 CM	\N	3	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
112	4	\N	1.2 CM	\N	4	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
113	4	\N	6 MM	\N	5	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
114	4	\N	1.5 CM	\N	6	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
115	4	\N	6.35 CM	\N	7	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
116	4	\N	12 MM	\N	8	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
117	4	\N	1.8 CM	\N	9	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
118	4	\N	8 MM	\N	10	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
119	4	\N	1.7 CM	\N	11	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
120	4	\N	1.6 CM	\N	12	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
121	5	\N	POLISHED	\N	1	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
122	5	\N	FLAMMED	\N	2	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
123	5	\N	DUAL FINISH POL/HON	\N	3	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
124	5	\N	DUAL FINISH POLISHED/LEATHER	\N	4	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
125	5	\N	LEATHER/HONED	\N	5	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
126	5	\N	HONED	\N	6	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
127	5	\N	BRUSHED	\N	7	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
128	5	\N	LEATHER	\N	8	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
129	5	\N	FILLED/HONED	\N	9	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
130	5	\N	TRANCHE	\N	10	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
131	5	\N	MATT	\N	11	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
132	5	\N	SANDBLAST	\N	12	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
133	5	\N	GRAFFITI	\N	13	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
134	5	\N	HONED WITH AGER	\N	14	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
135	5	\N	VELVET	\N	15	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
\.


--
-- TOC entry 4048 (class 0 OID 16796)
-- Dependencies: 229
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, user_id, email, password_hash, first_name, last_name, is_active, last_login, created_at, updated_at, deleted_at, role_id) FROM stdin;
9	6d015d0d-9c42-44e3-ab96-07a7a3e80d65	blogs@ultrastones.com	$2b$10$WG1J1TxDGBui7HSjXjFCtO1NsBw8iAADmmJpUpMoWl2zQFb6wEwIa	Rusha	Lodh	t	2026-06-06 16:04:04.379	2026-06-04 15:35:03.218	2026-06-04 15:35:03.218	\N	5
2	ae7f1df7-f3c3-47c2-9531-abfcbc1fa7a8	admin@test.com	$2b$10$P37uXvfqj56njNogQmV8kuNEp5u.hJASjvYvPX0.9R9AYsar6EhCi	Admin	User	f	\N	2026-06-02 17:51:29.807	2026-06-02 17:51:29.807	2026-06-02 19:12:32.174	1
14	b926f348-08b8-48c4-b5ac-8e89dfc13732	kkpatel@gmail.co	$2b$10$UfS71ECbgQ6aU9Rxvn8cOuVYofeqqbrk5uJ0USGlyKGWPpXpeBfua	Khush	Pandya	t	\N	2026-06-08 19:44:41.453	2026-06-08 19:45:18.584	\N	6
13	90ac901b-cec0-4d9f-b0f8-a275fdee070a	test1@gmail.com	$2b$10$LysRaZK2x8LjSxG9kDoNTex2s8DULQ3Bxcb67OdytHEpLAX2mEKha	test	test	f	\N	2026-06-08 19:27:05.015	2026-06-08 19:27:05.015	2026-06-08 19:50:46.092	1
4	b5c28ab0-cdcf-4831-943e-ec8966f3b22e	design2ultrastones@gmail.com	$2b$10$wxoVgXDSu8Jxj0US64jG2u31oDMtgO03WGkJ34wSYa7f43kFr/ENa	Kapil	Joshi	t	2026-06-09 15:42:24.988	2026-06-02 19:11:59.463	2026-06-02 19:11:59.463	\N	3
5	6b91cdbe-577a-4113-916b-bd1e62d2b74c	deepenultrastones@gmail.com	$2b$10$VrJjZi3wSS4xUvPzMWlnWuvsCJnthJNn4JRECTUGhUKckj.ZkO70G	Deepen	Patel	t	\N	2026-06-03 17:07:52.985	2026-06-03 17:07:52.985	\N	4
6	00ea39bf-4b34-47a3-99bf-02d6cdada916	shivam@ultrastones.com	$2b$10$quFTpeKxwsoC5iq/acn2mejQyBTSQw5VB5f2547dKpGcDkThyXoBa	Shivam	Patel	t	\N	2026-06-04 15:32:49.54	2026-06-04 15:32:49.54	\N	1
8	14ced520-b4bd-4c20-8cf7-4cd07724acc7	piyush.ultrastones@gmail.com	$2b$10$VMrTrjJTnvQZJrskJw2v/uOTSD4FfA0RB5kRthjNdyXS33wBoO.uW	Piyush	Chauhan	t	\N	2026-06-04 15:34:12.667	2026-06-04 15:34:12.667	\N	4
10	418cb70e-2e34-4223-bf44-97cbb8076410	seo@ultrastones.com	$2b$10$clJIOOGFv9Da/gSqwip.NOv7X.aUBNJiLd5w2ni5nrRS3CUsCEbdK	Ramesh	A	t	\N	2026-06-04 15:35:26.603	2026-06-04 15:35:26.603	\N	6
7	3a8862be-0f68-4297-9851-539cf7d2dd34	neel@ultrastones.com	$2b$10$OdycwmqJAZNujRakLZ8zYuapu1PnB.ldUfC1.Agjz01Xf6YDLb2JK	Neel 	Patel	t	2026-06-10 18:13:18.828	2026-06-04 15:33:19.064	2026-06-04 15:33:19.064	\N	2
1	f8655517-d946-44fc-af01-169d43f3d6a3	webdesign.ultraimpex@gmail.com	$2b$10$MvU5DHOdTRuF6aymuzi0cOczvKXt8cJEiUmveWk7IckAOF.1UmBp.	Khush	Patel	t	2026-06-12 12:08:13.022	2026-06-02 17:17:38.816	2026-06-02 17:30:24.006	\N	1
3	243f2904-bc3e-4ce1-b8f1-3f7db9c6986f	design1@ultrastones.com	$2b$10$vFJcK6o199QR.6K8MyStNethaC1wh3lAhadT9pZrlZ/ipDbrm6cdK	Pratik	Bhoi	t	2026-06-05 16:59:25.354	2026-06-02 19:11:24.52	2026-06-02 19:11:24.52	\N	3
\.


--
-- TOC entry 4077 (class 0 OID 0)
-- Dependencies: 222
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 41, true);


--
-- TOC entry 4078 (class 0 OID 0)
-- Dependencies: 231
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 6, true);


--
-- TOC entry 4079 (class 0 OID 0)
-- Dependencies: 239
-- Name: showrooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.showrooms_id_seq', 1, false);


--
-- TOC entry 4080 (class 0 OID 0)
-- Dependencies: 224
-- Name: stone_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stone_categories_id_seq', 43, true);


--
-- TOC entry 4081 (class 0 OID 0)
-- Dependencies: 226
-- Name: stone_product_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stone_product_media_id_seq', 166, true);


--
-- TOC entry 4082 (class 0 OID 0)
-- Dependencies: 237
-- Name: stone_product_seo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stone_product_seo_id_seq', 1, true);


--
-- TOC entry 4083 (class 0 OID 0)
-- Dependencies: 228
-- Name: stone_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stone_products_id_seq', 23, true);


--
-- TOC entry 4084 (class 0 OID 0)
-- Dependencies: 235
-- Name: sys_lookup_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_lookup_details_id_seq', 135, true);


--
-- TOC entry 4085 (class 0 OID 0)
-- Dependencies: 233
-- Name: sys_lookup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_lookup_id_seq', 5, true);


--
-- TOC entry 4086 (class 0 OID 0)
-- Dependencies: 230
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- TOC entry 3836 (class 2606 OID 16837)
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3865 (class 2606 OID 17064)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 3867 (class 2606 OID 17062)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3882 (class 2606 OID 17204)
-- Name: showrooms showrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showrooms
    ADD CONSTRAINT showrooms_pkey PRIMARY KEY (id);


--
-- TOC entry 3884 (class 2606 OID 17206)
-- Name: showrooms showrooms_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showrooms
    ADD CONSTRAINT showrooms_slug_key UNIQUE (slug);


--
-- TOC entry 3845 (class 2606 OID 16911)
-- Name: stone_categories stone_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories
    ADD CONSTRAINT stone_categories_name_key UNIQUE (name);


--
-- TOC entry 3847 (class 2606 OID 16913)
-- Name: stone_categories stone_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories
    ADD CONSTRAINT stone_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3849 (class 2606 OID 16915)
-- Name: stone_categories stone_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories
    ADD CONSTRAINT stone_categories_slug_key UNIQUE (slug);


--
-- TOC entry 3851 (class 2606 OID 16923)
-- Name: stone_product_media stone_product_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_media
    ADD CONSTRAINT stone_product_media_pkey PRIMARY KEY (id);


--
-- TOC entry 3878 (class 2606 OID 17168)
-- Name: stone_product_seo stone_product_seo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_seo
    ADD CONSTRAINT stone_product_seo_pkey PRIMARY KEY (id);


--
-- TOC entry 3880 (class 2606 OID 17170)
-- Name: stone_product_seo stone_product_seo_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_seo
    ADD CONSTRAINT stone_product_seo_product_id_key UNIQUE (product_id);


--
-- TOC entry 3853 (class 2606 OID 16925)
-- Name: stone_products stone_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_products
    ADD CONSTRAINT stone_products_pkey PRIMARY KEY (id);


--
-- TOC entry 3855 (class 2606 OID 16927)
-- Name: stone_products stone_products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_products
    ADD CONSTRAINT stone_products_slug_key UNIQUE (slug);


--
-- TOC entry 3874 (class 2606 OID 17119)
-- Name: sys_lookup_details sys_lookup_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup_details
    ADD CONSTRAINT sys_lookup_details_pkey PRIMARY KEY (id);


--
-- TOC entry 3869 (class 2606 OID 17103)
-- Name: sys_lookup sys_lookup_lookup_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup
    ADD CONSTRAINT sys_lookup_lookup_code_key UNIQUE (lookup_code);


--
-- TOC entry 3871 (class 2606 OID 17101)
-- Name: sys_lookup sys_lookup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup
    ADD CONSTRAINT sys_lookup_pkey PRIMARY KEY (id);


--
-- TOC entry 3859 (class 2606 OID 16937)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3861 (class 2606 OID 16939)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3863 (class 2606 OID 16941)
-- Name: users users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_id_key UNIQUE (user_id);


--
-- TOC entry 3837 (class 1259 OID 17082)
-- Name: idx_activity_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_action ON public.activity_logs USING btree (action);


--
-- TOC entry 3838 (class 1259 OID 16942)
-- Name: idx_activity_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_created ON public.activity_logs USING btree (created_at);


--
-- TOC entry 3839 (class 1259 OID 17072)
-- Name: idx_activity_logs_resource; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_resource ON public.activity_logs USING btree (resource_type, resource_id);


--
-- TOC entry 3840 (class 1259 OID 17083)
-- Name: idx_activity_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_module ON public.activity_logs USING btree (module_name);


--
-- TOC entry 3841 (class 1259 OID 17084)
-- Name: idx_activity_request; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_request ON public.activity_logs USING btree (request_id);


--
-- TOC entry 3842 (class 1259 OID 17085)
-- Name: idx_activity_resource_full; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_resource_full ON public.activity_logs USING btree (resource_type, resource_id, created_at DESC);


--
-- TOC entry 3843 (class 1259 OID 16944)
-- Name: idx_activity_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_user ON public.activity_logs USING btree (user_id);


--
-- TOC entry 3872 (class 1259 OID 17125)
-- Name: idx_lookup_details_lookup_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lookup_details_lookup_id ON public.sys_lookup_details USING btree (lookup_id);


--
-- TOC entry 3875 (class 1259 OID 17177)
-- Name: idx_stone_product_seo_meta_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stone_product_seo_meta_title ON public.stone_product_seo USING btree (meta_title);


--
-- TOC entry 3876 (class 1259 OID 17176)
-- Name: idx_stone_product_seo_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stone_product_seo_product_id ON public.stone_product_seo USING btree (product_id);


--
-- TOC entry 3856 (class 1259 OID 16961)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3857 (class 1259 OID 17070)
-- Name: idx_users_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role_id ON public.users USING btree (role_id);


--
-- TOC entry 3892 (class 2620 OID 17179)
-- Name: stone_product_seo trg_stone_product_seo_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_stone_product_seo_updated_at BEFORE UPDATE ON public.stone_product_seo FOR EACH ROW EXECUTE FUNCTION public.update_stone_product_seo_updated_at();


--
-- TOC entry 3885 (class 2606 OID 16964)
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3891 (class 2606 OID 17171)
-- Name: stone_product_seo fk_stone_product_seo_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_seo
    ADD CONSTRAINT fk_stone_product_seo_product FOREIGN KEY (product_id) REFERENCES public.stone_products(id) ON DELETE CASCADE;


--
-- TOC entry 3889 (class 2606 OID 17065)
-- Name: users fk_users_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 3886 (class 2606 OID 17029)
-- Name: stone_categories stone_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories
    ADD CONSTRAINT stone_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.stone_categories(id) ON DELETE SET NULL;


--
-- TOC entry 3887 (class 2606 OID 17034)
-- Name: stone_product_media stone_product_media_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_media
    ADD CONSTRAINT stone_product_media_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.stone_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3888 (class 2606 OID 17039)
-- Name: stone_products stone_products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_products
    ADD CONSTRAINT stone_products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.stone_categories(id);


--
-- TOC entry 3890 (class 2606 OID 17120)
-- Name: sys_lookup_details sys_lookup_details_lookup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup_details
    ADD CONSTRAINT sys_lookup_details_lookup_id_fkey FOREIGN KEY (lookup_id) REFERENCES public.sys_lookup(id) ON DELETE CASCADE;


-- Completed on 2026-06-12 23:19:18 IST

--
-- PostgreSQL database dump complete
--

\unrestrict aYKwvtSHgGobEFRdMfC9NICb5aE7bdXPuwa7rDL66pClN98o1SN0YDN92ODUig5


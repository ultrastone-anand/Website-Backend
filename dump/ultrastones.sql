--
-- PostgreSQL database dump
--

\restrict N4ovFnSUR8MUwrRslFCDV2NZ2yIlrlmRAPcZaehkKvGQoUNJIRSvtiSldIFo7If

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-06 21:41:37 IST

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
-- TOC entry 4076 (class 0 OID 0)
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
-- TOC entry 4077 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16477)
-- Name: showrooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.showrooms (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(100) NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(50) NOT NULL,
    zip_code character varying(20),
    country character varying(100),
    phone character varying(20),
    fax character varying(20),
    email character varying(255),
    latitude numeric(10,8),
    longitude numeric(11,8),
    business_hours_mon_fri character varying(50),
    business_hours_saturday character varying(50),
    business_hours_sunday character varying(50),
    description text,
    image_url character varying(500),
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    display_order integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.showrooms OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16492)
-- Name: active_showrooms; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_showrooms AS
 SELECT id,
    name,
    slug,
    address,
    city,
    state,
    zip_code,
    country,
    phone,
    fax,
    email,
    latitude,
    longitude,
    business_hours_mon_fri,
    business_hours_saturday,
    business_hours_sunday,
    description,
    image_url,
    is_active,
    is_featured,
    display_order,
    created_at,
    updated_at
   FROM public.showrooms
  WHERE (is_active = true)
  ORDER BY display_order, created_at;


ALTER VIEW public.active_showrooms OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16497)
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
-- TOC entry 224 (class 1259 OID 16504)
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
-- TOC entry 4078 (class 0 OID 0)
-- Dependencies: 224
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- TOC entry 225 (class 1259 OID 16540)
-- Name: company_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_info (
    id integer NOT NULL,
    company_name character varying(255) DEFAULT 'Ultra Stones'::character varying NOT NULL,
    company_description text,
    logo_url character varying(500),
    favicon_url character varying(500),
    phone_primary character varying(20),
    phone_secondary character varying(20),
    email_primary character varying(255),
    email_secondary character varying(255),
    whatsapp_number character varying(20),
    website_url character varying(255),
    founded_year integer,
    total_stones_count integer DEFAULT 500,
    meta_description text,
    meta_keywords text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.company_info OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16551)
-- Name: company_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_info_id_seq OWNER TO postgres;

--
-- TOC entry 4079 (class 0 OID 0)
-- Dependencies: 226
-- Name: company_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_info_id_seq OWNED BY public.company_info.id;


--
-- TOC entry 239 (class 1259 OID 17047)
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
-- TOC entry 238 (class 1259 OID 17046)
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
-- TOC entry 4080 (class 0 OID 0)
-- Dependencies: 238
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 227 (class 1259 OID 16694)
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
-- TOC entry 4081 (class 0 OID 0)
-- Dependencies: 227
-- Name: showrooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.showrooms_id_seq OWNED BY public.showrooms.id;


--
-- TOC entry 228 (class 1259 OID 16695)
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    setting_key character varying(100) NOT NULL,
    setting_value text,
    setting_type character varying(50),
    description text,
    is_editable boolean DEFAULT true,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16704)
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO postgres;

--
-- TOC entry 4082 (class 0 OID 0)
-- Dependencies: 229
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- TOC entry 230 (class 1259 OID 16705)
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
-- TOC entry 231 (class 1259 OID 16716)
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
-- TOC entry 4083 (class 0 OID 0)
-- Dependencies: 231
-- Name: stone_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stone_categories_id_seq OWNED BY public.stone_categories.id;


--
-- TOC entry 232 (class 1259 OID 16729)
-- Name: stone_product_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stone_product_media (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    media_type character varying(30) NOT NULL,
    media_url text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    public_id text
);


ALTER TABLE public.stone_product_media OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16740)
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
-- TOC entry 4084 (class 0 OID 0)
-- Dependencies: 233
-- Name: stone_product_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stone_product_media_id_seq OWNED BY public.stone_product_media.id;


--
-- TOC entry 234 (class 1259 OID 16741)
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
    interior_wall boolean
);


ALTER TABLE public.stone_products OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16769)
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
-- TOC entry 4085 (class 0 OID 0)
-- Dependencies: 235
-- Name: stone_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stone_products_id_seq OWNED BY public.stone_products.id;


--
-- TOC entry 241 (class 1259 OID 17087)
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
-- TOC entry 243 (class 1259 OID 17105)
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
-- TOC entry 242 (class 1259 OID 17104)
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
-- TOC entry 4086 (class 0 OID 0)
-- Dependencies: 242
-- Name: sys_lookup_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_lookup_details_id_seq OWNED BY public.sys_lookup_details.id;


--
-- TOC entry 240 (class 1259 OID 17086)
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
-- TOC entry 4087 (class 0 OID 0)
-- Dependencies: 240
-- Name: sys_lookup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_lookup_id_seq OWNED BY public.sys_lookup.id;


--
-- TOC entry 236 (class 1259 OID 16796)
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
-- TOC entry 237 (class 1259 OID 16810)
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
-- TOC entry 4088 (class 0 OID 0)
-- Dependencies: 237
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3788 (class 2604 OID 16811)
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- TOC entry 3790 (class 2604 OID 16815)
-- Name: company_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_info ALTER COLUMN id SET DEFAULT nextval('public.company_info_id_seq'::regclass);


--
-- TOC entry 3830 (class 2604 OID 17050)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3783 (class 2604 OID 16827)
-- Name: showrooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showrooms ALTER COLUMN id SET DEFAULT nextval('public.showrooms_id_seq'::regclass);


--
-- TOC entry 3795 (class 2604 OID 16828)
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- TOC entry 3798 (class 2604 OID 16829)
-- Name: stone_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories ALTER COLUMN id SET DEFAULT nextval('public.stone_categories_id_seq'::regclass);


--
-- TOC entry 3802 (class 2604 OID 16831)
-- Name: stone_product_media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_media ALTER COLUMN id SET DEFAULT nextval('public.stone_product_media_id_seq'::regclass);


--
-- TOC entry 3805 (class 2604 OID 16832)
-- Name: stone_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_products ALTER COLUMN id SET DEFAULT nextval('public.stone_products_id_seq'::regclass);


--
-- TOC entry 3835 (class 2604 OID 17090)
-- Name: sys_lookup id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup ALTER COLUMN id SET DEFAULT nextval('public.sys_lookup_id_seq'::regclass);


--
-- TOC entry 3840 (class 2604 OID 17108)
-- Name: sys_lookup_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup_details ALTER COLUMN id SET DEFAULT nextval('public.sys_lookup_details_id_seq'::regclass);


--
-- TOC entry 3825 (class 2604 OID 16835)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4050 (class 0 OID 16497)
-- Dependencies: 223
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, user_id, action, resource_type, resource_id, description, old_values, new_values, ip_address, user_agent, created_at, module_name, changed_fields, request_id, created_by_name) FROM stdin;
\.


--
-- TOC entry 4052 (class 0 OID 16540)
-- Dependencies: 225
-- Data for Name: company_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_info (id, company_name, company_description, logo_url, favicon_url, phone_primary, phone_secondary, email_primary, email_secondary, whatsapp_number, website_url, founded_year, total_stones_count, meta_description, meta_keywords, created_at, updated_at) FROM stdin;
1	Ultra Stones	Leading supplier of exotic granite, marble & quartz countertop surfaces across the USA	\N	\N	631-873-4747	631-873-4748	info@ultrastones.com	\N	+1-631-873-4747	https://www.ultrastones.com	\N	500	\N	\N	2026-05-06 18:50:11.891694	2026-05-06 18:50:11.891694
\.


--
-- TOC entry 4066 (class 0 OID 17047)
-- Dependencies: 239
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
-- TOC entry 4049 (class 0 OID 16477)
-- Dependencies: 221
-- Data for Name: showrooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.showrooms (id, name, slug, address, city, state, zip_code, country, phone, fax, email, latitude, longitude, business_hours_mon_fri, business_hours_saturday, business_hours_sunday, description, image_url, is_active, is_featured, display_order, created_at, updated_at) FROM stdin;
1	New York Showroom	new-york	55 Central Drive, Farmingdale	Farmingdale	NY	11735	USA	631-873-4747	631-873-4749	ny@ultrastones.com	\N	\N	8:00 AM to 5:00 PM	9:00 AM to 1:00 PM	\N	\N	\N	t	t	1	2026-05-06 18:50:16.988781	2026-05-06 18:50:16.988781
2	Philadelphia Showroom	philadelphia	3907 Nebraska St, Levittown	Levittown	PA	19056	USA	215-647-3972	215-647-3977	pa@ultrastones.com	\N	\N	8:00 AM to 5:00 PM	9:00 AM to 1:00 PM	\N	\N	\N	t	t	2	2026-05-06 18:50:16.988781	2026-05-06 18:50:16.988781
\.


--
-- TOC entry 4055 (class 0 OID 16695)
-- Dependencies: 228
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (id, setting_key, setting_value, setting_type, description, is_editable, updated_at) FROM stdin;
\.


--
-- TOC entry 4057 (class 0 OID 16705)
-- Dependencies: 230
-- Data for Name: stone_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stone_categories (id, name, slug, description, parent_id, thumbnail_url, banner_url, is_active, display_order, meta_description, meta_keywords, seo_title, created_at, updated_at) FROM stdin;
15	Calcite	calcite	Calcite stone collection	\N	\N	\N	t	1	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
16	Dolomite	dolomite	Dolomite stone collection	\N	\N	\N	t	2	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
17	Granite	granite	Granite stone collection	\N	\N	\N	t	3	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
18	Glass	glass	Glass stone collection	\N	\N	\N	t	4	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
19	Limestone	limestone	Limestone stone collection	\N	\N	\N	t	5	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
20	Marble	marble	Marble stone collection	\N	\N	\N	t	6	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
21	Onyx	onyx	Onyx stone collection	\N	\N	\N	t	7	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
22	Precious Stone	precious-stone	Precious stone collection	\N	\N	\N	t	8	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
23	Porcelain Tile	porcelain-tile	Porcelain tile collection	\N	\N	\N	t	9	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
25	Quartzite	quartzite	Quartzite stone collection	\N	\N	\N	t	11	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
26	Soapstone	soapstone	Soapstone collection	\N	\N	\N	t	12	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
27	Slate	slate	Slate collection	\N	\N	\N	t	13	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
29	Porcelain Slabs	porcelain-slabs	Porcelain slab collection	\N	\N	\N	t	15	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
30	12MM Kaolin Slabs	12mm-kaolin-slabs	12MM Kaolin porcelain slabs	29	\N	\N	t	1	\N	\N	\N	2026-05-06 19:07:55.033721	2026-05-06 19:07:55.033721
31	2CM Full Body Slabs Atlas Plan	2cm-full-body-slabs-atlas-plan	2CM Full Body Atlas Plan slabs	29	\N	\N	t	2	\N	\N	\N	2026-05-06 19:07:55.033721	2026-05-06 19:07:55.033721
28	Travertine	travertine	Travertine collection	\N	\N	\N	t	14	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
32	test THIS IS AHDFOLNFOPSNF	test	test 	\N	\N	\N	f	1	\N	\N	\N	2026-05-08 13:11:02.957	2026-05-08 13:11:02.957
36	khush	khush	Khush	28	\N	\N	f	1	\N	\N	\N	2026-05-09 13:37:36.932	2026-05-09 13:37:36.932
24	Ultra Quartz	ultra-quartz	Ultra Quartz collection	\N	\N	\N	t	10	\N	\N	\N	2026-05-06 19:06:56.480229	2026-05-06 19:06:56.480229
38	test	child-test	etest	23	\N	\N	f	1	\N	\N	\N	2026-05-09 14:28:24.718	2026-05-09 14:28:24.718
40	xyz-child	child123	testq21378	39	\N	\N	f	1	\N	\N	\N	2026-05-09 15:04:28.192	2026-05-09 15:04:28.192
39	xyz	test123	test	\N	\N	\N	f	1	\N	\N	\N	2026-05-09 15:04:00.596	2026-05-09 15:04:00.596
41	xyza	abc	test	\N	\N	\N	f	1	\N	\N	\N	2026-05-09 15:54:22.799	2026-05-09 15:54:22.799
42	testCategory1	cattest1	this is test	\N	\N	\N	t	1	\N	\N	\N	2026-06-03 20:37:11.052	2026-06-03 20:37:11.052
\.


--
-- TOC entry 4059 (class 0 OID 16729)
-- Dependencies: 232
-- Data for Name: stone_product_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stone_product_media (id, product_id, media_type, media_url, display_order, created_at, public_id) FROM stdin;
45	6	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779373929/ultrastones/products/videos/obbqtelz0phdgj9lwtz3.mp4	0	2026-05-22 13:41:08.352	\N
48	7	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779374075/ultrastones/products/videos/gobnltne0udds0l44qxr.mp4	0	2026-05-22 13:41:15.674	\N
51	8	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779374038/ultrastones/products/videos/ojylcn3swfblyvfghnxu.mp4	0	2026-05-22 13:41:21.05	\N
56	4	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779290637/ultrastones/products/videos/xv2bozxjiehmexioeugi.mp4	0	2026-05-22 13:41:38.727	\N
59	5	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779291054/ultrastones/products/videos/xbymjyz0zdkynt2a8ep0.mp4	0	2026-05-22 13:41:45.334	\N
62	14	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779375772/ultrastones/products/videos/tc5kz1xqmn99q2e9llrz.mp4	0	2026-05-22 13:41:49.561	\N
65	13	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779375521/ultrastones/products/videos/rwm5qma5fbs3rp3slwdg.mp4	0	2026-05-22 13:41:53.609	\N
70	10	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779374297/ultrastones/products/videos/hzh9y2a7avyfmvpkkyik.mp4	0	2026-05-22 13:42:08.362	\N
77	3	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1779289969/ultrastones/products/videos/atuyi3o2mrfmqw1goqwk.mp4	0	2026-05-22 13:51:28.614	\N
93	16	BOOKMATCH_SLIPMATCH	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606143/ultrastones/products/bookmatch-slipmatch/nxuwipt1qjyvtgzhxdww.svg	0	2026-06-05 12:35:49.109	\N
43	6	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779373912/ultrastones/products/featured/hcygv08sf4s0eykqrn8x.jpg	0	2026-05-22 13:41:08.352	\N
46	7	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374065/ultrastones/products/featured/l9ovbvxaqa2ttyiys3rn.jpg	0	2026-05-22 13:41:15.674	\N
49	8	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374028/ultrastones/products/featured/oxhu6kgjckbev1b6sote.jpg	0	2026-05-22 13:41:21.05	\N
52	11	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374352/ultrastones/products/featured/qfhgunvwl9zxwrhwliyz.jpg	0	2026-05-22 13:41:32.738	\N
44	6	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779373914/ultrastones/products/gallery/plkzrnsy4syku51julez.jpg	0	2026-05-22 13:41:08.352	\N
47	7	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374067/ultrastones/products/gallery/iwiv2i0itinkolcokf46.jpg	0	2026-05-22 13:41:15.674	\N
50	8	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374030/ultrastones/products/gallery/apbcxob28il8bzdy6i7u.jpg	0	2026-05-22 13:41:21.05	\N
53	11	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374354/ultrastones/products/gallery/swldyhnut2awf9fly6he.jpg	0	2026-05-22 13:41:32.738	\N
55	4	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779290635/ultrastones/products/gallery/ekos27xz6p89i2co5azm.jpg	0	2026-05-22 13:41:38.727	\N
58	5	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779291050/ultrastones/products/gallery/z9gix4gkrbg5ctoambxs.jpg	0	2026-05-22 13:41:45.334	\N
61	14	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375771/ultrastones/products/gallery/jxvnfgpgxbkm5glyeixl.jpg	0	2026-05-22 13:41:49.561	\N
64	13	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375519/ultrastones/products/gallery/mp2idvbz5kdg4rk5qetx.jpg	0	2026-05-22 13:41:53.609	\N
67	15	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375905/ultrastones/products/gallery/i6j3voshyjojk163io6d.jpg	0	2026-05-22 13:41:57.379	\N
69	10	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374296/ultrastones/products/gallery/qexiswapbgglcmmcsg7j.jpg	0	2026-05-22 13:42:08.362	\N
72	12	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374426/ultrastones/products/gallery/ww2rzg6b3dqssydek4qz.jpg	0	2026-05-22 13:42:15.192	\N
74	9	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374239/ultrastones/products/gallery/ubx8czjabe2uvdv2wwxy.jpg	0	2026-05-22 13:42:34.11	\N
76	3	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779289280/ultrastones/products/gallery/t4azgh4p0mhfyct4mcop.jpg	0	2026-05-22 13:51:28.614	\N
92	16	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780606493/ultrastones/products/gallery/yjx4hiupwnu6fvddxunj.png	0	2026-06-05 12:35:49.109	\N
142	17	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780663076/ultrastones/products/featured/fhmyuvsqulcpfszuzvo2.jpg	0	2026-06-05 19:12:51.098	\N
143	17	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780663078/ultrastones/products/gallery/aic0qxotcltol19k37oz.jpg	0	2026-06-05 19:12:51.098	\N
144	17	APPLICATION_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780663079/ultrastones/products/application/gpln4fdlheyrgmiyckkq.jpg	0	2026-06-05 19:12:51.098	\N
145	17	BOOKMATCH_SLIPMATCH	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780663080/ultrastones/products/bookmatch-slipmatch/qrjequpbjos3ne5lcb5h.jpg	0	2026-06-05 19:12:51.098	\N
118	22	FEATURED_VIDEO	https://res.cloudinary.com/dx0u8csf4/video/upload/v1780666600/ultrastones/products/videos/b7kmgyh8i4msibrookox.mp4	0	2026-06-05 13:36:41.63	\N
119	22	BOOKMATCH_SLIPMATCH	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780666529/ultrastones/products/bookmatch-slipmatch/yhb7wd8lopmbyoapkyzw.jpg	0	2026-06-05 13:36:41.63	\N
128	23	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780679791/ultrastones/products/featured/eh0oamgecvlf2tvhior0.jpg	0	2026-06-05 17:16:33.492	\N
129	23	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780679792/ultrastones/products/gallery/ydyw3mlilstudrvicj5i.jpg	0	2026-06-05 17:16:33.492	\N
54	4	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779290634/ultrastones/products/featured/u96abfnfh0fopgljgmcw.jpg	0	2026-05-22 13:41:38.727	\N
57	5	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779291048/ultrastones/products/featured/ixikrbprowo3c2srujsj.jpg	0	2026-05-22 13:41:45.334	\N
60	14	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375768/ultrastones/products/featured/etmjjlkmvspvrd3pyhof.jpg	0	2026-05-22 13:41:49.561	\N
63	13	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375517/ultrastones/products/featured/fvwfkugrijsin6seqp2x.jpg	0	2026-05-22 13:41:53.609	\N
66	15	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779375904/ultrastones/products/featured/z1w959bzvaaas4bcargn.jpg	0	2026-05-22 13:41:57.379	\N
68	10	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374294/ultrastones/products/featured/jgrj7k05qs1o3p6wfzkm.jpg	0	2026-05-22 13:42:08.362	\N
71	12	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374424/ultrastones/products/featured/ophkymars9m8h3fv3c20.jpg	0	2026-05-22 13:42:15.192	\N
73	9	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779374237/ultrastones/products/featured/xlxyajeij5wcjr63fvox.jpg	0	2026-05-22 13:42:34.11	\N
75	3	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1779288584/ultrastones/products/featured/eeb11tqiebpt9xy1tv2m.jpg	0	2026-05-22 13:51:28.614	\N
91	16	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780580062/ultrastones/products/featured/vhw6z9x0iydo7m52exxv.png	0	2026-06-05 12:35:49.109	\N
107	18	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665045/ultrastones/products/featured/n1isfaohqgn5avl1wfls.jpg	0	2026-06-05 13:13:38.125	\N
109	21	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665789/ultrastones/products/featured/ixqku9adzwu8b8a3ymwh.jpg	0	2026-06-05 13:23:12.219	\N
116	22	CLOSEUP_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780666438/ultrastones/products/featured/quzixc48cxq7ocl5yblr.jpg	0	2026-06-05 13:36:41.63	\N
108	18	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665217/ultrastones/products/gallery/foofpr2ycqorms1zvmng.jpg	0	2026-06-05 13:13:38.125	\N
110	21	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780665790/ultrastones/products/gallery/xpsspfqbyfraihitzh9p.jpg	0	2026-06-05 13:23:12.219	\N
117	22	SLAB_IMAGE	https://res.cloudinary.com/dx0u8csf4/image/upload/v1780666440/ultrastones/products/gallery/tu02exnv1muh3uhsye7a.jpg	0	2026-06-05 13:36:41.63	\N
\.


--
-- TOC entry 4061 (class 0 OID 16741)
-- Dependencies: 234
-- Data for Name: stone_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stone_products (id, product_id, category_id, name, slug, small_description, long_description, finishes_available, pattern, thicknesses_cm, average_sizes_inches, stone_group, translucent, cut_to_size, origin_country, pantone_colour, color_enhancing, countertops_vanities, interior_floor, shower_wall, shower_floor, exterior_floor, exterior_wall, pool_fountain, fireplace, furniture_top, abrasion_resistance, stain_resistance, etching_resistance, heat_resistance, uv_resistance, color_range, movement_index, variation_level, is_featured, is_trending, is_new_arrival, is_active, created_at, updated_at, interior_wall) FROM stdin;
6	6e8b85e0-ea6e-48a4-9b3b-81fab31bffeb	24	Ariston	ariston	Ariston Polished Quartz is a striking modern style statement, celebrated for its visually captivating surface and gentle white and grey variations that lend an organic, natural appeal. Its subtle palette blends effortlessly with both traditional and contemporary design styles, offering versatility across a variety of interiors. The polished finish enhances brightness by reflecting natural light, making any space feel open, airy, and subtly refined.\r\n\r\n		{"Polished "," Polished"}	SlipMatch	{"3 CM "," 3 CM"}	{"138 X 79 "," 126 X 63"}	Engineered Quartz	f	t	India	456789	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	MEDIUM	V1	f	f	f	t	2026-05-21 13:58:51.457	2026-05-21 13:58:51.457	\N
5	38011aa0-c68a-4bc3-849c-e234dea57669	24	Indigo Blue	indigo_blue	Indigo Blue quartz is a perfect stone for creating subtle and charming spaces. The stone flaunts a soothing interplay of blues, greys, and whites, creating a captivating textured look. Its cool tones blend into an artistic expression of beauty. Create a sensory feast for your eyes using indigo-blue quartz in your interior applications.\r\n\r\n		{Polished}	SlipMatch	{3CM}	{"126 X 63"}	Engineered Quartz	f	t	Turkey	546321	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	HIGH	V1	f	f	f	t	2026-05-20 15:30:18.295	2026-05-20 15:30:18.295	\N
10	17d259f6-6e8a-4d99-bab1-7dc619b694c4	24	Breccia Violetta 3D Jumbo	breccia_violetta_3d_jumbo	Breccia Violetta is an one-of-a-kind, industry-first 3D through body quartz. It flaunts a warm white background adorned with a brecciated veining pattern in contrasting deep blue, purple and golden hues. The medley of colors add a visual depth to the stone. Breccia Violetta comes in Jumbo size, making it suitable for large scale applications. Its classic, marble-like charm lends a refined sense of luxury and opulence to any setting.		{"Polished "," Polished"}	BookMatch	{"2CM "," 3CM "}	{"126 X 63 "," 126 X 63"}	Engineered Quartz	f	f	Italy	478569	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	HIGH	HIGH	V1	f	f	f	t	2026-05-21 14:10:43.219	2026-05-21 14:10:43.219	\N
12	b9a531fa-341b-485d-ab30-f9ac6da73982	24	Chamonix Crystal	chamonix_crystal	Our premium Chamonix Crystal quartz evokes the unmistakable beauty of Macaubas Fantasy quartzite. Its bluish-grey and golden-brown angular veining on the white background mimics the natural patterns of the quartzite, making it a perfect alternative for designing elegant and durable spaces.		{Polished}	BookMatch	{" 3CM"}	{"138 X 79"}	Engineered Quartz	f	t		236541	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	HIGH	V1	f	f	f	t	2026-05-21 14:29:53.861	2026-05-21 14:29:53.861	\N
7	df287f17-c4f0-4271-8f5b-c096a5e8460c	24	Ariston Leather	ariston_leather	Ariston quartz is a beautiful modern style statement. It features a visually captivating surface with soft white and grey variations lending an organic appeal to the stone. The subtle palette of Aristo quartz blends perfectly with traditional and contemporary design schemes. Durable and sophisticated, this textured quartz is an ideal choice for designing stylish and functional interiors.		{Leather}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t	Brazil	123456	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	MEDIUM	V1	f	f	f	t	2026-05-21 14:00:47.167	2026-05-21 14:00:47.167	\N
11	03458ba4-3e93-4a95-9cbf-4cca39eacb35	24	Calacatta Montana	calacatta_montana	Calacatta Montana enchants with marble-like allure, exuding timeless elegance and remarkable resilience. Its white surface is elevated by rustic golden veins, as natural in appearance as fine Italian marble. Subtle tone-on-tone striations in the background add depth and character, making it a coveted choice for those seeking organic charm. Calacatta Montana quartz is the perfect alternative to high-end marble where both aesthetics and functionality are essential.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	f	Turkey	456792	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	MEDIUM	V1	f	f	f	t	2026-05-21 14:13:13.526	2026-05-21 14:13:13.526	\N
8	e58bae8b-ceb8-420b-bafd-983acfad46bc	24	Baccara Rose	baccara_rose	Baccara Rose embodies timeless elegance with its subtle hues and organic look. It showcases intricate details in soft grey, warm white, and golden tones. Its patterns resemble the shapes of rose petals. Artistic and durable, Baccara Rose is a perfect choice for stylish and sustainable residential and commercial spaces.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t	Brazil	456789	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	MEDIUM	V1	f	f	f	t	2026-05-21 14:02:43.633	2026-05-21 14:02:43.633	\N
3	cd5153eb-7353-4895-b818-3698fd8ff6b8	24	Arabesque	arabesque	Arabesque is a beautiful white and grey quartz, valued for its natural texture. Its intricate patterns in soft grey give an enriched look to the stone. This quartz is an ideal choice for kitchens, bathrooms, and living spaces, brightening up their design themes naturally. Moreover, its superior durability can contribute to the durability of your residential and commercial spaces.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t	Brazil	123456	f	t	t	t	t	t	t	t	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	HIGH	V1	f	f	f	t	2026-05-20 14:43:16.808	2026-05-20 14:43:16.808	\N
4	f781bc72-d593-4ebb-906f-04a70b258293	24	Crema Taj	crema_taj	Crema Taj is warm-tone quartz. It flaunts a soft white background mottled with subtle beige-golden veins and flecks, lending a sense of gentle charm to the stone. Crema Taj quartz is valued for its undisputed beauty and durability, making it a perfect choice for both residential and commercial applications. Design elegant flooring, countertops, and wall cladding with the wonderful Crema Taj quartz.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	f	Turkey	987654	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	MEDIUM	V1	f	f	f	t	2026-05-20 14:46:24.055	2026-05-20 14:46:24.055	\N
9	7ed4e135-63e6-4336-83ce-e7265bf9fcf0	24	Belize Gold	belize_gold	Belize Gold Quartz captivates with its uniform appearance and exceptional durability. It flaunts a pristine white background accentuated by taupe veining. The subtle golden hints in the veining give the quartz an elevated look, making it an ideal choice for countertops, backsplashes, flooring, and more.		{Polished}	BookMatch	{3CM}	{"138 x 79"}	Engineered Quartz	f	t	Brazil	124563	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	LOW	V1	f	f	f	t	2026-05-21 14:04:13.863	2026-05-21 14:04:13.863	\N
14	4f6f215f-2b80-48d7-8a47-73d12ce44355	24	Namibian Delight	namibian_delight	Namibian Delight is a beautiful quartz known for its organic appeal and superior durability. Subtle strokes of grey and tone-on-tone white veins on the pristine white background make this quartz more visually captivating, making it a great feature for designing statement countertops, vanities, shower walls, and more. Moreover, its durability contributes to the overall durability of a space.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t		123145	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	LOW	V1	f	f	f	t	2026-05-21 15:00:35.257	2026-05-21 15:00:35.257	\N
13	062ef223-efa5-47f6-957d-de55dd56b785	24	Luccicoso Gold	luccicoso_gold	Defined by a gorgeous white background embellished with subtle, brecciated veins, Luccicoso Gold is a sight to behold. The soft grey veins are outlined with golden streaks, adding a touch of elegance and glamor to the stone. Its somber appearance transforms spaces into cozy and inviting retreats. Its enduring durability makes Luccicoso Gold quartz a perfect material to use in high-traffic areas such as living rooms, kitchens and bathrooms.		{Polished}	SlipMatch	{3CM}	{"138 X 79"}	Engineered Quartz	f	t		456189	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	MEDIUM	MEDIUM	V1	f	f	f	t	2026-05-21 14:58:01.297	2026-05-21 14:58:01.297	\N
15	93d7f238-3933-48f7-9c47-a5dfda0f5d8c	24	Ocean Sand	ocean_sand	Ocean Sand quartz is a perfect choice for designing residential and commercial spaces. It features a sand-hued surface embellished with small quartz crystals and subtle blue veins, adding an elegant touch to the stone’s appearance. Design high-end and luxurious countertops, islands, floors, and other decorative features with our premium Ocean Sand quartz slabs.		{Polished}	SlipMatch	{" 3CM"}	{"138 X 79"}	Engineered Quartz	f	t		741258	f	t	t	t	t	f	f	f	t	t	HIGH	HIGH	HIGH	HIGH	LOW	LOW	HIGH	V1	f	f	f	t	2026-05-21 15:04:30.711	2026-05-21 15:04:30.711	\N
18	d038a134-f8d8-447d-a934-a4fc2f7238d6	42	test3	cattest3	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	{HONED}	Bookmatch	{"6 MM"}	{12X12}	HIGH END	f	t	Angola	12345	f	t	t	t	t	f	f	t	f	t	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V1	f	f	f	t	2026-06-05 13:09:37.824	2026-06-05 13:09:37.824	\N
21	3dab7e63-aaf0-4795-8302-b786f3f5cbd2	42	test5	cattest5	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	{"DUAL FINISH POL/HON"}	Slipmatch	{"3 CM"}	{12x12}	HIGH END SEMI PRECIOUS	f	t	Brazil	666161	f	t	f	f	f	f	f	f	f	f	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V1	f	f	f	t	2026-06-05 13:23:12.219	2026-06-05 13:23:12.219	\N
16	c9402baf-ce76-4549-811e-f4739633dfec	42	test	cattest1	this is short desc	this is long desc	{POLISHED}	Bookmatch	{"2 CM"}	{12x24}	SUPER EXOTIC	f	t	India	12346	t	f	t	f	t	f	f	t	t	t	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V1	f	f	f	t	2026-06-04 13:31:14.517	2026-06-04 13:31:14.517	\N
23	e2152bd9-e21d-4baf-a84b-53535370ce08	42	test7	cattest77	this is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbf	this is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbfthis is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbfthis is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbfthis is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbfthis is small descwfvbqjhfbjqhbfjhqbfbqfjhbqjhfbqjbfjhqbfjqbfjhqbfjhqbfjhqbfjhqbfjhqbfjhqfbjhqbfjqbf	{"DUAL FINISH POLISHED/LEATHER"}	Bookmatch	{"6.35 CM"}	{12x12}	ENGINEERED QUARTZ	f	t	Algeria	12345	t	f	f	t	t	t	f	f	f	f	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V1	f	f	f	t	2026-06-05 17:16:33.492	2026-06-05 17:16:33.492	\N
22	c8832597-9800-40b6-81bb-9975306b7e92	42	test6	cattest6	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	{FLAMMED}	Slipmatch	{"5 CM"}	{12x12}	HIGH END SEMI PRECIOUS	f	t		000000	f	t	f	f	f	f	f	f	f	f	HIGH	LOW	MEDIUM	HIGH	MEDIUM	HIGH	MEDIUM	V1	f	f	f	t	2026-06-05 13:34:02.535	2026-06-05 13:34:02.535	\N
17	80295db3-9b60-476b-95db-03aa09844d5b	42	test2	cattest2	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.this is working testing from the blog login to check 12	{POLISHED}	Bookmatch	{"3 CM"}	{12X34}	ENGINEERED QUARTZ	f	t	Afghanistan	12345	f	t	t	t	t	f	f	t	f	t	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V3	f	f	f	t	2026-06-05 12:35:36.189	2026-06-05 12:35:36.189	t
19	af25227a-aef3-4fcf-93f9-3cfcf8523016	42	test4	cattest4	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.	{LEATHER/HONED}	Slipmatch	{"1.5 CM"}	{12x12}	ENGINEERED PORCELAIN	f	f	India	888181	t	f	f	f	f	f	f	f	f	f	LOW	LOW	LOW	LOW	LOW	LOW	LOW	V3	f	f	f	f	2026-06-05 13:16:11.149	2026-06-05 13:16:11.149	\N
\.


--
-- TOC entry 4068 (class 0 OID 17087)
-- Dependencies: 241
-- Data for Name: sys_lookup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_lookup (id, lookup_code, lookup_name, description, is_active, display_order, created_at, updated_at) FROM stdin;
2	GROUP	Groups	Stone Groups	t	1	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
3	ORIGIN	Origins	Country Of Origin	t	1	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
4	THICKNESS	Thickness	Stone Thickness	t	1	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
5	FINISH	Finish	Stone Finish Types	t	1	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
\.


--
-- TOC entry 4070 (class 0 OID 17105)
-- Dependencies: 243
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
28	2	\N	A FRAMES	\N	10	t	2026-06-04 21:24:19.024993	2026-06-04 21:24:19.024993
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
-- TOC entry 4063 (class 0 OID 16796)
-- Dependencies: 236
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, user_id, email, password_hash, first_name, last_name, is_active, last_login, created_at, updated_at, deleted_at, role_id) FROM stdin;
9	6d015d0d-9c42-44e3-ab96-07a7a3e80d65	blogs@ultrastones.com	$2b$10$WG1J1TxDGBui7HSjXjFCtO1NsBw8iAADmmJpUpMoWl2zQFb6wEwIa	Rusha	Lodh	t	2026-06-06 16:04:04.379	2026-06-04 15:35:03.218	2026-06-04 15:35:03.218	\N	5
2	ae7f1df7-f3c3-47c2-9531-abfcbc1fa7a8	admin@test.com	$2b$10$P37uXvfqj56njNogQmV8kuNEp5u.hJASjvYvPX0.9R9AYsar6EhCi	Admin	User	f	\N	2026-06-02 17:51:29.807	2026-06-02 17:51:29.807	2026-06-02 19:12:32.174	1
1	f8655517-d946-44fc-af01-169d43f3d6a3	webdesign.ultraimpex@gmail.com	$2b$10$MvU5DHOdTRuF6aymuzi0cOczvKXt8cJEiUmveWk7IckAOF.1UmBp.	Khush	Patel	t	2026-06-06 16:04:34.051	2026-06-02 17:17:38.816	2026-06-02 17:30:24.006	\N	1
4	b5c28ab0-cdcf-4831-943e-ec8966f3b22e	design2ultrastones@gmail.com	$2b$10$wxoVgXDSu8Jxj0US64jG2u31oDMtgO03WGkJ34wSYa7f43kFr/ENa	Kapil	Joshi	t	2026-06-03 13:16:48.072	2026-06-02 19:11:59.463	2026-06-02 19:11:59.463	\N	3
5	6b91cdbe-577a-4113-916b-bd1e62d2b74c	deepenultrastones@gmail.com	$2b$10$VrJjZi3wSS4xUvPzMWlnWuvsCJnthJNn4JRECTUGhUKckj.ZkO70G	Deepen	Patel	t	\N	2026-06-03 17:07:52.985	2026-06-03 17:07:52.985	\N	4
6	00ea39bf-4b34-47a3-99bf-02d6cdada916	shivam@ultrastones.com	$2b$10$quFTpeKxwsoC5iq/acn2mejQyBTSQw5VB5f2547dKpGcDkThyXoBa	Shivam	Patel	t	\N	2026-06-04 15:32:49.54	2026-06-04 15:32:49.54	\N	1
8	14ced520-b4bd-4c20-8cf7-4cd07724acc7	piyush.ultrastones@gmail.com	$2b$10$VMrTrjJTnvQZJrskJw2v/uOTSD4FfA0RB5kRthjNdyXS33wBoO.uW	Piyush	Chauhan	t	\N	2026-06-04 15:34:12.667	2026-06-04 15:34:12.667	\N	4
10	418cb70e-2e34-4223-bf44-97cbb8076410	seo@ultrastones.com	$2b$10$clJIOOGFv9Da/gSqwip.NOv7X.aUBNJiLd5w2ni5nrRS3CUsCEbdK	Ramesh	A	t	\N	2026-06-04 15:35:26.603	2026-06-04 15:35:26.603	\N	6
3	243f2904-bc3e-4ce1-b8f1-3f7db9c6986f	design1@ultrastones.com	$2b$10$vFJcK6o199QR.6K8MyStNethaC1wh3lAhadT9pZrlZ/ipDbrm6cdK	Pratik	Bhoi	t	2026-06-05 16:59:25.354	2026-06-02 19:11:24.52	2026-06-02 19:11:24.52	\N	3
11	a0387cfb-e0d9-426f-bd78-07d391286ba5	test@test.com	$2b$10$wBXJGkNGpoJxlXnzeW0Lj.K3F7p6weuCYLBsN22ym2C/mQ4lc4TDO	test	test	t	\N	2026-06-05 17:37:55.792	2026-06-05 17:37:55.792	\N	2
7	3a8862be-0f68-4297-9851-539cf7d2dd34	neel@ultrastones.com	$2b$10$OdycwmqJAZNujRakLZ8zYuapu1PnB.ldUfC1.Agjz01Xf6YDLb2JK	Neel 	Patel	t	2026-06-05 19:20:43.432	2026-06-04 15:33:19.064	2026-06-04 15:33:19.064	\N	2
\.


--
-- TOC entry 4089 (class 0 OID 0)
-- Dependencies: 224
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, false);


--
-- TOC entry 4090 (class 0 OID 0)
-- Dependencies: 226
-- Name: company_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_info_id_seq', 1, true);


--
-- TOC entry 4091 (class 0 OID 0)
-- Dependencies: 238
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 6, true);


--
-- TOC entry 4092 (class 0 OID 0)
-- Dependencies: 227
-- Name: showrooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.showrooms_id_seq', 2, true);


--
-- TOC entry 4093 (class 0 OID 0)
-- Dependencies: 229
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1, false);


--
-- TOC entry 4094 (class 0 OID 0)
-- Dependencies: 231
-- Name: stone_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stone_categories_id_seq', 42, true);


--
-- TOC entry 4095 (class 0 OID 0)
-- Dependencies: 233
-- Name: stone_product_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stone_product_media_id_seq', 145, true);


--
-- TOC entry 4096 (class 0 OID 0)
-- Dependencies: 235
-- Name: stone_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stone_products_id_seq', 23, true);


--
-- TOC entry 4097 (class 0 OID 0)
-- Dependencies: 242
-- Name: sys_lookup_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_lookup_details_id_seq', 135, true);


--
-- TOC entry 4098 (class 0 OID 0)
-- Dependencies: 240
-- Name: sys_lookup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_lookup_id_seq', 5, true);


--
-- TOC entry 4099 (class 0 OID 0)
-- Dependencies: 237
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- TOC entry 3850 (class 2606 OID 16837)
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3859 (class 2606 OID 16855)
-- Name: company_info company_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_info
    ADD CONSTRAINT company_info_pkey PRIMARY KEY (id);


--
-- TOC entry 3885 (class 2606 OID 17064)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 3887 (class 2606 OID 17062)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3846 (class 2606 OID 16903)
-- Name: showrooms showrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showrooms
    ADD CONSTRAINT showrooms_pkey PRIMARY KEY (id);


--
-- TOC entry 3848 (class 2606 OID 16905)
-- Name: showrooms showrooms_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.showrooms
    ADD CONSTRAINT showrooms_slug_key UNIQUE (slug);


--
-- TOC entry 3861 (class 2606 OID 16907)
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3863 (class 2606 OID 16909)
-- Name: site_settings site_settings_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_setting_key_key UNIQUE (setting_key);


--
-- TOC entry 3865 (class 2606 OID 16911)
-- Name: stone_categories stone_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories
    ADD CONSTRAINT stone_categories_name_key UNIQUE (name);


--
-- TOC entry 3867 (class 2606 OID 16913)
-- Name: stone_categories stone_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories
    ADD CONSTRAINT stone_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3869 (class 2606 OID 16915)
-- Name: stone_categories stone_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories
    ADD CONSTRAINT stone_categories_slug_key UNIQUE (slug);


--
-- TOC entry 3871 (class 2606 OID 16923)
-- Name: stone_product_media stone_product_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_media
    ADD CONSTRAINT stone_product_media_pkey PRIMARY KEY (id);


--
-- TOC entry 3873 (class 2606 OID 16925)
-- Name: stone_products stone_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_products
    ADD CONSTRAINT stone_products_pkey PRIMARY KEY (id);


--
-- TOC entry 3875 (class 2606 OID 16927)
-- Name: stone_products stone_products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_products
    ADD CONSTRAINT stone_products_slug_key UNIQUE (slug);


--
-- TOC entry 3894 (class 2606 OID 17119)
-- Name: sys_lookup_details sys_lookup_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup_details
    ADD CONSTRAINT sys_lookup_details_pkey PRIMARY KEY (id);


--
-- TOC entry 3889 (class 2606 OID 17103)
-- Name: sys_lookup sys_lookup_lookup_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup
    ADD CONSTRAINT sys_lookup_lookup_code_key UNIQUE (lookup_code);


--
-- TOC entry 3891 (class 2606 OID 17101)
-- Name: sys_lookup sys_lookup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup
    ADD CONSTRAINT sys_lookup_pkey PRIMARY KEY (id);


--
-- TOC entry 3879 (class 2606 OID 16937)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3881 (class 2606 OID 16939)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3883 (class 2606 OID 16941)
-- Name: users users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_id_key UNIQUE (user_id);


--
-- TOC entry 3851 (class 1259 OID 17082)
-- Name: idx_activity_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_action ON public.activity_logs USING btree (action);


--
-- TOC entry 3852 (class 1259 OID 16942)
-- Name: idx_activity_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_created ON public.activity_logs USING btree (created_at);


--
-- TOC entry 3853 (class 1259 OID 17072)
-- Name: idx_activity_logs_resource; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_logs_resource ON public.activity_logs USING btree (resource_type, resource_id);


--
-- TOC entry 3854 (class 1259 OID 17083)
-- Name: idx_activity_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_module ON public.activity_logs USING btree (module_name);


--
-- TOC entry 3855 (class 1259 OID 17084)
-- Name: idx_activity_request; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_request ON public.activity_logs USING btree (request_id);


--
-- TOC entry 3856 (class 1259 OID 17085)
-- Name: idx_activity_resource_full; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_resource_full ON public.activity_logs USING btree (resource_type, resource_id, created_at DESC);


--
-- TOC entry 3857 (class 1259 OID 16944)
-- Name: idx_activity_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_user ON public.activity_logs USING btree (user_id);


--
-- TOC entry 3892 (class 1259 OID 17125)
-- Name: idx_lookup_details_lookup_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lookup_details_lookup_id ON public.sys_lookup_details USING btree (lookup_id);


--
-- TOC entry 3876 (class 1259 OID 16961)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3877 (class 1259 OID 17070)
-- Name: idx_users_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role_id ON public.users USING btree (role_id);


--
-- TOC entry 3895 (class 2606 OID 16964)
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3899 (class 2606 OID 17065)
-- Name: users fk_users_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 3896 (class 2606 OID 17029)
-- Name: stone_categories stone_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_categories
    ADD CONSTRAINT stone_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.stone_categories(id) ON DELETE SET NULL;


--
-- TOC entry 3897 (class 2606 OID 17034)
-- Name: stone_product_media stone_product_media_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_product_media
    ADD CONSTRAINT stone_product_media_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.stone_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3898 (class 2606 OID 17039)
-- Name: stone_products stone_products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stone_products
    ADD CONSTRAINT stone_products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.stone_categories(id);


--
-- TOC entry 3900 (class 2606 OID 17120)
-- Name: sys_lookup_details sys_lookup_details_lookup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_lookup_details
    ADD CONSTRAINT sys_lookup_details_lookup_id_fkey FOREIGN KEY (lookup_id) REFERENCES public.sys_lookup(id) ON DELETE CASCADE;


-- Completed on 2026-06-06 21:41:37 IST

--
-- PostgreSQL database dump complete
--

\unrestrict N4ovFnSUR8MUwrRslFCDV2NZ2yIlrlmRAPcZaehkKvGQoUNJIRSvtiSldIFo7If


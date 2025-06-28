SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '5e9a92a4-6257-4f63-8331-740063890e01', '{"action":"user_signedup","actor_id":"68a5d57a-a2b8-4461-9a87-293907b90533","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-06-27 23:25:22.916699+00', ''),
	('00000000-0000-0000-0000-000000000000', '234c9afe-5be6-42f2-b3c6-a1d9501ad523', '{"action":"login","actor_id":"68a5d57a-a2b8-4461-9a87-293907b90533","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 23:25:22.919165+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f5716a9-63cc-42e6-bbae-1697116cd44e', '{"action":"user_repeated_signup","actor_id":"68a5d57a-a2b8-4461-9a87-293907b90533","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-27 23:26:34.978851+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc2c2c5e-d10f-4314-9ca9-9070459fc898', '{"action":"user_signedup","actor_id":"5885095f-4903-4ab3-b682-d7ed58cc0af3","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-06-27 23:27:51.113112+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a64ea00f-5f7a-4df8-add4-f3a0dcb66811', '{"action":"login","actor_id":"5885095f-4903-4ab3-b682-d7ed58cc0af3","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 23:27:51.116213+00', ''),
	('00000000-0000-0000-0000-000000000000', '2258e221-1434-4113-876b-23f0687b5990', '{"action":"user_repeated_signup","actor_id":"5885095f-4903-4ab3-b682-d7ed58cc0af3","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-27 23:30:57.825428+00', ''),
	('00000000-0000-0000-0000-000000000000', '6316fffb-1706-4732-8cf7-5c6ab2e2ba02', '{"action":"user_repeated_signup","actor_id":"5885095f-4903-4ab3-b682-d7ed58cc0af3","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-27 23:31:03.093527+00', ''),
	('00000000-0000-0000-0000-000000000000', '43bf39b8-1b25-48c5-9bff-9753d5aac91b', '{"action":"user_signedup","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-06-27 23:31:16.13063+00', ''),
	('00000000-0000-0000-0000-000000000000', '202b86bf-6df8-415e-b3ab-b769a530c0f6', '{"action":"login","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 23:31:16.132268+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a060bb9-fd83-4a7a-a16d-0c19b45629a9', '{"action":"login","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-27 23:31:29.06183+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f59e4c34-1234-4999-9ee0-2fd03a7a5d65', '{"action":"token_refreshed","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"token"}', '2025-06-28 08:18:30.451276+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a04b304-1775-446f-8f80-40b6d27205fe', '{"action":"token_revoked","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"token"}', '2025-06-28 08:18:30.452776+00', ''),
	('00000000-0000-0000-0000-000000000000', '6376b392-aadc-4d74-ba34-9963071efbb3', '{"action":"logout","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account"}', '2025-06-28 09:10:46.22664+00', ''),
	('00000000-0000-0000-0000-000000000000', '4fe91efc-8995-4bdc-bf75-9fcd3e2a9656', '{"action":"login","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-28 09:15:34.756101+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e269090a-ed5e-43f0-81b3-aa157bff7105', '{"action":"logout","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account"}', '2025-06-28 09:20:27.364424+00', ''),
	('00000000-0000-0000-0000-000000000000', '8cf58b4e-935c-4209-9989-a53d41e92872', '{"action":"login","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-28 09:22:34.246137+00', ''),
	('00000000-0000-0000-0000-000000000000', '581dd83f-8573-4a1d-a80b-7af7d401af4f', '{"action":"logout","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account"}', '2025-06-28 09:23:02.010603+00', ''),
	('00000000-0000-0000-0000-000000000000', '563ad06f-b656-4f0f-b328-de776e8e2de6', '{"action":"login","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-28 09:23:05.277899+00', ''),
	('00000000-0000-0000-0000-000000000000', '753c3bba-c2cc-4c55-8ff3-af032e36e868', '{"action":"logout","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account"}', '2025-06-28 09:38:21.038142+00', ''),
	('00000000-0000-0000-0000-000000000000', '30916eb6-e5e2-4a32-b9ba-4704e5e3b374', '{"action":"login","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-28 09:38:24.669204+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd308a8b0-e0d6-4440-9133-c7900e2b0c85', '{"action":"logout","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account"}', '2025-06-28 09:38:27.912667+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd855a1a7-a15c-486b-9bde-17b1c7942164', '{"action":"login","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-28 09:38:31.63275+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5697c42-1e58-425f-828f-8ca45091321a', '{"action":"logout","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account"}', '2025-06-28 09:38:33.804829+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2455752-1122-4177-8820-b3026f5adf09', '{"action":"login","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-28 09:42:26.366594+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfa0de5d-9746-416a-b7d1-0416726f7ab1', '{"action":"logout","actor_id":"9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00","actor_username":"oliver@thenum.dk","actor_via_sso":false,"log_type":"account"}', '2025-06-28 09:42:49.203408+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', 'authenticated', 'authenticated', 'oliver@thenum.dk', '$2a$10$eUeHLklH0ikw5NlmeJAaqujiLwmLGC1KaRcI1SdDE05xIsBjpZeQW', '2025-06-27 23:31:16.130972+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-06-28 09:42:26.367459+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00", "email": "oliver@thenum.dk", "email_verified": false, "phone_verified": false}', NULL, '2025-06-27 23:31:16.125503+00', '2025-06-28 09:42:26.369218+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', '9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', '{"sub": "9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00", "email": "oliver@thenum.dk", "email_verified": false, "phone_verified": false}', 'email', '2025-06-27 23:31:16.128907+00', '2025-06-27 23:31:16.128936+00', '2025-06-27 23:31:16.128936+00', '081cd4fa-303d-4faa-a722-6ec1e982785b');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "firstname", "lastname", "emoji", "is_admin", "created_at", "updated_at") VALUES
	('9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', 'gdfgt', 'gdgdfg', '🍻', false, '2025-06-27 23:31:16.159575+00', '2025-06-27 23:47:46.24937+00');


--
-- Data for Name: points; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."points" ("id", "user_id", "category", "subcategory", "points", "submitted_by", "created_at", "updated_at") VALUES
	('7c7411d7-5c1e-486b-9705-deba8eeea7f1', '9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', 'førertroje', 'wine', 23, '9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', '2025-06-27 23:55:33.635779+00', '2025-06-27 23:55:33.635779+00'),
	('9df542d9-2de5-4d2a-8581-07a7d9b3740c', '9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', 'sprinter', 'beer', 100, '9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', '2025-06-27 23:56:52.481054+00', '2025-06-27 23:56:52.481054+00'),
	('76935edd-ad27-48fb-bb7b-d5c5e3b57cca', '9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', 'førertroje', 'dart', 4, '9ff1c1b4-ca4e-4cdb-9649-6613ed2c0e00', '2025-06-27 23:42:58.383+00', '2025-06-28 00:00:05.797461+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 11, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;

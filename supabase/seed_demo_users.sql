-- Seed Admin and Student demo users directly into Supabase auth.users
-- Password for both: password123
-- Automatically triggers on_auth_user_created to populate public.profiles

insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud
)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'admin@coursue.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Sarah Connor (Admin)","role":"admin"}',
    now(),
    now(),
    'authenticated',
    'authenticated'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'jason.ranti@coursue.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Jason Ranti","role":"student"}',
    now(),
    now(),
    'authenticated',
    'authenticated'
  )
on conflict (id) do update
set
  encrypted_password = crypt('password123', gen_salt('bf')),
  email_confirmed_at = now();

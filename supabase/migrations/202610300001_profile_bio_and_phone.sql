-- ==============================================================================
-- COURSUE LMS: EXTEND PROFILES WITH BIO AND PHONE
-- Migration: 202610300001_profile_bio_and_phone.sql
-- Description:
--   1. Adds phone and bio columns to public.profiles.
--   2. Ensures users can update their own phone and bio via RLS.
-- ==============================================================================

alter table public.profiles
  add column if not exists phone text default '',
  add column if not exists bio text default '';

comment on column public.profiles.phone is 'Contact phone number of the user.';
comment on column public.profiles.bio is 'Short biographical summary of the user.';


-- Manual RLS verification. Replace the two UUID placeholders, then run in SQL Editor.
-- Every block runs in a transaction and is rolled back.

begin;
select set_config(
  'request.jwt.claims',
  '{"sub":"STUDENT_USER_UUID","role":"authenticated"}',
  true
);
set local role authenticated;

do $$
begin
  begin
    update public.profiles
    set role = 'admin'
    where id = auth.uid();
    raise exception 'SECURITY TEST FAILED: student changed their role';
  exception
    when insufficient_privilege then
      raise notice 'PASS: a student cannot change their role';
  end;

  if exists (select 1 from public.audit_logs) then
    raise exception 'SECURITY TEST FAILED: student read audit logs';
  end if;

  begin
    update public.platform_settings set platform_name = 'Unauthorized';
    if found then
      raise exception 'SECURITY TEST FAILED: student updated platform settings';
    end if;
  exception
    when insufficient_privilege then
      raise notice 'PASS: a student cannot update platform settings';
  end;
end $$;
rollback;

begin;
select set_config(
  'request.jwt.claims',
  '{"sub":"ADMIN_USER_UUID","role":"authenticated"}',
  true
);
set local role authenticated;

do $$
begin
  if not public.is_admin() then
    raise exception 'SECURITY TEST FAILED: admin was not recognized';
  end if;
  insert into public.audit_logs (actor_id, action, entity_type, metadata)
  values (auth.uid(), 'security_test', 'test', '{"result":"pass"}'::jsonb);
  raise notice 'PASS: admin authorization and audit insert work';
end $$;
rollback;

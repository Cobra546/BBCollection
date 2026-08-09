-- BB Collection order database
-- Run this in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('BB-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  customer_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  postal_code text,
  payment_method text not null default 'cod' check (payment_method in ('cod','online')),
  items jsonb not null,
  total_amount numeric(12,2) not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
as $$
  select exists(select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

alter table public.orders enable row level security;
alter table public.admin_users enable row level security;

-- Customers can create an order. They cannot read the complete orders table anonymously.
drop policy if exists "public can create orders" on public.orders;
create policy "public can create orders" on public.orders
  for insert to anon, authenticated
  with check (
    char_length(customer_name) between 2 and 100
    and char_length(phone) between 7 and 30
    and char_length(email) between 5 and 200
    and char_length(address) between 5 and 500
    and char_length(city) between 2 and 100
    and jsonb_typeof(items) = 'array'
  );

-- Only users explicitly registered as admins can read/update orders.
drop policy if exists "admins can read orders" on public.orders;
create policy "admins can read orders" on public.orders
  for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "admins can update orders" on public.orders;
create policy "admins can update orders" on public.orders
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Admin membership is never publicly readable/writable.
drop policy if exists "admins can read admin_users" on public.admin_users;
create policy "admins can read admin_users" on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.touch_order_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_order_updated_at();

-- After creating your admin user in Supabase Auth, run:
-- insert into public.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');

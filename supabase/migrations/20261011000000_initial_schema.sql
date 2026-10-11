create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    display_name text not null default 'User'
        check (char_length(btrim(display_name)) between 1 and 100),
    created_at timestamptz not null default now()
);

create table public.customers (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null default auth.uid()
        references auth.users (id) on delete cascade,
    name text not null check (char_length(btrim(name)) between 1 and 150),
    company text not null check (char_length(btrim(company)) between 1 and 150),
    email text not null check (char_length(btrim(email)) between 3 and 254),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (id, owner_id)
);

create table public.employees (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null default auth.uid()
        references auth.users (id) on delete cascade,
    name text not null check (char_length(btrim(name)) between 1 and 150),
    role text not null check (char_length(btrim(role)) between 1 and 150),
    department text not null
        check (char_length(btrim(department)) between 1 and 150),
    status text not null default 'active'
        check (status in ('active', 'inactive', 'in_meeting')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (id, owner_id)
);

create table public.projects (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null default auth.uid()
        references auth.users (id) on delete cascade,
    customer_id uuid,
    name text not null check (char_length(btrim(name)) between 1 and 200),
    status text not null default 'pending'
        check (status in ('pending', 'in_progress', 'completed')),
    progress smallint not null default 0 check (progress between 0 and 100),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (id, owner_id),
    foreign key (customer_id, owner_id)
        references public.customers (id, owner_id)
);

create table public.tasks (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null default auth.uid()
        references auth.users (id) on delete cascade,
    project_id uuid,
    assigned_employee_id uuid,
    name text not null check (char_length(btrim(name)) between 1 and 200),
    is_completed boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    foreign key (project_id, owner_id)
        references public.projects (id, owner_id),
    foreign key (assigned_employee_id, owner_id)
        references public.employees (id, owner_id)
);

create index customers_owner_created_at_idx
    on public.customers (owner_id, created_at desc);
create index employees_owner_created_at_idx
    on public.employees (owner_id, created_at desc);
create index projects_owner_created_at_idx
    on public.projects (owner_id, created_at desc);
create index projects_customer_owner_idx
    on public.projects (customer_id, owner_id);
create index tasks_owner_created_at_idx
    on public.tasks (owner_id, created_at desc);
create index tasks_project_owner_idx
    on public.tasks (project_id, owner_id);
create index tasks_employee_owner_idx
    on public.tasks (assigned_employee_id, owner_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger customers_set_updated_at
    before update on public.customers
    for each row execute function public.set_updated_at();
create trigger employees_set_updated_at
    before update on public.employees
    for each row execute function public.set_updated_at();
create trigger projects_set_updated_at
    before update on public.projects
    for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at
    before update on public.tasks
    for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, display_name)
    values (
        new.id,
        left(
            coalesce(
                nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
                nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
                'User'
            ),
            100
        )
    )
    on conflict (id) do nothing;

    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.employees enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

create policy profiles_select_own
    on public.profiles for select to authenticated
    using (id = (select auth.uid()));
create policy profiles_update_own
    on public.profiles for update to authenticated
    using (id = (select auth.uid()))
    with check (id = (select auth.uid()));

create policy customers_manage_own
    on public.customers for all to authenticated
    using (owner_id = (select auth.uid()))
    with check (owner_id = (select auth.uid()));
create policy employees_manage_own
    on public.employees for all to authenticated
    using (owner_id = (select auth.uid()))
    with check (owner_id = (select auth.uid()));
create policy projects_manage_own
    on public.projects for all to authenticated
    using (owner_id = (select auth.uid()))
    with check (owner_id = (select auth.uid()));
create policy tasks_manage_own
    on public.tasks for all to authenticated
    using (owner_id = (select auth.uid()))
    with check (owner_id = (select auth.uid()));

revoke all on table public.profiles, public.customers, public.employees,
    public.projects, public.tasks from anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.customers,
    public.employees, public.projects, public.tasks to authenticated;

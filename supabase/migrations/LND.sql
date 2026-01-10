-- A. PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role user_role default 'guest',
  
  -- Trainer specific fields
  bio text,
  expertise text[], 
  credentials text[], 
  banner_url text,
  social_links jsonb, 
  stats jsonb, 
  
  -- Employer specific fields
  company_details jsonb, 

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." 
  on public.profiles for select 
  using (true);

create policy "Users can update own profile." 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile." 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- B. COURSES
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  trainer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  course_details text,
  price numeric default 0,
  duration text,
  category text,
  is_public boolean default true,
  thumbnail_url text,
  custom_branding_color text default '#0ea5e9',
  views numeric default 0,
  delivery_type text default 'Remote',
  hrdc_claimable boolean default false,
  level text default 'All Level',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
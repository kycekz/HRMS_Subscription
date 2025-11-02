-- 1️⃣ Table for storing messages
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- 2️⃣ Function to notify the Edge Function (HTTP call)
create or replace function notify_new_message()
returns trigger as $$
begin
  perform
    net.http_post(
      url := 'https://YOUR_PROJECT_ID.functions.supabase.co/send-contact-email',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'message', NEW.message
      )
    );
  return NEW;
end;
$$ language plpgsql security definer;

-- 3️⃣ Trigger that runs after each insert
create trigger contact_message_trigger
after insert on contact_messages
for each row
execute function notify_new_message();

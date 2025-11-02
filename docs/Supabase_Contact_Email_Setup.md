
# 📘 Supabase + Resend Automated Contact Email System

This document explains how to implement an automated contact message system using **Supabase** + **Resend**, with a **database trigger** and **Edge Function**.  
It is designed for developers using **React + Supabase + Vercel**, and can be referenced by your AI coding assistant for accurate context.

---

## 🧱 Overview

**Goal:**  
When a user fills in a contact form and submits, their message will be:

1. Saved to a Supabase table (`contact_messages`)
2. Automatically trigger a backend process (Edge Function)
3. Send an email notification to you (e.g., `abc@gmail.com`)
4. Optionally, send an auto-reply to the sender

---

## 📂 Folder & File Structure

When finished, your project should look like this:

```
project-root/
├─ supabase/
│  ├─ functions/
│  │  └─ send-contact-email/
│  │      └─ index.ts          # Edge Function to send email
│  └─ config.toml
├─ .env.local                  # Environment variables
├─ pages/ or app/              # Your Next.js/React pages
│  └─ contact.tsx              # Your contact form (frontend)
└─ README.md or CONTACT_EMAIL_SETUP.md  # This reference document
```

---

## ⚙️ Step 1 — Create the Database Table & Trigger

Run the following SQL script in your **Supabase SQL Editor**:

```sql
-- 1️⃣ Create the table to store messages
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone_number text,
  job_title text,
  company_name text,
  message text not null,
  created_at timestamp with time zone default now()
);

-- 2️⃣ Create a function to notify the Edge Function (via HTTP POST)
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

-- 3️⃣ Create a trigger that calls the function after each insert
create trigger contact_message_trigger
after insert on contact_messages
for each row
execute function notify_new_message();
```

🧩 Replace `YOUR_PROJECT_ID` with your actual Supabase project reference (e.g., `abcd1234`).  
You can find this in your Supabase project URL: `https://abcd1234.supabase.co`

---

## 🌐 Step 2 — Create and Deploy the Edge Function

### 2.1 Create a new Supabase function

In your **VS Code terminal**, inside your project root folder:

```bash
supabase functions new send-contact-email
```

This will create the folder:
```
supabase/functions/send-contact-email/index.ts
```

---

### 2.2 Edit `index.ts`

Replace all contents with the following code:

```ts
// supabase/functions/send-contact-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { Resend } from "npm:resend"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))
const toEmail = Deno.env.get("TO_EMAIL")

serve(async (req) => {
  try {
    const { name, email, message } = await req.json()

    // Send email to admin (your address)
    await resend.emails.send({
      from: "Website Contact <onboarding@resend.dev>",
      to: toEmail!,
      subject: `📩 New Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr/>
        <small>Sent automatically via Supabase Edge Function</small>
      `,
    })

    // Optional: send auto-reply to sender
    await resend.emails.send({
      from: "AmazingCube HRMS <noreply@resend.dev>",
      to: email,
      subject: "We received your message!",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out. We’ve received your message and will get back to you soon.</p>
        <br/>
        <p>Best regards,<br/>AmazingCube HRMS Team</p>
      `,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 })
  }
})
```

---

### 2.3 Set environment variables

Before deploying, set your secrets inside Supabase:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set TO_EMAIL=abc@gmail.com
```

---

### 2.4 Deploy the function

```bash
supabase functions deploy send-contact-email --project-ref YOUR_PROJECT_ID
```

---

## 🧭 Step 3 — Frontend Contact Form

When the user submits the contact form, just insert a record into Supabase:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const { data, error } = await supabase.from('contact_messages').insert([
    { name, email, message }
  ])

  if (error) alert('Failed to send message')
  else alert('Message submitted successfully!')
}
```

That’s it! You do **not** need to call any email API from frontend.

---

## 🧠 Flow Diagram

```
[ User Contact Form ]
        │
        ▼
Supabase Table: contact_messages
        │
   (AFTER INSERT Trigger)
        │
        ▼
Edge Function: send-contact-email
        │
        ├──> Sends email to admin (abc@gmail.com)
        └──> Sends auto-reply to user
```

---

## 🧩 Notes & Best Practices

- Resend free plan: 3,000 emails/month (perfect for low traffic contact forms)
- You can later verify your own domain in Resend to improve deliverability
- All API keys stay securely in Supabase (no exposure to client)
- Logs of sent emails are viewable in Resend dashboard

---

## ✅ Quick Recap

| Step | Description | Where |
|------|--------------|--------|
| 1 | Create contact table + trigger | Supabase SQL Editor |
| 2 | Create Edge Function | VS Code + Supabase CLI |
| 3 | Set environment secrets | Terminal |
| 4 | Deploy Edge Function | `supabase functions deploy` |
| 5 | Insert new record from contact form | React frontend |

---

## 🔒 Environment Variables Reference

| Variable | Description |
|-----------|--------------|
| `RESEND_API_KEY` | Your Resend account API key |
| `TO_EMAIL` | Destination email (e.g., abc@gmail.com) |

---

## 📬 Test Example

```sql
insert into contact_messages (name, email, message)
values ('John Doe', 'john@example.com', 'Testing Supabase trigger email system.');
```

✅ Expected result:
- Email to `abc@gmail.com`
- Auto-reply to `john@example.com`

---

**Author:** AmazingCube HRMS Project  
**Version:** 1.0  
**Purpose:** Internal developer documentation for Supabase contact email system

import { createClient } from '@supabase/supabase-js'

const supabasewebsite = createClient(
  import.meta.env.VITE_SUPABASE_WEBSITE_URL!,
  import.meta.env.VITE_SUPABASE_WEBSITE_ANON_KEY!
)

export default supabasewebsite

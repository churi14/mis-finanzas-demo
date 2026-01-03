import { createClient } from '@supabase/supabase-js'

// --- DATOS PEGADOS MANUALMENTE (TEMPORAL) ---
const supabaseUrl = "https://tvyvntwuybxmvcqcediu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXZudHd1eWJ4bXZjcWNlZGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzgxNDQsImV4cCI6MjA4MTQxNDE0NH0.t--o2Vs9NWBip3rwje9YDKuT3cP8Xs613U90aAgar38"

export const supabase = createClient(supabaseUrl, supabaseKey)
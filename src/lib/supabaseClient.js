import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://kqxvsqijncznqwmffevd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxeHZzcWlqbmN6bnF3bWZmZXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc5MDE3NDQsImV4cCI6MjAxMzQ3Nzc0NH0.wrGcEJ20jJQOtssRm73CuNPWhAsx11j63XNxtvO3D1E')
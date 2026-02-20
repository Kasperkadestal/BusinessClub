import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yhdhgfpvcijibpmldeam.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZGhnZnB2Y2lqaWJwbWxkZWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mzg2OTIsImV4cCI6MjA2NDAxNDY5Mn0.uWoFmILAYISRTFU8kn3OffCAD-6rwHLsTYB_TodT99g"

export const supabase = createClient(supabaseUrl, supabaseKey)
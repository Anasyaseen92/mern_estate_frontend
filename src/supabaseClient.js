import { createClient } from "@supabase/supabase-js";

// Use environment variables for security
const supabaseUrl = "https://zbnhagjhldkpzsycgwhp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibmhhZ2pobGRrcHpzeWNnd2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDA1MzAsImV4cCI6MjA2NDE3NjUzMH0.WFPAumkbIr5reRartzM4PnYrLEgzsfdaey4rbMKjN9c";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const printSupabase = () => {
  console.log(supabase);
};

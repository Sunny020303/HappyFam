import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kjaxnzwdduwomszumzbf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYXhuendkZHV3b21zenVtemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzNjY2NTgsImV4cCI6MjAyODk0MjY1OH0.FpEtVTIu7KnUUhGFfbnAk6ACmWgCgP6ERnOxSwCp9f0";

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

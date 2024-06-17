// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'curl';
const supabaseKey = 'key';
export const supabase = createClient(supabaseUrl, supabaseKey);

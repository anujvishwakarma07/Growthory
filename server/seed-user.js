import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Creating user...");
    const { data: user, error } = await supabase.auth.admin.createUser({
        email: 'founder@growthory.ai',
        password: 'password123',
        email_confirm: true,
        user_metadata: {
            full_name: 'Startup Founder',
            role: 'founder'
        }
    });

    if (error) {
        console.error("Error creating user:", error.message);
        return;
    }

    console.log("User created successfully:", user.user.email);
    console.log("You can log in with email: founder@growthory.ai and password: password123");
}

main();

    // src/app/api/log-skip/route.ts
    import { createClient } from '@supabase/supabase-js';
    import { NextResponse } from 'next/server';

    // Ensure these environment variables are set in your .env.local file
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!; // Use the service_role key for server-side operations
    const supabase = createClient(supabaseUrl, supabaseKey);

    export async function POST(request: Request) {
      try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Validate userId if necessary (e.g., ensure it's "1" or "2")
        if (userId !== "1" && userId !== "2") {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }

        const { data, error } = await supabase
          .from('skips')
          .insert([{ user_id: userId }])
          .select(); // .select() will return the inserted rows

        if (error) {
          console.error('Supabase error logging skip:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Skip logged successfully', data }, { status: 201 });
      } catch (e: any) {
        console.error('API error logging skip:', e);
        return NextResponse.json({ error: e.message || 'An unexpected error occurred' }, { status: 500 });
      }
    }
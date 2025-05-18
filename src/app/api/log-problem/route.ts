    // src/app/api/log-problem/route.ts
    import { createClient } from '@supabase/supabase-js';
    import { NextResponse } from 'next/server';

    // Initialize Supabase client
    // Ensure these environment variables are set in your .env.local file
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    export async function POST(request: Request) {
      try {
        const body = await request.json();
        const { userId, problemName, problemLink, difficulty } = body;

        // Basic validation (you can add more robust validation here)
        if (!userId || !problemName || !problemLink || !difficulty) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
          .from('problems')
          .insert([
            { 
              user_id: userId, 
              problem_name: problemName, 
              problem_link: problemLink, 
              difficulty: difficulty 
            },
          ])
          .select(); // .select() will return the inserted rows

        if (error) {
          console.error('Supabase error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Problem logged successfully', data }, { status: 201 });
      } catch (e: any) {
        console.error('API error:', e);
        return NextResponse.json({ error: e.message || 'An unexpected error occurred' }, { status: 500 });
      }
    }
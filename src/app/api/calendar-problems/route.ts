// src/app/api/calendar-problems/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { data: problemsData, error } = await supabase
      .from('problems')
      .select(`
        id, 
        problem_name, 
        problem_link,
        difficulty, 
        created_at, 
        user_id
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error fetching calendar problems:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedProblems = problemsData.map(problem => ({
      id: problem.id.toString(),
      title: problem.problem_name,
      problemLink: problem.problem_link,
      difficulty: problem.difficulty as 'easy' | 'medium' | 'hard', // Type assertion
      date: problem.created_at, // ISO string, will be converted to Date on client
      userId: problem.user_id,
    }));

    return NextResponse.json(formattedProblems, { status: 200 });

  } catch (e: any) {
    console.error('API /api/calendar-problems error:', e);
    return NextResponse.json({ error: e.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
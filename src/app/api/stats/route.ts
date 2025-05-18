// src/app/api/stats/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const usersMeta = [
  { id: "1", name: "Noah" },
  { id: "2", name: "Justin" },
];

// Helper function to get the current date string (YYYY-MM-DD) in 'America/Los_Angeles'
function getCurrentDateInPST(): string {
  const now = new Date();
  // Using en-CA locale with appropriate options gives YYYY-MM-DD format.
  // This is a common trick for a reliable YYYY-MM-DD string for a specific timezone.
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now);
}

// Helper function to get a YYYY-MM-DD string from a Date object for 'America/Los_Angeles'
function formatDateToPSTString(date: Date): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Los_Angeles', // Ensure this is consistently used if date isn't already 'local' to PST
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return formatter.format(date);
}


async function calculateCurrentStreak(userId: string): Promise<number> {
  // This RPC call should now return distinct dates based on 'America/Los_Angeles' timezone
  // due to the modified SQL function `get_distinct_problem_dates_for_user`
  const { data: problemDaysData, error: rpcError } = await supabase
    .rpc('get_distinct_problem_dates_for_user', { p_user_id: userId });

  if (rpcError) {
    console.error(`RPC error fetching problem dates for user ${userId} (PST):`, rpcError);
    return 0;
  }
  if (!problemDaysData || problemDaysData.length === 0) {
    return 0;
  }

  // These dates are already YYYY-MM-DD strings representing PST dates from the SQL function
  const uniqueProblemDaysPST = problemDaysData.map((p: { problem_date: string }) => p.problem_date);
  // console.log('User:', userId, 'Distinct PST Problem Dates:', uniqueProblemDaysPST);


  const todayPSTString = getCurrentDateInPST();
  let streak = 0;
  let lastStreakDatePSTString = '';

  if (uniqueProblemDaysPST[0] === todayPSTString) {
    streak = 1;
    lastStreakDatePSTString = uniqueProblemDaysPST[0];
  } else {
    // Calculate yesterday in PST
    // Get "today" in PST as a Date object to correctly subtract a day
    const nowInPST = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    const yesterdayPSTDate = new Date(nowInPST);
    yesterdayPSTDate.setDate(nowInPST.getDate() - 1);
    const yesterdayPSTString = formatDateToPSTString(yesterdayPSTDate);

    if (uniqueProblemDaysPST[0] === yesterdayPSTString) {
      streak = 1;
      lastStreakDatePSTString = uniqueProblemDaysPST[0];
    } else {
      return 0; // Not today or yesterday in PST
    }
  }

  // Continue checking for consecutive previous days
  for (let i = 1; i < uniqueProblemDaysPST.length; i++) {
    // lastStreakDatePSTString is like "2023-05-18"
    // To reliably get the previous day, parse it considering it's a PST date,
    // then subtract a day.
    const parts = lastStreakDatePSTString.split('-').map(s => parseInt(s, 10));
    // Create date as UTC but with PST year/month/day numbers, then convert to PST string.
    // Or, simpler: construct a Date object. JavaScript Date constructor (new Date(year, monthIndex, day))
    // treats arguments as local time. Since our server might not be PST, this can be tricky.
    // A more robust way for date arithmetic is to work with UTC dates or a good date library.
    // However, since `lastStreakDatePSTString` *is* a PST date string, we can parse it as such.
    
    // Let's parse the YYYY-MM-DD (PST) string into a Date object.
    // When new Date('YYYY-MM-DD') is called, it's parsed as UTC midnight.
    // To treat it as a PST date for arithmetic, then convert back to string:
    const lastDateParts = lastStreakDatePSTString.split('-').map(Number);
    // Create a date object. If we construct it with new Date(Y, M, D), it's in the system's local time.
    // To make it represent the start of that day in PST for calculation:
    let lastDateAsPSTDay = new Date(lastDateParts[0], lastDateParts[1] - 1, lastDateParts[2], 12, 0, 0); // Noon PST to avoid DST issues at midnight

    let expectedPreviousDay = new Date(lastDateAsPSTDay);
    expectedPreviousDay.setDate(lastDateAsPSTDay.getDate() - 1);
    const expectedPreviousDayPSTString = formatDateToPSTString(expectedPreviousDay);
    

    if (uniqueProblemDaysPST[i] === expectedPreviousDayPSTString) {
      streak++;
      lastStreakDatePSTString = uniqueProblemDaysPST[i];
    } else {
      break; // Streak broken
    }
  }
  return streak;
}

export async function GET(request: Request) {
  try {
    const playerStatsPromises = usersMeta.map(async (user) => {
      // 1. Get completed problems count
      const { count: completed, error: completedError } = await supabase
        .from('problems')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (completedError) {
        // Not throwing here, just logging and continuing, so one user's error doesn't break all stats
        console.error(`Error fetching completed count for user ${user.id}:`, completedError);
        // return a partial or error object if needed, or default values
      }

      // 2. Get skips used count
      const { count: skipped, error: skippedError } = await supabase
        .from('skips')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (skippedError) {
        console.error(`Error fetching skipped count for user ${user.id}:`, skippedError);
      }

      // 3. Get last problem name
      const { data: lastProblemData, error: lastProblemError } = await supabase
        .from('problems')
        .select('problem_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // This still orders by actual timestamp
        .limit(1);

      if (lastProblemError) {
        console.error(`Error fetching last problem for user ${user.id}:`, lastProblemError);
      }
      const lastProblemName = lastProblemData && lastProblemData.length > 0 ? lastProblemData[0].problem_name : null;
      
      // 4. Calculate current streak based on PST dates
      const currentStreak = await calculateCurrentStreak(user.id);

      // 5. Determine if a problem was completed today (PST)
      let completedTodayLocal = false;
      // This RPC call returns distinct dates based on 'America/Los_Angeles'
      const { data: problemDaysDataForTodayCheck, error: rpcErrorTodayCheck } = await supabase
        .rpc('get_distinct_problem_dates_for_user', { p_user_id: user.id });
      
      if (!rpcErrorTodayCheck && problemDaysDataForTodayCheck && problemDaysDataForTodayCheck.length > 0) {
        const todayPSTString = getCurrentDateInPST();
        // problem_date from RPC is already a PST date string 'YYYY-MM-DD'
        if (problemDaysDataForTodayCheck[0].problem_date === todayPSTString) {
          completedTodayLocal = true;
        }
      }

      return {
        id: user.id,
        name: user.name,
        completed: completed ?? 0,
        skipped: skipped ?? 0,
        lastProblem: lastProblemName,
        currentStreak: currentStreak,
        completedTodayLocal: completedTodayLocal,
      };
    });

    const resolvedPlayerStats = await Promise.all(playerStatsPromises);

    const responseData = {
        users: resolvedPlayerStats,
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) // General catch for unexpected issues in GET
  {
    console.error('API /api/stats error:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    return NextResponse.json({ error: 'Failed to fetch stats', details: error.message }, { status: 500 });
  }
}
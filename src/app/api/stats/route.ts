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

    async function calculateCurrentStreak(userId: string): Promise<number> {
      const { data: problemDaysData, error: rpcError } = await supabase
        .rpc('get_distinct_problem_dates_for_user', { p_user_id: userId });

      if (rpcError) {
        console.error(`RPC error fetching problem dates for user ${userId}:`, rpcError);
        return 0; // Or throw error to be caught by the main try-catch
      }
      if (!problemDaysData || problemDaysData.length === 0) {
        return 0;
      }

      const uniqueProblemDays = problemDaysData.map((p: { problem_date: string }) => p.problem_date); // these are YYYY-MM-DD strings (UTC date)
      
      const todayUTC = new Date().toISOString().split('T')[0];
      let streak = 0;

      if (uniqueProblemDays[0] === todayUTC) {
        streak = 1;
      } else {
        const yesterdayUTC = new Date();
        yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1);
        if (uniqueProblemDays[0] === yesterdayUTC.toISOString().split('T')[0]) {
          streak = 1;
        } else {
          // If the last problem wasn't today or yesterday (UTC), current streak is 0
          return 0;
        }
      }

      // Continue checking for consecutive previous days
      let lastStreakDateUTC = uniqueProblemDays[0]; // This is a YYYY-MM-DD string

      for (let i = 1; i < uniqueProblemDays.length; i++) {
        // Create a Date object from the YYYY-MM-DD string, explicitly treating it as UTC
        const lastDate = new Date(lastStreakDateUTC + 'T00:00:00Z');
        
        const expectedPreviousDate = new Date(lastDate);
        expectedPreviousDate.setUTCDate(lastDate.getUTCDate() - 1);
        
        if (uniqueProblemDays[i] === expectedPreviousDate.toISOString().split('T')[0]) {
          streak++;
          lastStreakDateUTC = uniqueProblemDays[i];
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
            console.error(`Error fetching completed count for user ${user.id}:`, completedError);
            throw completedError;
          }

          // 2. Get skips used count
          const { count: skipped, error: skippedError } = await supabase
            .from('skips')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          if (skippedError) {
            console.error(`Error fetching skipped count for user ${user.id}:`, skippedError);
            throw skippedError;
          }

          // 3. Get last problem name
          const { data: lastProblemData, error: lastProblemError } = await supabase
            .from('problems')
            .select('problem_name')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (lastProblemError) {
            console.error(`Error fetching last problem for user ${user.id}:`, lastProblemError);
            throw lastProblemError;
          }
          const lastProblem = lastProblemData && lastProblemData.length > 0 ? lastProblemData[0].problem_name : null;

          // 4. Calculate current streak
          const currentStreak = await calculateCurrentStreak(user.id);

          return {
            id: user.id,
            name: user.name,
            completed: completed ?? 0,
            skipped: skipped ?? 0,
            lastProblem: lastProblem,
            currentStreak: currentStreak,
          };
        });

        const resolvedPlayerStats = await Promise.all(playerStatsPromises);

        const responseData = {
            users: resolvedPlayerStats,
        };

        return NextResponse.json(responseData, { status: 200 });

      } catch (error: any) {
        console.error('API /api/stats error:', error.message, error.details, error.hint);
        return NextResponse.json({ error: 'Failed to fetch stats', details: error.message }, { status: 500 });
      }
    }
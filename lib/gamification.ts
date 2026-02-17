
import { prisma } from "@/lib/prisma";

const LEVEL_THRESHOLD = 100; // XP needed per level (simple linear for now)

export async function updateUserProgress(userId: string, xpGained: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true, streak: true, lastActive: true }
    });

    if (!user) return null;

    const now = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;

    let newStreak = user.streak;

    if (lastActive) {
        const todayStr = now.toDateString();
        const lastActiveStr = lastActive.toDateString();

        // Check if yesterday
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastActiveStr === todayStr) {
            // Already active today, keep streak
        } else if (lastActiveStr === yesterdayStr) {
            // Was active yesterday, increment streak
            newStreak += 1;
        } else {
            // Missed a day or more, reset streak
            newStreak = 1;
        }
    } else {
        // First time
        newStreak = 1;
    }

    // Calculate Level
    const newXp = (user.xp || 0) + xpGained;
    const newLevel = Math.floor(newXp / LEVEL_THRESHOLD) + 1; // Level 1 starts at 0 XP

    // Update User
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            xp: newXp, // Use set just to be sure, or just value
            level: newLevel,
            streak: newStreak,
            lastActive: new Date(), // Set to now
        }
    });

    return {
        currentXp: updatedUser.xp,
        currentLevel: updatedUser.level,
        currentStreak: updatedUser.streak,
        xpGained,
        leveledUp: newLevel > (user.level || 0)
    };
}

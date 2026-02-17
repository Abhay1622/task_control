"use strict";
"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';

export default function SkillsChart({ data }: { data: { name: string, score: number, fullParams: number }[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Not enough data to generate skill chart. Take some quizzes!</p>
            </div>
        );
    }

    return (
        <div className="w-full h-80">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Skill Proficiency</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar name="Proficiency" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

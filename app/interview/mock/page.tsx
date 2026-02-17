"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function MockInterviewPage() {
    const router = useRouter();

    // State
    const [step, setStep] = useState(1); // 1=Setup, 2=Interview, 3=Review
    const [topic, setTopic] = useState("JavaScript");
    const [role, setRole] = useState("Frontend Developer");

    const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");

    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<any>(null);

    // Initialize Speech APIs
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Speech Recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const transcriptText = event.results[current][0].transcript;
                    setTranscript(transcriptText);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                    // Auto-submit after silence? Ideally user clicks 'Stop' or 'Send'
                };
            }

            // Speech Synthesis
            synthesisRef.current = window.speechSynthesis;
        }
    }, []);

    const speak = (text: string) => {
        if (synthesisRef.current) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            synthesisRef.current.speak(utterance);
        }
    };

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setTranscript("");
            recognitionRef.current.start();
        } else {
            alert("Speech recognition not supported in this browser.");
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleSend = async () => {
        if (!transcript.trim()) return;

        // Add user message
        const newHistory = [...messages, { role: 'user' as const, content: transcript }];
        setMessages(newHistory);
        setTranscript("");

        // Call API
        try {
            const res = await fetch('/api/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: transcript,
                    history: messages.slice(-10), // Send last 10 messages for context
                    config: { topic, jobRole: role }
                })
            });

            const data = await res.json();

            if (data.response) {
                setMessages([...newHistory, { role: 'ai', content: data.response }]);
                speak(data.response);
            }

            if (data.isFinished) {
                setStep(3); // Go to review
            }

        } catch (err) {
            console.error("Failed to chat:", err);
        }
    };

    // Start Interview Logic
    const startInterview = async () => {
        setStep(2);
        // Initial prompt
        const initialMsg = `Welcome to your ${role} interview focused on ${topic}. Let's begin.`;
        setMessages([{ role: 'ai', content: initialMsg }]);
        speak(initialMsg);

        // Trigger first actual question from AI immediately after welcome?
        // Or wait for user to say "Ready"?
        // Let's have AI ask first question right away.

        try {
            const res = await fetch('/api/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "Start the interview.",
                    history: [], // Empty history
                    config: { topic, jobRole: role }
                })
            });

            const data = await res.json();
            if (data.response) {
                // Append to welcome message or replace it?
                // Let's just append
                const msg = data.response;
                setMessages(prev => [...prev, { role: 'ai', content: msg }]);
                speak(msg);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Render Steps
    if (step === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 font-sans text-white">
                <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-3xl">🎙️</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Voice Interview</h1>
                        <p className="text-gray-400">Configure your session settings</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Interviewer Persona / Role</label>
                            <input
                                type="text"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
                                placeholder="e.g. Senior React Developer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Focus Topic</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
                                placeholder="e.g. React Hooks & Performance"
                            />
                        </div>

                        <button
                            onClick={startInterview}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
                        >
                            Start Conversation
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{role} Interview</h2>
                    <button onClick={() => setStep(3)} className="text-sm text-red-400 hover:text-red-300">End Interview</button>
                </div>

                {/* AI Avatar / Visualizer */}
                <div className="flex-1 flex flex-col items-center justify-center mb-8 relative">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'bg-blue-500 scale-110 shadow-[0_0_40px_rgba(59,130,246,0.5)]' : 'bg-gray-700'}`}>
                        <span className="text-4xl">🤖</span>
                    </div>
                    {isSpeaking && <p className="mt-4 text-blue-300 animate-pulse">AI is speaking...</p>}
                </div>

                {/* Chat / Transcript Area */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-4 max-h-60">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-6 rounded-t-3xl shadow-lg border-t border-gray-700">
                    <div className="mb-4 text-center">
                        <p className="text-gray-400 text-lg min-h-[1.5rem] italic">"{transcript || (isListening ? "Listening..." : "Tap mic to speak...")}"</p>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {isListening ? '🛑' : '🎤'}
                        </button>

                        {transcript && !isListening && (
                            <button
                                onClick={handleSend}
                                className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
                            >
                                Send Answer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="text-center max-w-lg w-full bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-700">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Interview Complete!</h2>
                <p className="mb-8 text-gray-400 text-lg">Great job practicing. You can check your dashboard for detailed analytics and feedback soon.</p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-gray-700 text-white py-4 rounded-xl font-semibold hover:bg-gray-600 transition border border-gray-600 hover:border-gray-500"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}

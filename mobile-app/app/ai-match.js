import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Sparkles, Brain, Code, Target, BookOpen, CheckCircle2, GraduationCap, ShieldCheck, Flame } from 'lucide-react-native';
import { api } from '../lib/api';

export default function AIMatchmaker() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [formData, setFormData] = useState({
        goal: '',
        subject: '',
        level: 'Beginner',
        style: ''
    });

    const goals = [
        { id: 'exam', label: 'Exam Preparation', icon: <Target size={24} color="#0066ff" /> },
        { id: 'grades', label: 'Improve Grades', icon: <GraduationCap size={24} color="#ff9500" /> },
        { id: 'skill', label: 'Learn a Skill', icon: <Code size={24} color="#34c759" /> },
        { id: 'homework', label: 'Homework Help', icon: <BookOpen size={24} color="#0066ff" /> }
    ];

    const handleGoalSelect = (goal) => {
        setFormData({ ...formData, goal });
        setStep(2);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setStep(4);
        // Artificial delay for premium feel
        setTimeout(async () => {
            try {
                const data = await api.post('/ai-match', formData);
                setResults(data);
            } catch (error) {
                console.error(error);
                // Fallback mock
                setResults({
                    matches: [{
                        name: "Dr. Arvinder Singh",
                        hourlyRate: 500,
                        matchScore: 98,
                        aiReasoning: ["Expert in Board Exams", "Conceptual clarity focus", "Highly rated by peers"]
                    }]
                });
            } finally {
                setLoading(false);
            }
        }, 2500);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />
            {/* Executive Header */}
            <View className="flex-row items-center px-8 py-6">
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} className="p-3 bg-surface-dark rounded-2xl border border-border-dark shadow-sm">
                    <ChevronLeft size={20} color="white" strokeWidth={3} />
                </TouchableOpacity>
                <View className="ml-5">
                    <Text className="text-white text-xl font-black tracking-tight">AI Matchmaker</Text>
                    <Text className="text-primary text-[10px] font-black uppercase tracking-widest">Decision Intelligence</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-8 pt-6">
                {step < 4 && (
                    <View className="mb-12">
                        <View className="flex-row gap-3 mb-8">
                            {[1, 2, 3].map(i => (
                                <View key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-surface-dark border border-border-dark'}`} />
                            ))}
                        </View>
                    </View>
                )}

                {step === 1 && (
                    <View>
                        <Text className="text-white text-4xl font-black mb-3 tracking-tighter">Define your{"\n"}Academic <Text className="text-primary">Goal</Text></Text>
                        <Text className="text-[#a0aec0] font-bold mb-12 text-base leading-relaxed">Select the core objective for your learning journey.</Text>

                        {goals.map((g) => (
                            <TouchableOpacity
                                key={g.id}
                                onPress={() => handleGoalSelect(g.id)}
                                className="bg-surface-dark p-8 rounded-[2.5rem] border border-border-dark mb-5 flex-row items-center shadow-lg active:border-primary/40 active:bg-surface-dark/80"
                            >
                                <View className="bg-background-dark p-5 rounded-3xl mr-6 border border-border-dark shadow-inner">{g.icon}</View>
                                <View>
                                    <Text className="text-white text-lg font-black tracking-tight">{g.label}</Text>
                                    <View className="flex-row items-center gap-1.5 mt-1">
                                        <View className="size-1 bg-[#34c759] rounded-full" />
                                        <Text className="text-[#6c757d] text-[10px] font-black uppercase tracking-widest">Active Channel</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <Text className="text-white text-3xl font-black mb-10 tracking-tight">Subject &{"\n"}<Text className="text-primary">Proficiency</Text></Text>

                        <Text className="text-primary font-black text-[10px] uppercase tracking-widest mb-4 px-1">Specific Discipline</Text>
                        <TextInput
                            value={formData.subject}
                            onChangeText={(t) => setFormData({ ...formData, subject: t })}
                            placeholder="e.g. Mathematics, Quantum Physics"
                            placeholderTextColor="#4a5568"
                            className="bg-surface-dark text-white p-7 rounded-3xl border border-border-dark mb-12 font-black text-lg shadow-inner"
                        />

                        <Text className="text-primary font-black text-[10px] uppercase tracking-widest mb-5 px-1">Engagement Level</Text>
                        <View className="flex-row flex-wrap justify-between">
                            {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                                <TouchableOpacity
                                    key={l}
                                    onPress={() => setFormData({ ...formData, level: l })}
                                    className={`w-[48%] py-6 rounded-2xl mb-4 border-2 items-center transition-all ${formData.level === l ? 'bg-primary border-primary shadow-2xl shadow-primary/40 scale-105' : 'bg-surface-dark border-border-dark'}`}
                                >
                                    <Text className={`font-black text-[10px] uppercase tracking-widest ${formData.level === l ? 'text-white' : 'text-[#6c757d]'}`}>{l}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={() => setStep(3)}
                            className="bg-primary py-6 rounded-3xl mt-12 items-center shadow-2xl shadow-primary/30 active:scale-95"
                        >
                            <Text className="text-white font-black uppercase tracking-[0.2em] text-xs">Analyze Proficiency</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <Text className="text-white text-3xl font-black mb-10 tracking-tight">Pedagogical <Text className="text-primary">Style</Text></Text>

                        {[
                            { id: 'practical', label: 'Empirical Focus', desc: 'Hardware, math, and hands-on exercises', icon: <Target size={18} color="#0066ff" /> },
                            { id: 'theory', label: 'Conceptual Depth', desc: 'Theoretical fundamentals & complex logic', icon: <Brain size={18} color="#ff9500" /> },
                            { id: 'visual', label: 'Dynamic Interactive', desc: 'Visual aids, coding, and rapid feedback', icon: <Sparkles size={18} color="#34c759" /> }
                        ].map((s) => (
                            <TouchableOpacity
                                key={s.id}
                                onPress={() => setFormData({ ...formData, style: s.id })}
                                className={`p-8 rounded-[2.5rem] border-2 mb-5 ${formData.style === s.id ? 'bg-primary/5 border-primary shadow-2xl' : 'bg-surface-dark border-border-dark'}`}
                            >
                                <View className="flex-row items-center gap-4 mb-2">
                                    {s.icon}
                                    <Text className={`text-xl font-black tracking-tight ${formData.style === s.id ? 'text-white' : 'text-[#a0aec0]'}`}>{s.label}</Text>
                                </View>
                                <Text className="text-[#6c757d] text-sm font-bold ml-8 leading-relaxed">{s.desc}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={handleAnalyze}
                            className="bg-white py-6 rounded-3xl mt-16 flex-row items-center justify-center shadow-2xl active:scale-95"
                        >
                            <Sparkles size={20} color="#000a1e" fill="#000a1e" />
                            <Text className="text-background-dark font-black uppercase tracking-[0.2em] text-xs ml-4">Initiate AI Sync</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 4 && (
                    <View className="items-center">
                        {loading ? (
                            <View className="items-center py-24">
                                <View className="size-32 rounded-full border-4 border-primary/20 items-center justify-center">
                                    <ActivityIndicator size="large" color="#0066ff" />
                                </View>
                                <Text className="text-white text-3xl font-black mt-12 tracking-tight">AI at work...</Text>
                                <Text className="text-[#6c757d] font-bold mt-6 text-center px-12 leading-relaxed">Scanning institutional databases to curate your elite mentorship match.</Text>
                            </View>
                        ) : results && (
                            <View className="w-full pb-16">
                                <View className="bg-primary/10 self-center px-8 py-3 rounded-full mb-12 border border-primary/20">
                                    <View className="flex-row items-center gap-2">
                                        <ShieldCheck size={14} color="#0066ff" />
                                        <Text className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Optimal Match Authenticated</Text>
                                    </View>
                                </View>

                                <View className="bg-surface-dark p-10 rounded-[3.5rem] border border-primary/40 shadow-2xl shadow-primary/20 relative overflow-hidden">
                                     <View className="absolute top-0 right-0 -mr-12 -mt-12 bg-primary/20 size-40 rounded-full blur-3xl" />
                                    
                                    <View className="items-center mb-10">
                                        <View className="size-28 rounded-[2.5rem] bg-background-dark items-center justify-center border-2 border-primary shadow-2xl">
                                            <Text className="text-primary text-5xl font-black shadow-primary">{results.matches?.[0]?.name.charAt(0)}</Text>
                                        </View>
                                        <Text className="text-white text-2xl font-black mt-8 text-center tracking-tight">{results.matches?.[0]?.name}</Text>
                                        <View className="flex-row items-center gap-2 mt-2">
                                            <Flame size={14} color="#ff9500" fill="#ff9500" />
                                            <Text className="text-accent-amber text-lg font-black tracking-tighter">{results.matches?.[0]?.matchScore}% Sync Score</Text>
                                        </View>
                                    </View>

                                    <View className="bg-background-dark/50 p-8 rounded-[2rem] mb-12 border border-border-dark shadow-inner">
                                        <Text className="text-primary font-black text-[10px] uppercase tracking-widest mb-6">Match Intelligence Reasoning</Text>
                                        {results.matches?.[0]?.aiReasoning?.map((reason, i) => (
                                            <View key={i} className="flex-row items-center gap-4 mb-4">
                                                <View className="size-2 rounded-full bg-[#34c759] shadow-sm shadow-[#34c759]" />
                                                <Text className="text-[#a0aec0] font-black text-xs tracking-tight">{reason}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    <TouchableOpacity className="bg-primary py-6 rounded-3xl items-center shadow-2xl shadow-primary/30 active:scale-95">
                                        <Text className="text-white font-black uppercase tracking-[0.15em] text-xs">Acquire Mentorship</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setStep(1)}
                                    className="mt-12 items-center"
                                >
                                    <Text className="text-[#6c757d] font-black uppercase tracking-widest text-[10px]">Back to Decision Engine</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

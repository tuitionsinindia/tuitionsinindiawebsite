import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Sparkles, Brain, Code, Target, BookOpen, CheckCircle2, GraduationCap } from 'lucide-react-native';
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
        { id: 'exam', label: 'Exam Preparation', icon: <Target size={20} color="#1e448a" /> },
        { id: 'grades', label: 'Improve Grades', icon: <GraduationCap size={20} color="#1e448a" /> },
        { id: 'skill', label: 'Learn a Skill', icon: <Code size={20} color="#1e448a" /> },
        { id: 'homework', label: 'Homework Help', icon: <BookOpen size={20} color="#1e448a" /> }
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
        }, 2000);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4">
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#1e448a" />
                </TouchableOpacity>
                <Text className="text-slate-900 text-xl font-bold ml-2">AI Matchmaker</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {step < 4 && (
                    <View className="mb-8">
                        <View className="flex-row gap-2 mb-8">
                            {[1, 2, 3].map(i => (
                                <View key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-slate-100'}`} />
                            ))}
                        </View>
                    </View>
                )}

                {step === 1 && (
                    <View>
                        <Text className="text-slate-900 text-3xl font-bold mb-3 tracking-tight">Tell us your goal</Text>
                        <Text className="text-slate-400 font-medium mb-10 text-lg">We'll find the best mentor for your needs.</Text>

                        {goals.map((g) => (
                            <TouchableOpacity
                                key={g.id}
                                onPress={() => handleGoalSelect(g.id)}
                                className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-4 flex-row items-center"
                            >
                                <View className="bg-white p-4 rounded-2xl mr-5 shadow-sm">{g.icon}</View>
                                <Text className="text-slate-900 text-lg font-bold">{g.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <Text className="text-slate-900 text-2xl font-bold mb-10">Subject & Proficiency</Text>

                        <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3 px-1">Subject of interest</Text>
                        <TextInput
                            value={formData.subject}
                            onChangeText={(t) => setFormData({ ...formData, subject: t })}
                            placeholder="e.g. Mathematics, Physics"
                            placeholderTextColor="#94a3b8"
                            className="bg-slate-50 text-slate-900 p-6 rounded-2xl border border-slate-100 mb-10 font-bold"
                        />

                        <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4 px-1">Your Proficiency</Text>
                        <View className="flex-row flex-wrap justify-between">
                            {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                                <TouchableOpacity
                                    key={l}
                                    onPress={() => setFormData({ ...formData, level: l })}
                                    className={`w-[48%] py-5 rounded-2xl mb-4 border items-center ${formData.level === l ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-100'}`}
                                >
                                    <Text className={`font-bold text-xs uppercase tracking-widest ${formData.level === l ? 'text-white' : 'text-slate-400'}`}>{l}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={() => setStep(3)}
                            className="bg-primary py-5 rounded-2xl mt-8 items-center shadow-xl shadow-primary/20"
                        >
                            <Text className="text-white font-bold uppercase tracking-widest text-xs">Continue</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <Text className="text-slate-900 text-2xl font-bold mb-10">Preferred Learning Style</Text>

                        {[
                            { id: 'practical', label: 'Practical', desc: 'Focus on hands-on exercises' },
                            { id: 'theory', label: 'Conceptual', desc: 'Deep dive into fundamentals' },
                            { id: 'visual', label: 'Interactive', desc: 'Visual aids & examples' }
                        ].map((s) => (
                            <TouchableOpacity
                                key={s.id}
                                onPress={() => setFormData({ ...formData, style: s.id })}
                                className={`p-6 rounded-[2rem] border mb-4 ${formData.style === s.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100'}`}
                            >
                                <Text className={`text-lg font-bold ${formData.style === s.id ? 'text-primary' : 'text-slate-900'}`}>{s.label}</Text>
                                <Text className="text-slate-400 text-sm font-medium mt-1">{s.desc}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={handleAnalyze}
                            className="bg-slate-900 py-6 rounded-2xl mt-12 flex-row items-center justify-center shadow-2xl"
                        >
                            <Sparkles size={18} color="white" />
                            <Text className="text-white font-bold uppercase tracking-widest text-xs ml-3">Start Match Analysis</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 4 && (
                    <View className="items-center">
                        {loading ? (
                            <View className="items-center py-20">
                                <ActivityIndicator size="large" color="#1e448a" />
                                <Text className="text-slate-900 text-2xl font-bold mt-10">AI at work...</Text>
                                <Text className="text-slate-400 font-medium mt-4 text-center px-10">Scanning over 5,000 verified profiles to find your perfect match.</Text>
                            </View>
                        ) : results && (
                            <View className="w-full pb-10">
                                <View className="bg-emerald-50 self-center px-6 py-2 rounded-full mb-10">
                                    <Text className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Match Found</Text>
                                </View>

                                <View className="bg-white p-10 rounded-[3rem] border-4 border-primary shadow-2xl shadow-primary/10">
                                    <View className="items-center mb-8">
                                        <View className="size-24 rounded-[2rem] bg-slate-50 items-center justify-center border-4 border-white shadow-lg">
                                            <Text className="text-primary text-4xl font-bold">{results.matches?.[0]?.name.charAt(0)}</Text>
                                        </View>
                                        <Text className="text-slate-900 text-2xl font-bold mt-6 text-center">{results.matches?.[0]?.name}</Text>
                                        <Text className="text-primary text-lg font-bold mt-1">₹{results.matches?.[0]?.hourlyRate}/hr</Text>
                                    </View>

                                    <View className="bg-slate-50 p-6 rounded-[2rem] mb-10">
                                        <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">Why we matched you</Text>
                                        {results.matches?.[0]?.aiReasoning?.map((reason, i) => (
                                            <View key={i} className="flex-row items-center gap-3 mb-3">
                                                <View className="size-1.5 rounded-full bg-emerald-500" />
                                                <Text className="text-slate-600 font-bold text-xs">{reason}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    <TouchableOpacity className="bg-primary py-5 rounded-2xl items-center shadow-lg shadow-primary/20">
                                        <Text className="text-white font-bold uppercase tracking-widest text-xs">Book Free Trial</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setStep(1)}
                                    className="mt-10 items-center"
                                >
                                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Start New Search</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

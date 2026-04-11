import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, Star, MapPin, CheckCircle2, MessageCircle, Calendar, GraduationCap, ShieldCheck, Flame, BadgeCheck } from 'lucide-react-native';
import { api } from '../../lib/api';

export default function TutorProfile() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutor();
    }, [id]);

    const fetchTutor = async () => {
        try {
            const data = await api.get(`/tutors/${id}`);
            setTutor(data.tutor);
        } catch (error) {
            console.error("API Fetch Error:", error);
            // Fallback for demo
            setTutor({
                id: id,
                name: "Dr. Arvinder Singh",
                subjects: ["Physics", "Mathematics"],
                hourlyRate: 500,
                city: "New Delhi",
                bio: "Experienced educator with over 15 years of teaching experience. I focus on conceptual understanding and problem-solving skills for competitive exams like JEE and NEET. My methodology involves first-principles thinking and deep-dive analytics into problem patterns.",
                isVerified: true,
                experience: "15+"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background-dark justify-center items-center">
                <ActivityIndicator size="large" color="#0066ff" />
            </View>
        );
    }

    if (!tutor) {
        return (
            <View className="flex-1 bg-background-dark justify-center items-center">
                <Text className="text-[#6c757d] font-black uppercase tracking-widest text-xs">Tutor not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />
            {/* Custom Header */}
            <View className="flex-row items-center px-8 py-6 justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-3 bg-surface-dark rounded-2xl border border-border-dark">
                    <ChevronLeft size={20} color="white" strokeWidth={3} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-white text-lg font-black tracking-tight">Expert Analytics</Text>
                    <Text className="text-primary text-xs font-black uppercase tracking-widest">Profile Authenticated</Text>
                </View>
                <View className="w-12" />
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                {/* Profile Identity Section */}
                <View className="items-center mt-10">
                    <View className="size-36 rounded-[3.5rem] bg-surface-dark items-center justify-center border-2 border-primary shadow-2xl relative">
                        <Text className="text-primary text-6xl font-black">{tutor.name?.charAt(0)}</Text>
                        <View className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-2xl border-4 border-background-dark">
                            <ShieldCheck size={20} color="white" />
                        </View>
                    </View>

                    <View className="flex-row items-center mt-10 gap-2.5">
                        <Text className="text-white text-3xl font-black tracking-tighter">{tutor.name}</Text>
                        <BadgeCheck size={26} color="#0066ff" />
                    </View>

                    <View className="flex-row items-center mt-5">
                        <View className="bg-primary/10 px-4 py-2 rounded-2xl flex-row items-center gap-2 border border-primary/20">
                            <Star size={14} color="#ff9500" fill="#ff9500" />
                            <Text className="text-white font-black text-xs">4.9 / 5.0</Text>
                        </View>
                        <View className="size-1.5 rounded-full bg-border-dark mx-5" />
                        <View className="flex-row items-center gap-2">
                            <MapPin size={14} color="#6c757d" />
                            <Text className="text-[#6c757d] font-black text-xs uppercase tracking-[0.2em]">{tutor.city || 'Verified Remote'}</Text>
                        </View>
                    </View>
                </View>

                {/* Performance Bento Grid */}
                <View className="flex-row justify-between mt-14 gap-5">
                    <View className="flex-1 bg-surface-dark p-8 rounded-[3rem] border border-border-dark items-center shadow-lg">
                        <Text className="text-[#6c757d] text-xs font-black uppercase tracking-widest mb-3">Rate / Session</Text>
                        <View className="flex-row items-end">
                            <Text className="text-white text-3xl font-black tracking-tighter">₹{tutor.hourlyRate}</Text>
                            <Text className="text-[#6c757d] text-xs font-black ml-1 mb-1.5 uppercase">Net</Text>
                        </View>
                    </View>
                    <View className="flex-1 bg-surface-dark p-8 rounded-[3rem] border border-border-dark items-center shadow-lg">
                        <Text className="text-[#6c757d] text-xs font-black uppercase tracking-widest mb-3">Excellence</Text>
                        <View className="flex-row items-end">
                            <Text className="text-white text-3xl font-black tracking-tighter">{tutor.experience || '15+'}</Text>
                            <Text className="text-[#6c757d] text-xs font-black ml-1.5 mb-1.5 uppercase">Years</Text>
                        </View>
                    </View>
                </View>

                {/* About Section - Academic Focus */}
                <View className="mt-14">
                    <View className="flex-row items-center gap-3 mb-6">
                        <View className="size-2 bg-primary rounded-full" />
                        <Text className="text-white text-xl font-black tracking-tight uppercase">Pedagogical Philosophy</Text>
                    </View>
                    <View className="bg-surface-dark/50 p-8 rounded-[3rem] border border-border-dark relative shadow-inner">
                        <View className="absolute top-0 right-0 p-6 opacity-10">
                            <Flame size={48} color="#0066ff" />
                        </View>
                        <Text className="text-[#a0aec0] font-black italic leading-[1.8] text-sm">
                            "{tutor.bio || "Hello! I am a passionate educator focused on making complex topics easy to understand. I specialize in personalized learning to help you achieve your academic goals."}"
                        </Text>
                    </View>
                </View>

                {/* Verified Domains */}
                <View className="mt-12">
                    <Text className="text-[#6c757d] text-xs font-black uppercase tracking-[0.25em] mb-6">Authenticated Domains of Expertise</Text>
                    <View className="flex-row flex-wrap gap-4">
                        {tutor.subjects?.map((s) => (
                            <View key={s} className="bg-primary/5 px-8 py-4 rounded-[1.5rem] border border-primary/20 shadow-sm shadow-primary/5">
                                <Text className="text-primary font-black text-xs uppercase tracking-widest">{s}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="h-48" />
            </ScrollView>

            {/* Premium Booking Interface */}
            <View className="absolute bottom-12 left-8 right-8 flex-row gap-5 items-center">
                <TouchableOpacity
                    onPress={() => router.push('/messages')}
                    className="bg-surface-dark p-7 rounded-3xl shadow-2xl border border-border-dark active:scale-95 transition-transform"
                >
                    <MessageCircle size={28} color="#0066ff" strokeWidth={2.5} />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-primary p-7 rounded-[2rem] items-center justify-center shadow-2xl shadow-primary/40 active:scale-95 transition-transform">
                    <View className="flex-row items-center gap-4">
                        <Calendar size={20} color="white" strokeWidth={3} />
                        <Text className="text-white font-black uppercase tracking-[0.2em] text-xs">Secure Mentorship</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

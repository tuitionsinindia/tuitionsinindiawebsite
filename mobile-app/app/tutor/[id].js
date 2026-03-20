import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, Star, MapPin, CheckCircle2, MessageCircle, Calendar, GraduationCap } from 'lucide-react-native';
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
            console.error(error);
            // Fallback mock
            setTutor({
                id: id,
                name: "Dr. Arvinder Singh",
                subjects: ["Physics", "Mathematics"],
                hourlyRate: 500,
                city: "New Delhi",
                bio: "Experienced educator with over 15 years of teaching experience. I focus on conceptual understanding and problem-solving skills for competitive exams like JEE and NEET."
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#1e448a" />
            </View>
        );
    }

    if (!tutor) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Text className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tutor not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Custom Header */}
            <View className="flex-row items-center px-6 py-4 justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#1e448a" />
                </TouchableOpacity>
                <Text className="text-slate-900 text-lg font-bold">Educator Profile</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Profile Section */}
                <View className="items-center mt-10">
                    <View className="size-32 rounded-[3rem] bg-slate-50 items-center justify-center border border-slate-100 shadow-sm">
                        <Text className="text-primary text-5xl font-bold">{tutor.name?.charAt(0)}</Text>
                    </View>

                    <View className="flex-row items-center mt-8 gap-2">
                        <Text className="text-slate-900 text-3xl font-bold tracking-tight">{tutor.name}</Text>
                        <CheckCircle2 size={24} color="#10b981" />
                    </View>

                    <View className="flex-row items-center mt-4">
                        <View className="bg-amber-50 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 border border-amber-100">
                            <Star size={14} color="#f2994a" fill="#f2994a" />
                            <Text className="text-slate-900 font-bold text-xs">4.9</Text>
                        </View>
                        <View className="size-1 rounded-full bg-slate-200 mx-4" />
                        <View className="flex-row items-center gap-1.5">
                            <MapPin size={14} color="#94a3b8" />
                            <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{tutor.city || 'Available Online'}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Info Grid */}
                <View className="flex-row justify-between mt-12 gap-4">
                    <View className="flex-1 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 items-center">
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Hourly Rate</Text>
                        <Text className="text-slate-900 text-2xl font-bold">₹{tutor.hourlyRate}</Text>
                    </View>
                    <View className="flex-1 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 items-center">
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Experience</Text>
                        <Text className="text-slate-900 text-2xl font-bold">15+ <Text className="text-sm">yrs</Text></Text>
                    </View>
                </View>

                {/* Bio Section */}
                <View className="mt-12">
                    <Text className="text-slate-900 text-xl font-bold mb-4 tracking-tight">About Me</Text>
                    <View className="bg-white p-6 rounded-[2.5rem] border border-slate-100">
                        <Text className="text-slate-500 font-medium leading-relaxed text-base">
                            {tutor.bio || "Hello! I am a passionate educator focused on making complex topics easy to understand. I specialize in personalized learning to help you achieve your academic goals."}
                        </Text>
                    </View>
                </View>

                {/* Specialties */}
                <View className="mt-10">
                    <Text className="text-slate-900 text-xl font-bold mb-5 tracking-tight">Specialties</Text>
                    <View className="flex-row flex-wrap gap-3">
                        {tutor.subjects?.map((s) => (
                            <View key={s} className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
                                <Text className="text-primary font-bold text-xs uppercase tracking-widest">{s}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="h-40" />
            </ScrollView>

            {/* Bottom Booking Bar */}
            <View className="absolute bottom-10 left-6 right-6 flex-row gap-4">
                <TouchableOpacity
                    onPress={() => router.push('/messages')}
                    className="bg-slate-900 p-6 rounded-2xl shadow-xl"
                >
                    <MessageCircle size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-primary py-6 rounded-2xl items-center justify-center shadow-2xl shadow-primary/20">
                    <View className="flex-row items-center gap-3">
                        <Calendar size={20} color="white" />
                        <Text className="text-white font-bold uppercase tracking-widest text-xs">Book Free Trial</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

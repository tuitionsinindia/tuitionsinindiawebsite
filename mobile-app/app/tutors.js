import { View, Text, TouchableOpacity, SafeAreaView, FlatList, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, SlidersHorizontal, MapPin, Star, Bookmark, GraduationCap, ShieldCheck, BadgeCheck } from 'lucide-react-native';
import { api } from '../lib/api';

export default function TutorsDirectory() {
    const router = useRouter();
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async () => {
        setLoading(true);
        try {
            const data = await api.get('/tutors');
            setTutors(data.tutors || []);
        } catch (error) {
            console.error("API Fetch Error:", error);
            // Fallback for demo
            setTutors([
                { id: '1', name: 'Dr. Arvinder Singh', subjects: ['Physics', 'Mathematics'], hourlyRate: 500, city: 'New Delhi', rating: 4.9, isVerified: true },
                { id: '2', name: 'Priya Sharma', subjects: ['English', 'History'], hourlyRate: 400, city: 'Mumbai', rating: 4.8, isVerified: true },
                { id: '3', name: 'Rahul Verma', subjects: ['Chemistry', 'Biology'], hourlyRate: 450, city: 'Bangalore', rating: 4.7, isVerified: false }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const renderTutor = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push(`/tutor/${item.id}`)}
            className="bg-surface-dark rounded-[2.5rem] border border-border-dark mb-6 overflow-hidden shadow-2xl active:scale-[0.98] transition-all"
        >
            <View className="flex-row p-7">
                <View className="size-20 bg-background-dark rounded-3xl items-center justify-center border-2 border-border-dark shadow-inner relative">
                    <Text className="text-primary text-3xl font-black">{item.name?.charAt(0)}</Text>
                    {item.isVerified && (
                        <View className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-lg border-2 border-surface-dark">
                            <ShieldCheck size={12} color="white" />
                        </View>
                    )}
                </View>
                <View className="flex-1 ml-6 justify-center">
                    <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center gap-2">
                            <Text className="text-white text-lg font-black tracking-tight">{item.name}</Text>
                            {item.isVerified && <BadgeCheck size={16} color="#0066ff" />}
                        </View>
                        <Bookmark size={20} color="#1a2333" />
                    </View>
                    
                    <Text className="text-primary font-black text-xs uppercase tracking-[0.15em] mb-3">{item.subjects?.join(' • ')}</Text>
                    
                    <View className="flex-row items-center">
                        <MapPin size={12} color="#6c757d" />
                        <Text className="text-[#6c757d] text-xs font-black ml-1.5 uppercase tracking-widest">{item.city || 'Remote Collaboration'}</Text>
                    </View>
                </View>
            </View>

            <View className="bg-background-dark/30 px-7 py-5 flex-row justify-between items-center border-t border-border-dark">
                <View className="flex-row items-center bg-surface-dark/50 px-4 py-2 rounded-xl border border-border-dark">
                    <Star size={14} color="#ff9500" fill="#ff9500" />
                    <Text className="text-white font-black ml-2 text-xs">{item.rating || '4.9'}</Text>
                    <View className="size-1 bg-[#4a5568] rounded-full mx-2" />
                    <Text className="text-[#6c757d] text-xs font-black uppercase tracking-widest">Verified</Text>
                </View>
                <View className="flex-row items-end">
                    <Text className="text-white font-black text-xl">₹{item.hourlyRate}</Text>
                    <Text className="text-[#6c757d] font-black text-xs mb-1.5 ml-1.5 uppercase tracking-tighter">/ Session</Text>
                </View>
            </View>
        </TouchableOpacity >
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />
            {/* Executive Header */}
            <View className="px-8 py-6 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-3 bg-surface-dark rounded-2xl border border-border-dark">
                    <ChevronLeft size={20} color="white" strokeWidth={3} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-white text-xl font-black tracking-tight">Institutional Specialists</Text>
                    <Text className="text-primary text-xs font-black uppercase tracking-widest">Verified Active Profiles</Text>
                </View>
                <TouchableOpacity className="p-3 bg-surface-dark rounded-2xl border border-border-dark">
                    <SlidersHorizontal size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Smart Discovery Filter */}
            <View className="px-8 mb-10 mt-4">
                <View className="bg-surface-dark rounded-3xl flex-row items-center px-6 py-5 border border-border-dark shadow-2xl">
                    <Search size={20} color="#0066ff" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search discipline or expert name..."
                        placeholderTextColor="#4a5568"
                        className="flex-1 ml-4 text-white font-black text-sm"
                    />
                </View>
            </View>

            {/* Specialist Inventory List */}
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0066ff" />
                </View>
            ) : (
                <FlatList
                    data={tutors}
                    renderItem={renderTutor}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 60 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center mt-24">
                            <View className="bg-surface-dark p-8 rounded-[3rem] border border-border-dark mb-6">
                                <GraduationCap size={48} color="#1a2333" />
                            </View>
                            <Text className="text-[#6c757d] text-lg font-black uppercase tracking-widest">No Matches Identified</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

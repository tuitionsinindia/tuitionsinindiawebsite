import { View, Text, TouchableOpacity, SafeAreaView, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, SlidersHorizontal, MapPin, Star, Bookmark, GraduationCap } from 'lucide-react-native';
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
            console.error(error);
            // Fallback for demo
            setTutors([
                { id: '1', name: 'Dr. Arvinder Singh', subjects: ['Physics', 'Mathematics'], hourlyRate: 500, city: 'New Delhi', rating: 4.9 },
                { id: '2', name: 'Priya Sharma', subjects: ['English', 'History'], hourlyRate: 400, city: 'Mumbai', rating: 4.8 },
                { id: '3', name: 'Rahul Verma', subjects: ['Chemistry', 'Biology'], hourlyRate: 450, city: 'Bangalore', rating: 4.7 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const renderTutor = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push(`/tutor/${item.id}`)}
            className="bg-white rounded-[2.5rem] border border-slate-100 mb-6 overflow-hidden shadow-sm shadow-slate-200/50"
        >
            <View className="flex-row p-6">
                <View className="size-20 bg-slate-50 rounded-2xl items-center justify-center border border-slate-100">
                    <Text className="text-primary text-2xl font-bold">{item.name?.charAt(0)}</Text>
                </View>
                <View className="flex-1 ml-5 justify-center">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-slate-900 text-lg font-bold tracking-tight">{item.name}</Text>
                        <Bookmark size={20} color="#cbd5e1" />
                    </View>
                    <Text className="text-primary font-bold text-[10px] uppercase tracking-widest">{item.subjects?.join(' • ')}</Text>
                    <View className="flex-row items-center mt-3">
                        <MapPin size={12} color="#94a3b8" />
                        <Text className="text-slate-400 text-xs font-bold ml-1 uppercase tracking-widest">{item.city || 'Remote'}</Text>
                    </View>
                </View>
            </View>

            <View className="bg-slate-50 px-6 py-4 flex-row justify-between items-center border-t border-slate-50">
                <View className="flex-row items-center">
                    <Star size={14} color="#f2994a" fill="#f2994a" />
                    <Text className="text-slate-900 font-bold ml-1.5 text-sm">{item.rating || '4.9'}</Text>
                    <Text className="text-slate-400 text-[10px] font-bold ml-2 uppercase tracking-widest">Reviews</Text>
                </View>
                <View className="flex-row items-end">
                    <Text className="text-slate-900 font-bold text-lg">₹{item.hourlyRate}</Text>
                    <Text className="text-slate-400 font-bold text-[10px] mb-1 ml-1 uppercase">/hr</Text>
                </View>
            </View>
        </TouchableOpacity >
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#1e448a" />
                </TouchableOpacity>
                <Text className="text-slate-900 text-xl font-bold">Verified Tutors</Text>
                <TouchableOpacity className="p-2 -mr-2">
                    <SlidersHorizontal size={20} color="#1e448a" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="px-6 mb-8 mt-4">
                <View className="bg-slate-50 rounded-2xl flex-row items-center px-5 py-4 border border-slate-100 shadow-sm shadow-slate-100">
                    <Search size={18} color="#94a3b8" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search subject or tutor name..."
                        placeholderTextColor="#94a3b8"
                        className="flex-1 ml-4 text-slate-900 font-medium"
                    />
                </View>
            </View>

            {/* Tutors List */}
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#1e448a" />
                </View>
            ) : (
                <FlatList
                    data={tutors}
                    renderItem={renderTutor}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <GraduationCap size={48} color="#cbd5e1" />
                            <Text className="text-slate-400 text-lg font-bold mt-5">No tutors found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Search, MessageSquare, GraduationCap } from 'lucide-react-native';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-6 pt-10 pb-10">
                {/* Header Section */}
                <View className="flex-row items-center justify-between mb-12">
                    <View className="flex-row items-center gap-3">
                        <View className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20">
                            <GraduationCap size={24} color="white" />
                        </View>
                        <View>
                            <Text className="text-slate-900 text-xl font-bold tracking-tight">TuitionsInIndia</Text>
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Premium AI Learning</Text>
                        </View>
                    </View>
                </View>

                {/* Hero Card - Premium White */}
                <View className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 mb-10 overflow-hidden relative">
                    <Text className="text-slate-900 text-3xl font-bold leading-tight mb-4">
                        Master Any{"\n"}
                        <Text className="text-primary">Subject</Text> with Top Experts
                    </Text>
                    <Text className="text-slate-500 text-base mb-8 leading-relaxed font-medium">
                        Connect with verified educators through India's most advanced AI-matching platform.
                    </Text>

                    {/* AI CTA - Premium Blue */}
                    <TouchableOpacity
                        onPress={() => router.push('/ai-match')}
                        className="bg-primary py-5 rounded-2xl flex-row items-center justify-center shadow-2xl shadow-primary/20"
                    >
                        <Sparkles size={18} color="white" />
                        <Text className="text-white font-bold text-sm ml-2 uppercase tracking-widest">AI Matchmaker</Text>
                    </TouchableOpacity>
                </View>

                {/* Grid Actions */}
                <View className="flex-row gap-4 mb-10">
                    <TouchableOpacity
                        onPress={() => router.push('/tutors')}
                        className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 items-center justify-center shadow-sm"
                    >
                        <View className="bg-blue-50 p-4 rounded-2xl mb-4">
                            <Search size={24} color="#1e448a" />
                        </View>
                        <Text className="text-slate-900 font-bold text-xs uppercase tracking-widest text-center">Find Tutors</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/messages')}
                        className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 items-center justify-center shadow-sm"
                    >
                        <View className="bg-emerald-50 p-4 rounded-2xl mb-4">
                            <MessageSquare size={24} color="#10b981" />
                        </View>
                        <Text className="text-slate-900 font-bold text-xs uppercase tracking-widest text-center">Chat Center</Text>
                    </TouchableOpacity>
                </View>

                {/* Secondary CTA */}
                <View className="flex-1 justify-end">
                    <TouchableOpacity
                        onPress={() => console.log('Tutor Join')}
                        className="bg-slate-900 py-5 rounded-2xl items-center shadow-xl"
                    >
                        <Text className="text-white font-bold text-xs uppercase tracking-widest">Join as a Verified Tutor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => console.log('Login')}
                        className="py-6 items-center"
                    >
                        <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

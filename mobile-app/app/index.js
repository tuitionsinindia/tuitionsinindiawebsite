import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Search, MessageSquare, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react-native';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />
            <View className="flex-1 px-8 pt-12 pb-10">
                {/* Executive Header Branding */}
                <View className="flex-row items-center justify-between mb-10">
                    <View className="flex-row items-center gap-4">
                        <View className="bg-primary p-3 rounded-2xl shadow-2xl shadow-primary/40 rotate-1">
                            <GraduationCap size={28} color="white" />
                        </View>
                        <View>
                            <View className="flex-row items-center gap-2 mb-0.5">
                                <View className="size-2 bg-primary rounded-full animate-pulse" />
                                <Text className="text-primary text-xs font-black uppercase tracking-[0.25em]">Global Intelligence</Text>
                            </View>
                            <Text className="text-white text-2xl font-black tracking-tighter">TuitionsInIndia</Text>
                        </View>
                    </View>
                </View>

                {/* Premium Glassmorphic Hero Card */}
                <View className="bg-surface-dark p-8 rounded-[3rem] border border-border-dark mb-10 overflow-hidden relative shadow-2xl">
                    <View className="absolute top-0 right-0 -mr-16 -mt-16 bg-primary/5 size-48 rounded-full blur-3xl" />
                    <View className="absolute bottom-0 left-0 -ml-16 -mb-16 bg-accent-amber/5 size-48 rounded-full blur-3xl" />

                    <View className="flex-row items-center gap-2 mb-4">
                        <ShieldCheck size={14} color="#0066ff" />
                        <Text className="text-[#6c757d] text-xs font-black uppercase tracking-widest">Verified Academic Platform</Text>
                    </View>

                    <Text className="text-white text-3xl font-black leading-[1.2] mb-5 tracking-tight">
                        Master Any{"\n"}
                        <Text className="text-primary italic">Subject</Text> with India's Best
                    </Text>
                    
                    <Text className="text-[#a0aec0] text-sm mb-10 leading-relaxed font-bold">
                        Connect with verified PhDs and industry experts through our proprietary AI Matchmaker.
                    </Text>

                    {/* AI CTA - The Primary Action */}
                    <TouchableOpacity
                        onPress={() => router.push('/ai-match')}
                        className="bg-primary py-5 rounded-[2rem] flex-row items-center justify-center shadow-2xl shadow-primary/30 active:scale-95"
                    >
                        <Sparkles size={20} color="white" fill="white" />
                        <Text className="text-white font-black text-xs ml-3 uppercase tracking-[0.2em]">Start Matching Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Bento Grid Actions - Institutional Style */}
                <View className="flex-row gap-5 mb-10">
                    <TouchableOpacity
                        onPress={() => router.push('/tutors')}
                        className="flex-1 bg-surface-dark p-8 rounded-[2.5rem] border border-border-dark items-center justify-center shadow-lg hover:border-primary/30 transition-all"
                    >
                        <View className="bg-primary/10 p-4 rounded-[1.5rem] mb-4">
                            <Search size={26} color="#0066ff" />
                        </View>
                        <Text className="text-white font-black text-xs uppercase tracking-widest text-center">Find Experts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/messages')}
                        className="flex-1 bg-surface-dark p-8 rounded-[2.5rem] border border-border-dark items-center justify-center shadow-lg hover:border-primary/30 transition-all"
                    >
                        <View className="bg-success-green/10 p-4 rounded-[1.5rem] mb-4">
                            <MessageSquare size={26} color="#34c759" />
                        </View>
                        <Text className="text-white font-black text-xs uppercase tracking-widest text-center">Chat Room</Text>
                    </TouchableOpacity>
                </View>

                {/* Growth CTA Section */}
                <View className="flex-1 justify-end">
                    <TouchableOpacity
                        onPress={() => console.log('Tutor Join')}
                        className="bg-white py-6 rounded-3xl items-center shadow-2xl flex-row justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <Text className="text-background-dark font-black text-xs uppercase tracking-[0.15em]">Partner as an Expert</Text>
                        <ArrowRight size={16} color="#000a1e" strokeWidth={3} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={() => router.push('/login')}
                        className="py-8 items-center group"
                    >
                        <Text className="text-[#6c757d] font-black text-xs uppercase tracking-[0.25em]">
                            Existing User? <Text className="text-white">Admin / User Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

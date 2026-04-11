import { View, Text, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 px-8 pt-10 pb-10">
                    {/* Executive Header */}
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        className="p-3 bg-surface-dark rounded-2xl border border-border-dark self-start mb-12"
                    >
                        <ChevronLeft size={20} color="white" strokeWidth={3} />
                    </TouchableOpacity>

                    <View className="mb-12">
                        <Text className="text-white text-4xl font-black mb-4 tracking-tighter">Welcome{"\n"}<Text className="text-primary italic">Back</Text></Text>
                        <View className="flex-row items-center gap-2">
                            <ShieldCheck size={14} color="#0066ff" />
                            <Text className="text-[#6c757d] text-xs font-black uppercase tracking-[0.2em]">Institutional Access Only</Text>
                        </View>
                    </View>

                    {/* Login Form */}
                    <View className="gap-6">
                        <View>
                            <Text className="text-primary font-black text-xs uppercase tracking-widest mb-4 px-1">Email Address</Text>
                            <View className="bg-surface-dark rounded-3xl flex-row items-center px-6 py-5 border border-border-dark shadow-inner">
                                <Mail size={18} color="#4a5568" />
                                <TextInput
                                    placeholder="Enter your institutional email"
                                    placeholderTextColor="#4a5568"
                                    className="flex-1 ml-4 text-white font-black text-sm"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-primary font-black text-xs uppercase tracking-widest mb-4 px-1">Institutional Password</Text>
                            <View className="bg-surface-dark rounded-3xl flex-row items-center px-6 py-5 border border-border-dark shadow-inner">
                                <Lock size={18} color="#4a5568" />
                                <TextInput
                                    placeholder="Enter secure password"
                                    placeholderTextColor="#4a5568"
                                    className="flex-1 ml-4 text-white font-black text-sm"
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity className="items-end mt-2">
                            <Text className="text-primary font-black text-xs uppercase tracking-widest">Recovery Access</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className="bg-white py-6 rounded-[2rem] mt-10 flex-row items-center justify-center shadow-2xl active:scale-95 transition-transform"
                            onPress={() => router.push('/')}
                        >
                            <Text className="text-background-dark font-black uppercase tracking-[0.2em] text-xs">Authorize Entry</Text>
                            <ArrowRight size={16} color="#000a1e" strokeWidth={3} className="ml-3" />
                        </TouchableOpacity>
                    </View>

                    {/* Footer Branding */}
                    <View className="flex-1 justify-end items-center mb-6">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="size-1.5 bg-[#34c759] rounded-full" />
                            <Text className="text-[#6c757d] font-black text-xs uppercase tracking-[0.25em]">TuitionsInIndia Security</Text>
                        </View>
                        <Text className="text-[#4a5568] text-xs font-black uppercase tracking-widest text-center px-12">
                            By authorizing, you agree to our Institutional Terms of Service and Privacy Protocols.
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

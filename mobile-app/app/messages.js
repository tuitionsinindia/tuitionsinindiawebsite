import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MessageCircle, MoreVertical, Search, GraduationCap, ShieldCheck, Lock } from 'lucide-react-native';

const MOCK_MESSAGES = [
    { id: '1', name: 'Ramesh Sharma', lastMsg: 'I can start the trial tomorrow at 5?', time: '2m ago', unread: 2, isActive: true },
    { id: '2', name: 'Dr. Arvinder Singh', lastMsg: 'Looking forward to our first session.', time: '1h ago', unread: 0, isActive: false },
    { id: '3', name: 'Anil Kumar', lastMsg: 'The notes have been uploaded to your dashboard.', time: '3h ago', unread: 0, isActive: false },
];

export default function MessagesHub() {
    const router = useRouter();

    const renderChat = ({ item }) => (
        <TouchableOpacity
            onPress={() => console.log('Open Chat')}
            className={`flex-row px-8 py-7 items-center border-b border-border-dark active:bg-surface-dark/50 transition-colors ${item.unread > 0 ? 'bg-surface-dark/20' : ''}`}
        >
            <View className="size-16 bg-surface-dark rounded-2xl items-center justify-center border-2 border-border-dark shadow-2xl relative">
                <Text className="text-primary text-2xl font-black">{item.name?.charAt(0)}</Text>
                {item.isActive && (
                    <View className="absolute -top-1 -right-1 bg-[#34c759] size-3 rounded-full border-2 border-background-dark shadow-sm" />
                )}
            </View>
            <View className="flex-1 ml-6 justify-center">
                <View className="flex-row justify-between mb-1">
                    <Text className="text-white text-lg font-black tracking-tight">{item.name}</Text>
                    <Text className="text-[#6c757d] text-[10px] font-black uppercase tracking-widest">{item.time}</Text>
                </View>
                <Text className={`text-xs tracking-tight ${item.unread > 0 ? 'text-white font-black' : 'text-[#6c757d] font-bold'}`} numberOfLines={1}>
                    {item.lastMsg}
                </Text>
            </View>
            {item.unread > 0 && (
                <View className="bg-primary px-3 py-1.5 rounded-full ml-4 items-center justify-center shadow-2xl shadow-primary/40 border border-primary/20">
                    <Text className="text-white text-[10px] font-black">{item.unread}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />
            {/* Executive Header */}
            <View className="px-8 py-6 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="p-3 bg-surface-dark rounded-2xl border border-border-dark">
                        <ChevronLeft size={20} color="white" strokeWidth={3} />
                    </TouchableOpacity>
                    <View className="ml-5">
                        <Text className="text-white text-xl font-black tracking-tight">Communications Hub</Text>
                        <View className="flex-row items-center gap-1.5">
                            <Lock size={10} color="#0066ff" />
                            <Text className="text-primary text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity className="p-3 bg-surface-dark rounded-2xl border border-border-dark">
                    <Search size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Chat Inventory List */}
            <FlatList
                data={MOCK_MESSAGES}
                renderItem={renderChat}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="px-8 py-8 border-b border-border-dark bg-surface-dark/20">
                        <View className="flex-row items-center bg-primary/10 p-6 rounded-[2.5rem] border border-primary/20 shadow-inner">
                            <View className="bg-background-dark p-3 rounded-2xl border border-primary/20 shadow-2xl">
                                <ShieldCheck size={20} color="#0066ff" />
                            </View>
                            <View className="ml-5 flex-1">
                                <Text className="text-white font-black text-xs uppercase tracking-widest mb-1">Direct Verification</Text>
                                <Text className="text-[#6c757d] font-bold text-[10px] tracking-tight">Secure communication with verified institutional specialists.</Text>
                            </View>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View className="items-center mt-32">
                        <View className="bg-surface-dark p-10 rounded-[4rem] border border-border-dark mb-8">
                            <MessageCircle size={64} color="#1a2333" />
                        </View>
                        <Text className="text-[#6c757d] text-base font-black uppercase tracking-[0.2em]">Silence Observed</Text>
                        <Text className="text-[#4a5568] text-[10px] font-black uppercase mt-2">No active communications found</Text>
                    </View>
                }
            />

        </SafeAreaView>
    );
}

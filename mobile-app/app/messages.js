import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MessageCircle, MoreVertical, Search, GraduationCap } from 'lucide-react-native';

const MOCK_MESSAGES = [
    { id: '1', name: 'Ramesh Sharma', lastMsg: 'I can start the trial tomorrow at 5?', time: '2m ago', unread: 2 },
    { id: '2', name: 'Dr. Arvinder Singh', lastMsg: 'Looking forward to our first session.', time: '1h ago', unread: 0 },
    { id: '3', name: 'Anil Kumar', lastMsg: 'The notes have been uploaded to your dashboard.', time: '3h ago', unread: 0 },
];

export default function MessagesHub() {
    const router = useRouter();

    const renderChat = ({ item }) => (
        <TouchableOpacity
            onPress={() => console.log('Open Chat')}
            className="flex-row px-6 py-5 items-center border-b border-slate-50"
        >
            <View className="size-16 bg-slate-50 rounded-[1.5rem] items-center justify-center border border-slate-100 shadow-sm">
                <Text className="text-primary text-2xl font-bold">{item.name?.charAt(0)}</Text>
            </View>
            <View className="flex-1 ml-5 justify-center">
                <View className="flex-row justify-between mb-1.5">
                    <Text className="text-slate-900 text-lg font-bold tracking-tight">{item.name}</Text>
                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{item.time}</Text>
                </View>
                <Text className={`text-sm ${item.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}`} numberOfLines={1}>
                    {item.lastMsg}
                </Text>
            </View>
            {item.unread > 0 && (
                <View className="bg-primary size-5 rounded-full ml-3 items-center justify-center shadow-lg shadow-primary/20">
                    <Text className="text-white text-[10px] font-bold">{item.unread}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <ChevronLeft size={24} color="#1e448a" />
                    </TouchableOpacity>
                    <Text className="text-slate-900 text-2xl font-bold ml-2">Inbox</Text>
                </View>
                <TouchableOpacity className="p-2 -mr-2">
                    <Search size={20} color="#1e448a" />
                </TouchableOpacity>
            </View>

            {/* Chat List */}
            <FlatList
                data={MOCK_MESSAGES}
                renderItem={renderChat}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="px-6 py-6 border-b border-slate-50">
                        <View className="flex-row items-center bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100">
                            <View className="bg-white p-2.5 rounded-xl shadow-sm">
                                <MessageCircle size={18} color="#1e448a" />
                            </View>
                            <Text className="text-slate-600 font-bold text-xs ml-4 flex-1">Communicate directly with your matched educators.</Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View className="items-center mt-20">
                        <GraduationCap size={48} color="#cbd5e1" />
                        <Text className="text-slate-400 text-lg font-bold mt-5">No messages yet</Text>
                    </View>
                }
            />

        </SafeAreaView>
    );
}

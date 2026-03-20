import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import '../global.css';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#ffffff',
                },
                headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#0f172a',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                animation: 'fade_from_bottom',
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}

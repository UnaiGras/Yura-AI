import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions, Keyboard, ViewStyle } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    time?: string;
    hasImage?: boolean;
};

// --- Extracted InputBar Component ---
type InputBarProps = {
    inputText: string;
    setInputText: (text: string) => void;
    handleSend: () => void;
    inputBg: string;
    textColor: string;
    accentColor: string;
    isDark: boolean;
};

const InputBar = ({
    inputText,
    setInputText,
    handleSend,
    inputBg,
    textColor,
    accentColor,
    isDark
}: InputBarProps) => (
    <View style={[styles.inputBar, { backgroundColor: inputBg }]}>
        <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="link" size={20} color="#888" />
        </TouchableOpacity>
        <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Message Yura..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
        // multiline={true} 
        />
        <TouchableOpacity
            style={[styles.micButton, { backgroundColor: inputText ? accentColor : 'transparent' }]}
            onPress={handleSend}
            disabled={!inputText}
        >
            {inputText ? (
                <Ionicons name="arrow-up" size={20} color="#000" />
            ) : (
                <Ionicons name="mic" size={20} color={isDark ? "#888" : "#666"} />
            )}
        </TouchableOpacity>
    </View>
);

export default function YuraChat() {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]); // Start empty
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const scrollViewRef = useRef<ScrollView>(null);

    // Theme Colors
    const themeColors = Colors[isDark ? 'dark' : 'light'];
    const accentColor = (themeColors as any).pastelGreen || '#D1F2D6';
    const inputBg = isDark ? '#1F1F1F' : '#f0f0f0';
    const textColor = isDark ? '#fff' : '#000';

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newUserMsg: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputText('');

        // Mock AI Response
        setTimeout(() => {
            const aiMsg: Message = {
                id: Date.now() + 1,
                text: "I'm Yura, your AI companion. I'm here to help you relax, reflect, or just chat!",
                sender: 'ai',
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    const hasMessages = messages.length > 0;

    return (
        <View style={styles.container}>
            {/* Header Spacer */}
            <View style={{ height: insets.top }} />

            {!hasMessages ? (
                // === EMPTY STATE (HERO) ===
                <View style={styles.emptyContainer}>
                    <View style={styles.heroContent}>
                        <Image
                            source={require('@/assets/images/yura_happy.png')}
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.heroTitle}>How can I help you today?</Text>
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.heroInputContainer}
                    >
                        <InputBar
                            inputText={inputText}
                            setInputText={setInputText}
                            handleSend={handleSend}
                            inputBg={inputBg}
                            textColor={textColor}
                            accentColor={accentColor}
                            isDark={isDark}
                        />
                    </KeyboardAvoidingView>
                </View>
            ) : (
                // === ACTIVE CHAT STATE ===
                <>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.chatContainer}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <View key={msg.id} style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
                                    {!isUser && (
                                        <View style={[styles.aiAvatar, { backgroundColor: accentColor }]}>
                                            <Image
                                                source={require('@/assets/images/yura_happy.png')}
                                                style={{ width: 24, height: 24 }}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    )}
                                    <View style={[
                                        styles.bubble,
                                        isUser ? { backgroundColor: '#333' } : { backgroundColor: accentColor }
                                    ]}>
                                        <Text style={[styles.messageText, isUser ? { color: '#fff' } : { color: '#000' }]}>
                                            {msg.text}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                        style={styles.keyboardContainer}
                    >
                        <View style={styles.activeInputWrapper}>
                            <InputBar
                                inputText={inputText}
                                setInputText={setInputText}
                                handleSend={handleSend}
                                inputBg={inputBg}
                                textColor={textColor}
                                accentColor={accentColor}
                                isDark={isDark}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Empty State Styles
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    heroContent: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: -100, // Visual tweak to center better
    },
    heroImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '600',
        opacity: 0.8,
    },
    heroInputContainer: {
        // Ensures input moves up with keyboard in empty state too
    },

    // Active Chat Styles
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        padding: 20,
        paddingBottom: 20,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    aiRow: {
        justifyContent: 'flex-start',
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        overflow: 'hidden',
    },
    bubble: {
        maxWidth: '80%',
        padding: 14,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },

    // Input Styles (Shared)
    keyboardContainer: {
        // For active state bottom anchor
    },
    activeInputWrapper: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    attachButton: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        height: 40,
    },
    micButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
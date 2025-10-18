import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

type PromptSummary = {
  id: string;
  title: string;
  description: string;
  type: string;
  language: string;
};

export default function Main() {
  const [prompts, setPrompts] = useState<PromptSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "prompts"));
        const data: PromptSummary[] = snapshot.docs.map((doc) => {
          const d = doc.data() as any;
          return {
            id: doc.id,
            title: d.title || "Untitled",
            description: d.description || "",
            type: d.type || "unknown",
            language: d.language || "en",
          };
        });
        setPrompts(data);
      } catch (err) {
        console.error("Error fetching prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const renderItem = ({ item, index }: { item: PromptSummary; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        delay: index * 100,
        type: "timing",
        duration: 800,
      }}
    >
      <Pressable
        onPress={() => router.push(`/process/${item.id}`)}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.tagContainer}>
          <Text style={styles.tag}>{item.type}</Text>
          <Text style={styles.tag}>{item.language.toUpperCase()}</Text>
        </View>
      </Pressable>
    </MotiView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aaa" />
        <Text style={styles.loadingText}>Loading processes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={prompts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
  },
  listContent: {
    paddingTop: Platform.OS === "ios" ? 70 : 50,
    paddingBottom: 100,
    paddingHorizontal: 18,
    gap: 14,
  },
  card: {
    backgroundColor: "#161616",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#222",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#a8a8a8",
  },
  tagContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  tag: {
    backgroundColor: "#232323",
    color: "#ccc",
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#888",
    marginTop: 10,
  },
});

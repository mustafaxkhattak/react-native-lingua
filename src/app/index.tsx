import { useAuth } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/onboarding");
    } catch {
      Alert.alert("Sign out failed", "Please try again.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Your language journey continues here.</Text>
      <Pressable onPress={() => void handleSignOut()} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "#0d132b",
  },
  subtitle: {
    marginTop: 8,
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#68738c",
    textAlign: "center",
  },
  signOutButton: {
    marginTop: 28,
    minWidth: 140,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#6c4ef5",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  signOutText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },
});

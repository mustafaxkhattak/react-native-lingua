import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="typetext-center-mt-90 text-xl text-indigo-600">
        Duolingo Clone khttak bin qasim
      </Text>
      <Text>mustafa bin qasim</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

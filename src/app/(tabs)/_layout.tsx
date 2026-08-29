import { Tabs } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  TabAITeacherIcon,
  TabChatIcon,
  TabHomeIcon,
  TabLearnIcon,
  TabProfileIcon,
} from "@/components/ui/icons";

type TabRoute = {
  key: string;
  name: string;
  params?: object;
};

type CustomTabBarProps = {
  state: {
    index: number;
    routes: TabRoute[];
  };
  navigation: {
    navigate: (name: string, params?: object) => void;
  };
};

const tabsConfig = [
  {
    name: "home",
    label: "Home",
    renderIcon: (color: string) => <TabHomeIcon size={22} color={color} />,
  },
  {
    name: "learn",
    label: "Learn",
    renderIcon: (color: string) => <TabLearnIcon size={22} color={color} />,
  },
  {
    name: "ai-teacher",
    label: "AI Teacher",
    renderIcon: (color: string) => <TabAITeacherIcon size={22} color={color} />,
  },
  {
    name: "chat",
    label: "Chat",
    renderIcon: (color: string) => <TabChatIcon size={22} color={color} />,
  },
  {
    name: "profile",
    label: "Profile",
    renderIcon: (color: string) => <TabProfileIcon size={22} color={color} />,
  },
];

function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  const visibleRoutes = state.routes.filter(
    (route) => route.name !== "index" && tabsConfig.some((t) => t.name === route.name),
  );

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: bottomPadding },
      ]}
    >
      <View className="flex-row items-center justify-around px-2 pt-2.5">
        {visibleRoutes.map((route: TabRoute) => {
          const currentRouteName = state.routes[state.index]?.name;
          const isActive =
            route.name === currentRouteName ||
            (currentRouteName === "index" && route.name === "home");
          const config = tabsConfig.find((tab) => tab.name === route.name) ?? tabsConfig[0];
          const activeColor = isActive ? "#5e54eb" : "#8a92a6";

          const handlePress = () => {
            if (!isActive) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={handlePress}
              unstable_pressDelay={0}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={config.label}
              className="flex-1 items-center justify-center py-1 active:opacity-70"
            >
              <View className="items-center justify-center gap-1.5">
                {config.renderIcon(activeColor)}
                <Text
                  style={{
                    color: activeColor,
                    fontSize: 11,
                    fontWeight: isActive ? "600" : "500",
                    fontFamily: "Poppins",
                  }}
                >
                  {config.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="ai-teacher" options={{ title: "AI Teacher" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f2f6",
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
});

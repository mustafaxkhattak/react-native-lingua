import { useSSO, useSignIn, useSignUp } from "@clerk/expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { VerificationModal } from "@/components/auth/verification-modal";
import { images } from "@/constants/images";

type AuthMode = "sign-up" | "sign-in";

type AuthScreenProps = {
  mode: AuthMode;
};

const socialOptions = [
  { label: "Continue with Google", mark: "G", markClass: "text-[#4285f4]", strategy: "oauth_google" as const },
  { label: "Continue with Facebook", mark: "f", markClass: "text-[#1877f2]", strategy: "oauth_facebook" as const },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthScreen({ mode }: AuthScreenProps) {
  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const { height } = useWindowDimensions();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [verificationType, setVerificationType] = useState<"sign-up" | "sign-in">("sign-up");
  const isSignUp = mode === "sign-up";
  const isCompact = height < 760;

  function showClerkError(error: unknown) {
    if (typeof error === "object" && error !== null) {
      if ("longMessage" in error && typeof error.longMessage === "string") {
        Alert.alert("Authentication error", error.longMessage);
        return;
      }

      if ("errors" in error && Array.isArray(error.errors)) {
        const firstError = error.errors[0];
        if (typeof firstError === "object" && firstError !== null) {
          if ("longMessage" in firstError && typeof firstError.longMessage === "string") {
            Alert.alert("Authentication error", firstError.longMessage);
            return;
          }

          if ("message" in firstError && typeof firstError.message === "string") {
            Alert.alert("Authentication error", firstError.message);
            return;
          }
        }
      }
    }

    if (error instanceof Error) {
      Alert.alert("Authentication error", error.message);
      return;
    }

    Alert.alert("Authentication error", "We could not complete authentication. Please try again.");
  }

  async function handleAuthPress() {
    try {
      const normalizedEmail = email.trim();

      if (!emailPattern.test(normalizedEmail)) {
        Alert.alert("Invalid email", "Please enter a valid email");
        emailInputRef.current?.focus();
        return;
      }

      if (isSignUp && password.length < 8) {
        Alert.alert("Invalid password", "Your password must be at least 8 characters");
        passwordInputRef.current?.focus();
        return;
      }

      setEmail(normalizedEmail);

      if (isSignUp) {
        const { error } = await signUp.password({ emailAddress: normalizedEmail, password });
        if (error) {
          showClerkError(error);
          return;
        }

        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) {
          showClerkError(sendError);
          return;
        }

        setVerificationType("sign-up");
        setVerificationVisible(true);
        return;
      }

      const { error } = await signIn.emailCode.sendCode({ emailAddress: normalizedEmail });
      if (error) {
        showClerkError(error);
        return;
      }

      setVerificationType("sign-in");
      setVerificationVisible(true);
    } catch (error) {
      showClerkError(error);
    }
  }

  async function handleSocialPress(strategy: (typeof socialOptions)[number]["strategy"]) {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (error) {
      showClerkError(error);
    }
  }

  async function handleVerification(code: string) {
    if (verificationType === "sign-up") {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        showClerkError(error);
        return false;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        showClerkError(finalizeError);
        return false;
      }
    } else {
      const { error } = await signIn.emailCode.verifyCode({ code });
      if (error) {
        showClerkError(error);
        return false;
      }

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        showClerkError(finalizeError);
        return false;
      }
    }

    setVerificationVisible(false);
    router.replace("/");
    return true;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1 px-11"
        contentContainerStyle={[styles.content, isCompact && styles.compactContent]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        nestedScrollEnabled
        alwaysBounceVertical
        showsVerticalScrollIndicator={false}
      >

        <Pressable onPress={() => router.replace("/onboarding")} className={`${isCompact ? "h-8" : "h-10"} w-10 items-start justify-center`}>
          <View style={styles.backChevron} />
        </Pressable>

        <Text className={`${isCompact ? "mt-3 text-[28px] leading-[35px]" : "mt-8 text-[34px] leading-[42px]"} font-sans text-text-primary`} style={styles.boldText}>
          {isSignUp ? "Create your account" : "Welcome back"}
        </Text>
        <Text className={`${isCompact ? "mt-1 text-[15px] leading-[22px]" : "mt-3 text-[17px] leading-[26px]"} font-sans text-[#5f6b86]`}>
          {isSignUp ? "Start your language journey today ✨" : "Continue your language journey ✨"}
        </Text>

        <View className={`${isCompact ? "mt-2" : "mt-7"} items-center`} style={[styles.artworkWrap, isCompact && styles.compactArtworkWrap]}>
          <Image
            source={images.mascotAuth}
            contentFit="contain"
            style={[styles.artwork, isCompact && styles.compactArtwork]}
            accessibilityLabel="Smiling fox language teacher"
          />
        </View>

        <Pressable
          onPress={() => emailInputRef.current?.focus()}
          className={`${isCompact ? "py-3" : "py-4"} mt-1 rounded-[20px] border border-[#e7e9ef] px-6`}
          style={[styles.field, isCompact && styles.compactField]}
        >
          <Text className="font-sans text-[14px] text-[#68738c]">Email</Text>
          <TextInput
            ref={emailInputRef}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            showSoftInputOnFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="mustafa@gmail"
            placeholderTextColor="#0d132b"
            style={styles.input}
            accessibilityLabel="Email"
          />
        </Pressable>

        {isSignUp && (
          <Pressable
            onPress={() => passwordInputRef.current?.focus()}
            className={`${isCompact ? "py-3" : "py-4"} mt-3 rounded-[20px] border border-[#e7e9ef] px-6`}
            style={[styles.field, isCompact && styles.compactField]}
          >
            <Text className="font-sans text-[14px] text-[#68738c]">Password</Text>
            <View className="flex-row items-center">
              <TextInput
                ref={passwordInputRef}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={passwordVisible ? "#6c4ef5" : "transparent"}
                caretHidden={!passwordVisible}
                style={passwordVisible ? styles.passwordInput : styles.hiddenPasswordInput}
                accessibilityLabel="Password"
              />
              {!passwordVisible && (
                <Text pointerEvents="none" className="absolute left-0 font-sans text-[16px] text-text-primary">
                  {password ? "•".repeat(password.length) : "Create a password"}
                </Text>
              )}
              <Pressable
                onPress={() => setPasswordVisible((visible) => !visible)}
                className="ml-3 px-1 py-1"
                accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
                accessibilityRole="button"
              >
                <Text className="font-sans text-[12px] font-medium text-brand-purple">
                  {passwordVisible ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>
            <Text className="mt-1 font-sans text-[12px] text-[#68738c]">At least 8 characters</Text>
          </Pressable>
        )}

        <Pressable
          onPress={handleAuthPress}
          disabled={signInFetchStatus === "fetching" || signUpFetchStatus === "fetching"}
          className={`${isCompact ? "mt-3 h-[58px]" : "mt-5 h-[82px]"} items-center justify-center rounded-[20px] bg-brand-purple active:bg-brand-deep-purple`}
          style={styles.primaryButton}
        >
          <Text className={`${isCompact ? "text-[18px]" : "text-[20px]"} font-sans font-semibold text-white`}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
        </Pressable>

        <View className={`${isCompact ? "my-3" : "my-7"} flex-row items-center`}>
          <View className="h-px flex-1 bg-[#e5e7eb]" />
          <Text className={`${isCompact ? "mx-3 text-[13px]" : "mx-5 text-[15px]"} font-sans text-[#68738c]`}>or continue with</Text>
          <View className="h-px flex-1 bg-[#e5e7eb]" />
        </View>

        <View className={isCompact ? "gap-2" : "gap-3"}>
          {socialOptions.map((social, index) => (
            <View key={social.label}>
              <Pressable
                onPress={() => void handleSocialPress(social.strategy)}
                disabled={signInFetchStatus === "fetching" || signUpFetchStatus === "fetching"}
                className={`${isCompact ? "h-[52px] px-8" : "h-[64px] px-12"} flex-row items-center rounded-[18px] border border-[#eceef2]`}
              >
                <Text className={`${isCompact ? "text-[21px]" : "text-[25px]"} w-10 text-center font-sans font-semibold ${social.markClass}`}>
                  {social.mark}
                </Text>
                <Text className={`${isCompact ? "ml-2 text-[14px]" : "ml-4 text-[16px]"} font-sans text-text-primary`}>{social.label}</Text>
              </Pressable>
              {index === 1 && (
                <View className={`${isCompact ? "mt-3" : "mt-6"} px-2`}>
                  <Text className={`${isCompact ? "text-[14px] leading-[20px]" : "text-[15px] leading-[23px]"} text-center font-sans text-[#68738c]`}>
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <Text
                      onPress={() => router.replace(isSignUp ? "/sign-in" : "/sign-up")}
                      className={`${isCompact ? "text-[14px]" : "text-[15px]"} font-sans font-medium text-brand-purple`}
                    >
                      {isSignUp ? "Log in" : "Sign up"}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <VerificationModal
        visible={verificationVisible}
        email={email}
        onClose={() => setVerificationVisible(false)}
        onVerify={handleVerification}
      />
      {isSignUp && <View nativeID="clerk-captcha" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flexGrow: 1,
    paddingTop: 14,
    paddingBottom: 10,
  },
  compactContent: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  boldText: {
    fontFamily: "Poppins-Bold",
  },
  backChevron: {
    width: 15,
    height: 15,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: "#0d132b",
    transform: [{ rotate: "45deg" }],
    marginLeft: 5,
  },
  artworkWrap: {
    height: 176,
    justifyContent: "center",
  },
  compactArtworkWrap: {
    height: 112,
  },
  artwork: {
    width: 270,
    height: 205,
  },
  compactArtwork: {
    width: 190,
    height: 145,
  },
  field: {
    height: 84,
  },
  compactField: {
    height: 68,
  },
  input: {
    color: "#0d132b",
    fontFamily: "Poppins",
    fontSize: 16,
    paddingVertical: 3,
  },
  passwordInput: {
    flex: 1,
    color: "#0d132b",
    fontFamily: "Poppins",
    fontSize: 16,
    paddingVertical: 3,
  },
  hiddenPasswordInput: {
    flex: 1,
    color: "transparent",
    opacity: 0,
    fontSize: 16,
    paddingVertical: 3,
  },
  primaryButton: {
    shadowColor: "#6c4ef5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
});
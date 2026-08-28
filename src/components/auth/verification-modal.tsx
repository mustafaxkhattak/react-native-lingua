import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onComplete: () => void;
};

export function VerificationModal({
  visible,
  email,
  onClose,
  onComplete,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      const focusTimer = setTimeout(() => {
        setCode("");
        inputRef.current?.focus();
      }, 250);
      return () => clearTimeout(focusTimer);
    }
  }, [visible]);

  function handleCodeChange(value: string) {
    const nextCode = value.replace(/\D/g, "").slice(0, 6);
    setCode(nextCode);
    if (nextCode.length === 6) {
      onComplete();
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.modalRoot}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View className="mx-6 rounded-[24px] bg-white px-6 pb-7 pt-8" style={styles.sheet}>
          <View className="mb-5 h-1 w-12 self-center rounded-full bg-[#e5e7eb]" />
          <Text className="font-sans text-[25px] font-semibold text-text-primary">
            Check your email
          </Text>
          <Text className="mt-2 font-sans text-[15px] leading-[23px] text-text-secondary">
            We sent a verification email to {email || "your email address"}. Enter the 6-digit code to continue.
          </Text>

          <Pressable onPress={() => inputRef.current?.focus()} className="mt-6">
            <View className="flex-row justify-between">
              {Array.from({ length: 6 }, (_, index) => (
                <View
                  key={index}
                  className={`h-14 w-[43px] items-center justify-center rounded-[12px] border ${index < code.length ? "border-brand-purple" : "border-[#e5e7eb]"}`}
                >
                  <Text className="font-sans text-[22px] font-semibold text-text-primary">
                    {code[index] || ""}
                  </Text>
                </View>
              ))}
            </View>
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus={false}
              caretHidden
              style={styles.hiddenInput}
              accessibilityLabel="Verification code"
            />
          </Pressable>

          <Pressable onPress={onClose} className="mt-6 items-center py-2">
            <Text className="font-sans text-[15px] font-medium text-brand-purple">
              Use a different email
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(13, 19, 43, 0.42)",
  },
  sheet: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  hiddenInput: {
    position: "absolute",
    height: 1,
    width: 1,
    opacity: 0,
  },
});
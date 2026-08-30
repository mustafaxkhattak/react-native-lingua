import React from "react";
import { View } from "react-native";

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Top bar Bell Icon (Outline notification bell)
 */
export function BellIcon({ size = 24, color = "#1c2136" }: IconProps) {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Top hanger loop */}
      <View
        style={{
          width: 4 * scale,
          height: 3 * scale,
          borderTopLeftRadius: 2 * scale,
          borderTopRightRadius: 2 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          borderBottomWidth: 0,
          marginBottom: -1 * scale,
        }}
      />
      {/* Bell dome */}
      <View
        style={{
          width: 15 * scale,
          height: 13 * scale,
          borderTopLeftRadius: 7.5 * scale,
          borderTopRightRadius: 7.5 * scale,
          borderBottomLeftRadius: 3 * scale,
          borderBottomRightRadius: 3 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          backgroundColor: "transparent",
        }}
      />
      {/* Bell bottom flared rim */}
      <View
        style={{
          width: 18 * scale,
          height: 2 * scale,
          backgroundColor: color,
          borderRadius: 1 * scale,
          marginTop: -1.5 * scale,
        }}
      />
      {/* Bell clapper */}
      <View
        style={{
          width: 4 * scale,
          height: 2.8 * scale,
          borderBottomLeftRadius: 2 * scale,
          borderBottomRightRadius: 2 * scale,
          backgroundColor: color,
          marginTop: 0.5 * scale,
        }}
      />
    </View>
  );
}

/**
 * White Open Book Icon (for Lesson item)
 */
export function BookIcon({ size = 22, color = "#ffffff" }: IconProps) {
  const scale = size / 22;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Left page */}
        <View
          style={{
            width: 8.5 * scale,
            height: 12.5 * scale,
            borderTopLeftRadius: 3.5 * scale,
            borderBottomLeftRadius: 3.5 * scale,
            borderWidth: 2 * scale,
            borderColor: color,
            borderRightWidth: 1 * scale,
            marginRight: 0.5 * scale,
          }}
        />
        {/* Right page */}
        <View
          style={{
            width: 8.5 * scale,
            height: 12.5 * scale,
            borderTopRightRadius: 3.5 * scale,
            borderBottomRightRadius: 3.5 * scale,
            borderWidth: 2 * scale,
            borderColor: color,
            borderLeftWidth: 1 * scale,
            marginLeft: 0.5 * scale,
          }}
        />
      </View>
    </View>
  );
}

/**
 * White Headphones Icon (for AI Conversation item)
 */
export function HeadphonesIcon({ size = 22, color = "#ffffff" }: IconProps) {
  const scale = size / 22;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Headband arch */}
      <View
        style={{
          width: 17 * scale,
          height: 12 * scale,
          borderTopLeftRadius: 8.5 * scale,
          borderTopRightRadius: 8.5 * scale,
          borderWidth: 2.2 * scale,
          borderColor: color,
          borderBottomWidth: 0,
          marginBottom: -4 * scale,
        }}
      />
      {/* Earcups container */}
      <View style={{ width: 18 * scale, flexDirection: "row", justifyContent: "space-between" }}>
        {/* Left earcup */}
        <View
          style={{
            width: 4.5 * scale,
            height: 8.5 * scale,
            borderRadius: 2.5 * scale,
            backgroundColor: color,
          }}
        />
        {/* Right earcup */}
        <View
          style={{
            width: 4.5 * scale,
            height: 8.5 * scale,
            borderRadius: 2.5 * scale,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

/**
 * White Mascot / Word Icon (for New words item)
 */
export function WordsIcon({ size = 24, color = "#ffffff" }: IconProps) {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Mascot / Robot head container */}
      <View
        style={{
          width: 16 * scale,
          height: 14 * scale,
          borderRadius: 4.5 * scale,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Eyes row */}
        <View style={{ flexDirection: "row", gap: 3.5 * scale, marginTop: 1 * scale }}>
          <View style={{ width: 2.5 * scale, height: 2.5 * scale, borderRadius: 1.5 * scale, backgroundColor: "#f87171" }} />
          <View style={{ width: 2.5 * scale, height: 2.5 * scale, borderRadius: 1.5 * scale, backgroundColor: "#f87171" }} />
        </View>
        {/* Smile mouth */}
        <View
          style={{
            width: 5 * scale,
            height: 2 * scale,
            borderBottomLeftRadius: 2.5 * scale,
            borderBottomRightRadius: 2.5 * scale,
            backgroundColor: "#f87171",
            marginTop: 1.5 * scale,
          }}
        />
      </View>
    </View>
  );
}

/**
 * White Video Camera Icon (for Next Up call button)
 */
export function VideoCameraIcon({ size = 22, color = "#ffffff" }: IconProps) {
  const scale = size / 22;

  return (
    <View style={{ width: size, height: size, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      {/* Camera Body */}
      <View
        style={{
          width: 12 * scale,
          height: 9.5 * scale,
          borderRadius: 2.5 * scale,
          backgroundColor: color,
        }}
      />
      {/* Camera Lens */}
      <View
        style={{
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderStyle: "solid",
          borderTopWidth: 3.8 * scale,
          borderBottomWidth: 3.8 * scale,
          borderRightWidth: 5 * scale,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderRightColor: color,
          transform: [{ rotate: "180deg" }],
          marginLeft: 1.5 * scale,
        }}
      />
    </View>
  );
}

/**
 * Checkmark Icon
 */
export function CheckmarkIcon({ size = 12, color = "#ffffff" }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.45,
          height: size * 0.75,
          borderBottomWidth: 2.2,
          borderRightWidth: 2.2,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
          marginBottom: 2,
        }}
      />
    </View>
  );
}

/**
 * Tab: Home Icon
 */
export function TabHomeIcon({ size = 22, color = "#5e54eb" }: IconProps) {
  const scale = size / 22;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Roof */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 9 * scale,
          borderRightWidth: 9 * scale,
          borderBottomWidth: 7.5 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
        }}
      />
      {/* Base */}
      <View
        style={{
          width: 14 * scale,
          height: 9.5 * scale,
          borderBottomLeftRadius: 2.5 * scale,
          borderBottomRightRadius: 2.5 * scale,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* Door cutout */}
        <View
          style={{
            width: 4.5 * scale,
            height: 5 * scale,
            borderTopLeftRadius: 2 * scale,
            borderTopRightRadius: 2 * scale,
            backgroundColor: "#ffffff",
          }}
        />
      </View>
    </View>
  );
}

/**
 * Tab: Learn Icon (Open Book)
 */
export function TabLearnIcon({ size = 22, color = "#8a92a6" }: IconProps) {
  const scale = size / 22;

  return (
    <View style={{ width: size, height: size, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: 7.5 * scale,
          height: 12 * scale,
          borderTopLeftRadius: 3 * scale,
          borderBottomLeftRadius: 2 * scale,
          borderTopRightRadius: 1 * scale,
          borderBottomRightRadius: 1 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          marginRight: 1 * scale,
        }}
      />
      <View
        style={{
          width: 7.5 * scale,
          height: 12 * scale,
          borderTopRightRadius: 3 * scale,
          borderBottomRightRadius: 2 * scale,
          borderTopLeftRadius: 1 * scale,
          borderBottomLeftRadius: 1 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          marginLeft: 1 * scale,
        }}
      />
    </View>
  );
}

/**
 * Tab: AI Teacher Icon
 */
export function TabAITeacherIcon({ size = 22, color = "#8a92a6" }: IconProps) {
  const scale = size / 22;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Mascot outline head */}
      <View
        style={{
          width: 17 * scale,
          height: 15 * scale,
          borderRadius: 6 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Eyes */}
        <View style={{ flexDirection: "row", gap: 3 * scale }}>
          <View style={{ width: 2.2 * scale, height: 2.2 * scale, borderRadius: 1.1 * scale, backgroundColor: color }} />
          <View style={{ width: 2.2 * scale, height: 2.2 * scale, borderRadius: 1.1 * scale, backgroundColor: color }} />
        </View>
        {/* Mouth */}
        <View
          style={{
            width: 4 * scale,
            height: 1.8 * scale,
            borderBottomWidth: 1.5 * scale,
            borderColor: color,
            borderRadius: 1 * scale,
            marginTop: 1 * scale,
          }}
        />
      </View>
    </View>
  );
}

/**
 * Tab: Chat Icon
 */
export function TabChatIcon({ size = 22, color = "#8a92a6" }: IconProps) {
  const scale = size / 22;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: 17 * scale,
          height: 14 * scale,
          borderRadius: 6 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      {/* Chat tail */}
      <View
        style={{
          position: "absolute",
          bottom: 2 * scale,
          left: 4 * scale,
          width: 4 * scale,
          height: 4 * scale,
          borderBottomWidth: 1.8 * scale,
          borderLeftWidth: 1.8 * scale,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
          backgroundColor: "#ffffff",
        }}
      />
    </View>
  );
}

/**
 * Tab: Profile Icon
 */
export function TabProfileIcon({ size = 22, color = "#8a92a6" }: IconProps) {
  const scale = size / 22;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Head circle */}
      <View
        style={{
          width: 7 * scale,
          height: 7 * scale,
          borderRadius: 3.5 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          marginBottom: 1 * scale,
        }}
      />
      {/* Shoulders / body */}
      <View
        style={{
          width: 15 * scale,
          height: 6.5 * scale,
          borderTopLeftRadius: 7 * scale,
          borderTopRightRadius: 7 * scale,
          borderWidth: 1.8 * scale,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
    </View>
  );
}

/**
 * Top bar Navigation Back Chevron (<)
 */
export function ChevronLeftIcon({ size = 24, color = "#1c2136" }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderLeftWidth: 2.8,
          borderBottomWidth: 2.8,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
          marginLeft: size * 0.15,
        }}
      />
    </View>
  );
}

/**
 * Bookmark Ribbon Icon (with orange/gold border and banner notch)
 */
export function BookmarkRibbonIcon({
  size = 24,
  color = "#ff8a00",
  filled = false,
}: IconProps & { filled?: boolean }) {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: 18 * scale,
          height: 22 * scale,
          borderTopLeftRadius: 4 * scale,
          borderTopRightRadius: 4 * scale,
          borderBottomLeftRadius: 2 * scale,
          borderBottomRightRadius: 2 * scale,
          borderWidth: 2.2 * scale,
          borderColor: color,
          backgroundColor: filled ? color : "#ffffff",
          alignItems: "center",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Bottom notch cutout */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 7 * scale,
            borderRightWidth: 7 * scale,
            borderBottomWidth: 5.5 * scale,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "#ffffff",
            marginBottom: -1,
          }}
        />
      </View>
    </View>
  );
}

/**
 * Lock Outline Icon (for locked / upcoming lessons)
 */
export function LockOutlineIcon({ size = 20, color = "#8a92a6" }: IconProps) {
  const scale = size / 20;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Shackle arch */}
      <View
        style={{
          width: 10 * scale,
          height: 8 * scale,
          borderTopLeftRadius: 5 * scale,
          borderTopRightRadius: 5 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          borderBottomWidth: 0,
          marginBottom: -1 * scale,
        }}
      />
      {/* Padlock body */}
      <View
        style={{
          width: 14 * scale,
          height: 10.5 * scale,
          borderRadius: 3 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Keyhole dot */}
        <View
          style={{
            width: 2.2 * scale,
            height: 2.2 * scale,
            borderRadius: 1.1 * scale,
            backgroundColor: color,
          }}
        />
        {/* Keyhole slot */}
        <View
          style={{
            width: 1.4 * scale,
            height: 2.5 * scale,
            backgroundColor: color,
            marginTop: 0.5 * scale,
          }}
        />
      </View>
    </View>
  );
}

/**
 * Green Circular Completed Checkmark Badge
 */
export function CheckCircleBadge({ size = 24 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#48bb78",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#48bb78",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: size * 0.35,
          height: size * 0.6,
          borderBottomWidth: 2.4,
          borderRightWidth: 2.4,
          borderColor: "#ffffff",
          transform: [{ rotate: "45deg" }],
          marginBottom: size * 0.1,
        }}
      />
    </View>
  );
}

/**
 * Top bar Navigation Forward Chevron (>)
 */
export function ChevronRightIcon({ size = 24, color = "#8a92a6" }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.38,
          height: size * 0.38,
          borderTopWidth: 2.4,
          borderRightWidth: 2.4,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
          marginRight: size * 0.1,
        }}
      />
    </View>
  );
}

/**
 * Play Circle Badge (for ready to learn / unlocked lessons)
 */
export function PlayCircleBadge({ size = 28 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#f4f3ff",
        borderWidth: 1.5,
        borderColor: "#c4b5fd",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.32,
          borderTopWidth: size * 0.2,
          borderBottomWidth: size * 0.2,
          borderLeftColor: "#5e54eb",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          marginLeft: size * 0.08,
        }}
      />
    </View>
  );
}

/**
 * Microphone Icon for Audio Controls
 */
export function MicControlIcon({ size = 24, color = "#1c2136" }: IconProps) {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Mic Capsule */}
      <View
        style={{
          width: 9 * scale,
          height: 14 * scale,
          borderRadius: 4.5 * scale,
          backgroundColor: color,
          marginBottom: 1 * scale,
        }}
      />
      {/* Mic Cradle / Arc */}
      <View
        style={{
          position: "absolute",
          top: 4.5 * scale,
          width: 15 * scale,
          height: 11 * scale,
          borderBottomLeftRadius: 7.5 * scale,
          borderBottomRightRadius: 7.5 * scale,
          borderWidth: 2 * scale,
          borderTopWidth: 0,
          borderColor: color,
        }}
      />
      {/* Mic Stem */}
      <View
        style={{
          position: "absolute",
          bottom: 2 * scale,
          width: 2 * scale,
          height: 4 * scale,
          backgroundColor: color,
        }}
      />
      {/* Mic Base */}
      <View
        style={{
          position: "absolute",
          bottom: 1.5 * scale,
          width: 9 * scale,
          height: 2 * scale,
          borderRadius: 1 * scale,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

/**
 * Microphone Off / Muted Icon
 */
export function MicOffControlIcon({ size = 24, color = "#ef4444" }: IconProps) {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <MicControlIcon size={size} color={color} />
      {/* Red diagonal slash */}
      <View
        style={{
          position: "absolute",
          width: 2.2 * scale,
          height: 22 * scale,
          backgroundColor: color,
          transform: [{ rotate: "-45deg" }],
          borderRadius: 1 * scale,
        }}
      />
    </View>
  );
}

/**
 * Subtitles / Translation Icon (文A / Subtitles)
 */
export function SubtitlesControlIcon({ size = 24, color = "#1c2136" }: IconProps) {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Outer subtle frame */}
      <View
        style={{
          width: 22 * scale,
          height: 20 * scale,
          borderRadius: 4 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Horizontal top line of '文' */}
        <View
          style={{
            width: 14 * scale,
            height: 1.6 * scale,
            backgroundColor: color,
            borderRadius: 0.8 * scale,
            marginBottom: 2 * scale,
          }}
        />
        {/* Center dot/short line */}
        <View
          style={{
            width: 2 * scale,
            height: 2 * scale,
            borderRadius: 1 * scale,
            backgroundColor: color,
            marginBottom: 1.5 * scale,
          }}
        />
        {/* Two subtitle lines */}
        <View style={{ flexDirection: "row", gap: 2 * scale }}>
          <View
            style={{
              width: 6 * scale,
              height: 1.6 * scale,
              backgroundColor: color,
              borderRadius: 0.8 * scale,
            }}
          />
          <View
            style={{
              width: 6 * scale,
              height: 1.6 * scale,
              backgroundColor: color,
              borderRadius: 0.8 * scale,
            }}
          />
        </View>
      </View>
    </View>
  );
}

/**
 * Phone Hangup Icon (Red End Call Handset)
 */
export function PhoneHangupIcon({ size = 26, color = "#ffffff" }: IconProps) {
  const scale = size / 26;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Downward curved phone handset */}
      <View
        style={{
          width: 18 * scale,
          height: 7.5 * scale,
          borderTopLeftRadius: 9 * scale,
          borderTopRightRadius: 9 * scale,
          backgroundColor: color,
          transform: [{ rotate: "180deg" }],
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            width: 10 * scale,
            height: 3.5 * scale,
            borderTopLeftRadius: 5 * scale,
            borderTopRightRadius: 5 * scale,
            backgroundColor: "#f04438",
          }}
        />
      </View>
      {/* Left earpiece */}
      <View
        style={{
          position: "absolute",
          left: 2 * scale,
          bottom: 6 * scale,
          width: 4.8 * scale,
          height: 6.5 * scale,
          borderRadius: 2 * scale,
          backgroundColor: color,
          transform: [{ rotate: "25deg" }],
        }}
      />
      {/* Right earpiece */}
      <View
        style={{
          position: "absolute",
          right: 2 * scale,
          bottom: 6 * scale,
          width: 4.8 * scale,
          height: 6.5 * scale,
          borderRadius: 2 * scale,
          backgroundColor: color,
          transform: [{ rotate: "-25deg" }],
        }}
      />
    </View>
  );
}

/**
 * Volume Speaker Icon (🔊 Purple audio play icon)
 */
export function VolumeSpeakerIcon({ size = 22, color = "#5e54eb" }: IconProps) {
  const scale = size / 22;
  return (
    <View style={{ width: size, height: size, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      {/* Speaker box */}
      <View
        style={{
          width: 4.5 * scale,
          height: 7.5 * scale,
          backgroundColor: color,
          borderTopLeftRadius: 1.5 * scale,
          borderBottomLeftRadius: 1.5 * scale,
        }}
      />
      {/* Speaker cone */}
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: 5.5 * scale,
          borderBottomWidth: 5.5 * scale,
          borderRightWidth: 6.5 * scale,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderRightColor: color,
        }}
      />
      {/* Sound waves container */}
      <View style={{ width: 6 * scale, height: 14 * scale, marginLeft: 2 * scale, justifyContent: "center" }}>
        {/* Wave 1 */}
        <View
          style={{
            position: "absolute",
            left: 0,
            width: 4 * scale,
            height: 9 * scale,
            borderTopRightRadius: 4.5 * scale,
            borderBottomRightRadius: 4.5 * scale,
            borderRightWidth: 1.8 * scale,
            borderTopWidth: 1.8 * scale,
            borderBottomWidth: 1.8 * scale,
            borderLeftWidth: 0,
            borderColor: color,
          }}
        />
        {/* Wave 2 */}
        <View
          style={{
            position: "absolute",
            left: 2.5 * scale,
            width: 5 * scale,
            height: 14 * scale,
            borderTopRightRadius: 7 * scale,
            borderBottomRightRadius: 7 * scale,
            borderRightWidth: 1.8 * scale,
            borderTopWidth: 1.8 * scale,
            borderBottomWidth: 1.8 * scale,
            borderLeftWidth: 0,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
}

/**
 * AI Bot Avatar Icon for Top Bar Header Button
 */
export function AiBotOutlineIcon({ size = 20, color = "#1c2136" }: IconProps) {
  const scale = size / 20;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Antenna */}
      <View
        style={{
          width: 2 * scale,
          height: 2.5 * scale,
          backgroundColor: color,
          borderTopLeftRadius: 1 * scale,
          borderTopRightRadius: 1 * scale,
        }}
      />
      {/* Head */}
      <View
        style={{
          width: 14 * scale,
          height: 12 * scale,
          borderRadius: 4.5 * scale,
          borderWidth: 1.6 * scale,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Eyes */}
        <View style={{ flexDirection: "row", gap: 3 * scale }}>
          <View style={{ width: 2 * scale, height: 2 * scale, borderRadius: 1 * scale, backgroundColor: color }} />
          <View style={{ width: 2 * scale, height: 2 * scale, borderRadius: 1 * scale, backgroundColor: color }} />
        </View>
      </View>
    </View>
  );
}




// src/components/common/AnimatedCheckbox.tsx
import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AnimatedCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
}

const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onToggle,
  size = 24,
}) => {
  const scaleValue = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const opacityValue = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: checked ? 1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityValue, {
        toValue: checked ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [checked]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: size },
        checked ? styles.checked : styles.unchecked,
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        <Ionicons name="checkmark" size={size * 0.7} color="#FFFFFF" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  unchecked: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AnimatedCheckbox;

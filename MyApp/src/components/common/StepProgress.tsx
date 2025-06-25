// src/components/common/StepProgress.tsx
import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  animatedValue: Animated.Value;
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  animatedValue,
}) => {
  const progressWidth = animatedValue.interpolate({
    inputRange: [0, totalSteps - 1],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.step,
              index <= currentStep ? styles.activeStep : styles.inactiveStep,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  progressBackground: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  step: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  activeStep: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  inactiveStep: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
});

export default StepProgress;

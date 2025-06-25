// src/screens/SignUpScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import { SignUpFormData, SignUpScreenProps } from "../../types/auth";
import AnimatedInput from "../common/AnimatedInput";
import AnimatedCheckbox from "../common/AnimatedCheckBox";
import StepProgress from "../common/StepProgress";
import AnimatedButton from "../common/AnimatedButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const SignUpScreen: React.FC = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {}
  );

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const stepProgress = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(0)).current;

  const totalSteps = 3;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Step progress animation
    Animated.timing(stepProgress, {
      toValue: currentStep,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Form slide animation
    Animated.timing(formSlideAnim, {
      toValue: currentStep * -width,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const handleInputChange = (
    field: keyof SignUpFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = async () => {
    let stepData: any = {};
    if (currentStep === 0) {
      stepData = {
        name: formData.fullName,
        email: formData.email,
      };
    } else if (currentStep === 1) {
      stepData = {
        phone: formData.phone,
        password: formData.password,
      };
    } else if (currentStep === 2) {
      stepData = {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
      };
    }
    try {
      const response = await axios.post(
        "http://192.168.56.1:3000/api/user/validate-step",
        {
          step: currentStep,
          ...stepData,
        }
      );
      const data = response.data;
      if (data.success) {
        setErrorMessages({});
        if (currentStep < totalSteps - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleSignUp();
        }
      } else {
        // Nếu backend trả về lỗi
        Alert.alert("Lỗi", data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Lỗi xác thực từ máy chủ";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.navigate("Login");
    }
  };

  const handleSignUp = async () => {
    setLoading(true);

    // Simulate API call
    try {
      const data = await axios.post(
        "http://192.168.56.1:3000/api/user/register",
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );
      alert(data.data && data.data.message);
      setLoading(false);
      navigation.navigate("Login");
    } catch (error: any) {
      console.log(error);
      alert(error.response.data.message);
      setLoading(false);
    }
    // } finally {
    //   setLoading(false);
    //   navigation.navigate("Login");
    // }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Thông Tin Cá Nhân</Text>
            <Text style={styles.stepSubtitle}>
              Nhập họ tên và email của bạn
            </Text>
            <View style={styles.inputWrapper}>
              <AnimatedInput
                placeholder="Họ và tên"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
                icon="person-outline"
              />

              <AnimatedInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                icon="mail-outline"
              />
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle1}>Thông Tin Liên Hệ</Text>
            <Text style={styles.stepSubtitle1}>Số điện thoại và mật khẩu</Text>

            <View style={styles.inputWrapper}>
              <AnimatedInput
                placeholder="Số điện thoại"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
                icon="call-outline"
              />

              <AnimatedInput
                placeholder="Mật khẩu"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry={!showPassword}
                icon="lock-closed-outline"
                showToggle
                onToggleSecure={() => setShowPassword(!showPassword)}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Xác Nhận Thông Tin</Text>
            <Text style={styles.stepSubtitle2}>
              Xác nhận mật khẩu và điều khoản
            </Text>

            <View style={styles.inputWrapper}>
              <AnimatedInput
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                secureTextEntry={!showConfirmPassword}
                icon="lock-closed-outline"
                showToggle
                onToggleSecure={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              <View style={styles.termsContainer}>
                <AnimatedCheckbox
                  checked={formData.agreeToTerms}
                  onToggle={() =>
                    handleInputChange("agreeToTerms", !formData.agreeToTerms)
                  }
                />
                <Text style={styles.termsText}>
                  Tôi đồng ý với{" "}
                  <Text style={styles.termsLink}>Điều khoản sử dụng</Text> và{" "}
                  <Text style={styles.termsLink}>Chính sách bảo mật</Text>
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <Animated.View
                style={[
                  styles.header,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                  <Text style={styles.title}>Tạo Tài Khoản</Text>
                  <Text style={styles.subtitle}>
                    Bước {currentStep + 1} / {totalSteps}
                  </Text>
                </View>

                <StepProgress
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  animatedValue={stepProgress}
                />
              </Animated.View>

              {/* Form */}
              <Animated.View
                style={[
                  styles.formContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <BlurView intensity={20} style={styles.formBlur}>
                  <Animated.View
                    style={[
                      styles.formSlider,
                      {
                        transform: [{ translateX: formSlideAnim }],
                      },
                    ]}
                  >
                    {Array.from({ length: totalSteps }, (_, index) => (
                      <View key={index} style={styles.formStep}>
                        {index === currentStep && renderStepContent()}
                      </View>
                    ))}
                  </Animated.View>

                  <View style={styles.buttonContainer}>
                    <AnimatedButton
                      title={
                        currentStep === totalSteps - 1
                          ? "Tạo Tài Khoản"
                          : "Tiếp Theo"
                      }
                      onPress={handleNext}
                      loading={loading}
                    />

                    {currentStep > 0 && (
                      <TouchableOpacity
                        style={styles.backTextButton}
                        onPress={handleBack}
                      >
                        <Text style={styles.backTextButtonText}>Quay lại</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Social Login */}
                  {currentStep === 0 && (
                    <>
                      <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Hoặc</Text>
                        <View style={styles.dividerLine} />
                      </View>

                      <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                          <Ionicons
                            name="logo-google"
                            size={24}
                            color="#DB4437"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialButton}>
                          <Ionicons
                            name="logo-facebook"
                            size={24}
                            color="#4267B2"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialButton}>
                          <Ionicons
                            name="logo-apple"
                            size={24}
                            color="#000000"
                          />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </BlurView>
              </Animated.View>

              {/* Footer */}
              <Animated.View
                style={[
                  styles.footer,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <Text style={styles.footerText}>
                  Đã có tài khoản?{" "}
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigation.navigate("Login")}
                  >
                    Đăng nhập ngay
                  </Text>
                </Text>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    // paddingHorizontal: 20,
    // marginHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E5E7EB",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  formBlur: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
  },
  formSlider: {
    flexDirection: "row",
    width: width * 3,
  },
  formStep: {
    width: width,

    // paddingHorizontal: 20,
    // paddingVertical: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    // textAlign: "center",
    marginLeft: 60,
  },
  stepSubtitle: {
    fontSize: 16,
    color: "#E5E7EB",
    // textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    marginLeft: 60,
  },
  stepTitle1: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    // textAlign: "center",
    marginLeft: 70,
  },
  stepSubtitle1: {
    fontSize: 16,
    color: "#E5E7EB",
    // textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    marginLeft: 77,
  },
  stepSubtitle2: {
    fontSize: 16,
    color: "#E5E7EB",
    // textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
    marginLeft: 50,
  },
  inputWrapper: {
    paddingRight: 40,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backTextButton: {
    alignItems: "center",
    marginTop: 16,
  },
  backTextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    paddingHorizontal: 4,
  },
  termsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  termsLink: {
    color: "#FFFFFF",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    color: "#E5E7EB",
    fontSize: 16,
  },
  loginLink: {
    color: "#FFFFFF",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;

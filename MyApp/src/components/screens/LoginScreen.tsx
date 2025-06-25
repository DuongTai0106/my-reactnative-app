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
import { LoginFormData, LoginScreenProps } from "../../types/auth";
import AnimatedInput from "../common/AnimatedInput";
import AnimatedButton from "../common/AnimatedButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

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
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.56.1:3000/api/user/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );
      const data = response.data;
      if (data.success) {
        Alert.alert("Thành công", data.message);
        setLoading(false);
      } else {
        return Alert.alert("Thất bại", data.message);
      }
    } catch (error: any) {
      Alert.alert("Thất bại", error.response.data.message);
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert("Thông báo", `Đăng nhập với ${provider}`);
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
                    transform: [
                      { translateY: slideAnim },
                      { scale: logoScale },
                    ],
                  },
                ]}
              >
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={["#FFFFFF", "#F3F4F6"]}
                    style={styles.logoBackground}
                  >
                    <Ionicons name="rocket" size={40} color="#6366F1" />
                  </LinearGradient>
                </View>
                <Text style={styles.title}>Chào Mừng Trở Lại</Text>
                <Text style={styles.subtitle}>
                  Đăng nhập để tiếp tục hành trình của bạn
                </Text>
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
                  <View style={styles.form}>
                    <AnimatedInput
                      placeholder="Email"
                      value={formData.email}
                      onChangeText={(value) =>
                        handleInputChange("email", value)
                      }
                      keyboardType="email-address"
                      icon="mail-outline"
                    />

                    <AnimatedInput
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChangeText={(value) =>
                        handleInputChange("password", value)
                      }
                      secureTextEntry={!showPassword}
                      icon="lock-closed-outline"
                      showToggle
                      onToggleSecure={() => setShowPassword(!showPassword)}
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                      <Text style={styles.forgotPasswordText}>
                        Quên mật khẩu?
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                      <AnimatedButton
                        title="Đăng Nhập"
                        onPress={handleLogin}
                        loading={loading}
                      />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>Hoặc</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialContainer}>
                      <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin("Google")}
                      >
                        <Ionicons
                          name="logo-google"
                          size={24}
                          color="#DB4437"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin("Facebook")}
                      >
                        <Ionicons
                          name="logo-facebook"
                          size={24}
                          color="#4267B2"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin("Apple")}
                      >
                        <Ionicons name="logo-apple" size={24} color="#000000" />
                      </TouchableOpacity>
                    </View>
                  </View>
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
                  Chưa có tài khoản?{" "}
                  <Text
                    style={styles.signUpLink}
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    Đăng ký ngay
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E5E7EB",
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  formBlur: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  form: {
    padding: 24,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
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
  signUpLink: {
    color: "#FFFFFF",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;

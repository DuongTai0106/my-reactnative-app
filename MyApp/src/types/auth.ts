export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginScreenProps {
  navigation: any;
}

export interface AnimatedInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  icon: string;
  onToggleSecure?: () => void;
  showToggle?: boolean;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface SignUpScreenProps {
  navigation: any;
}

export interface FormStepProps {
  currentStep: number;
  totalSteps: number;
}

import React, { useEffect, useState } from "react";
import { Alert, View, StyleSheet, ScrollView } from "react-native";
import {
  HelperText,
  Text,
  TextInput,
  Button,
  Dialog,
  Portal,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Padding, StyleVariable } from "../../GlobalStyles";
import { supabase } from "../../lib/supabase";

const LogIn = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmailConfirm, setResetEmailConfirm] = useState(false);
  const showForgotPassword = () => setForgotPassword(true);
  const hideForgotPassword = () => setForgotPassword(false);
  const hideResetEmailConfirm = () => {
    setResetEmailConfirm(false);
    setResetEmail("");
    setInitialState({ ...checkInitialState, resetEmail: true });
  };

  const [loginErrors, setLoginErrors] = useState({});
  const [resetEmailError, setResetEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [checkInitialState, setInitialState] = useState({
    email: true,
    password: true,
    resetEmail: true,
  });

  async function handleLogIn() {
    setLoading(true);
    setInitialState({ ...checkInitialState, email: false, password: false });
    await signInWithEmail();
  }

  async function signInWithEmail() {
    if (!validateLogin()) {
      setLoading(false);
      return false;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert("Log in error", error.message);

    setLoading(false);
    return !error;
  }

  const handleResetEmail = () => {
    setInitialState({ ...checkInitialState, resetEmail: false });
    if (validateResetEmail()) {
      hideForgotPassword();
      setResetEmailConfirm(true);
    }
  };

  const validateLogin = () => {
    let errors = {};

    if (!checkInitialState.email) {
      if (!email) errors.email = "Enter an email";
      else if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email,
        )
      )
        errors.email = "Email a valid email";
    }

    if (!checkInitialState.password) {
      if (!password) errors.password = "Enter a password";
    }

    setLoginErrors(errors);
    return (
      !checkInitialState.email &&
      !checkInitialState.password &&
      Object.keys(errors).length === 0
    );
  };

  const validateResetEmail = () => {
    if (!checkInitialState.resetEmail) {
      if (!resetEmail) {
        setResetEmailError("Enter an email");
        return false;
      }
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          resetEmail,
        )
      ) {
        setResetEmailError("Email a valid email");
        return false;
      }
      setResetEmailError("");
      return true;
    }
  };

  const styles = StyleSheet.create({
    buttonContent: {
      paddingHorizontal: Padding.p_5xl,
      paddingVertical: Padding.p_xs,
    },
    formContent: { paddingHorizontal: Padding.p_3xs, alignItems: "center" },
    helper: { padding: Padding.p_9xs },
    field: {
      paddingVertical: Padding.p_9xs,
      backgroundColor: "transparent",
      marginTop: 8,
    },
    credentials: { marginTop: 20, alignSelf: "stretch" },
    button: {
      minWidth: StyleVariable.accessibilityMinBtnWidth,
      minHeight: StyleVariable.accessibilityMinTargetSize,
      marginTop: 20,
      alignSelf: "stretch",
    },
    signUp: { marginVertical: 20, flexDirection: "row" },
  });

  return (
    <ScrollView
      style={{ marginTop: 20 }}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="headlineMedium" style={{ textAlign: "center" }}>
        Welcome back to HappyFam!
      </Text>
      <ScrollView
        style={styles.credentials}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.field}
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={(e) => {
            setEmail(e);
            setInitialState({ ...checkInitialState, email: false });
            validateLogin();
          }}
          error={loginErrors.email}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.helper}>
          <HelperText type="error">{loginErrors.email}</HelperText>
        </View>
        <TextInput
          style={styles.field}
          label="Password"
          mode="outlined"
          right={
            <TextInput.Icon
              icon={secureTextEntry ? "eye-off-outline" : "eye-outline"}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={(e) => {
            setPassword(e);
            setInitialState({ ...checkInitialState, password: false });
            validateLogin();
          }}
          error={loginErrors.password}
        />
        <View style={styles.helper}>
          <HelperText type="error">{loginErrors.password}</HelperText>
        </View>
      </ScrollView>
      <TouchableRipple style={{ marginTop: 20 }} onPress={showForgotPassword}>
        <Text style={{ color: theme.colors.link }}>Forgot password?</Text>
      </TouchableRipple>
      <Button
        style={styles.button}
        uppercase
        mode="contained"
        onPress={handleLogIn}
        contentStyle={styles.buttonContent}
        loading={loading}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log in"}
      </Button>
      <View style={styles.signUp}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          Don’t have an account?
        </Text>
        <TouchableRipple
          style={{ marginLeft: 5 }}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={{ color: theme.colors.link }}>Sign up!</Text>
        </TouchableRipple>
      </View>
      <Portal>
        <Dialog visible={forgotPassword} onDismiss={hideForgotPassword}>
          <Dialog.Title>Password reset</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Please enter your email address</Text>
            <TextInput
              style={styles.field}
              label="Email"
              mode="outlined"
              value={resetEmail}
              onChangeText={(e) => {
                setResetEmail(e);
                setInitialState({ ...checkInitialState, resetEmail: false });
                validateResetEmail();
              }}
              error={resetEmailError}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.helper}>
              <HelperText type="error">{resetEmailError}</HelperText>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideForgotPassword}>CANCEL</Button>
            <Button mode="contained" onPress={handleResetEmail}>
              GET RESET EMAIL
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={resetEmailConfirm} onDismiss={hideResetEmailConfirm}>
          <Dialog.Title>Password reset</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">An email has been sent to you</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" onPress={hideResetEmailConfirm}>
              GOT IT
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default LogIn;

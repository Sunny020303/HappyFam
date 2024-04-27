import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
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

const LogIn = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [resetEmail, setResetEmail] = useState(false);
  const [resetEmailConfirm, setResetEmailConfirm] = useState(false);
  const showResetEmail = () => setResetEmail(true);
  const showResetEmailConfirm = () => {
    hideResetEmail();
    setResetEmailConfirm(true);
  };
  const hideResetEmail = () => setResetEmail(false);
  const hideResetEmailConfirm = () => setResetEmailConfirm(false);

  const styles = StyleSheet.create({
    buttonContent: {
      paddingHorizontal: Padding.p_5xl,
      paddingVertical: Padding.p_xs,
    },
    formContent: { paddingHorizontal: Padding.p_3xs, alignItems: "center" },
    field: {
      paddingVertical: Padding.p_9xs,
      backgroundColor: "transparent",
      marginTop: 8,
      marginBottom: 24,
    },
    credentials: { marginTop: 20, alignSelf: "stretch" },
    button: {
      minWidth: StyleVariable.accessibilityMinBtnWidth,
      minHeight: StyleVariable.accessibilityMinTargetSize,
      marginTop: 20,
      alignSelf: "stretch",
    },
    signUp: { marginTop: 20, flexDirection: "row" },
  });

  return (
    <ScrollView
      style={{ marginTop: 20 }}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="headlineMedium">Welcome back to HappyFam!</Text>
      <ScrollView
        style={styles.credentials}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput style={styles.field} label="Email" mode="outlined" />
        <TextInput
          style={styles.field}
          label="Password"
          mode="outlined"
          right={
            <TextInput.Icon
              icon={secureTextEntry ? "eye-off-outline" : "eye-outline"}
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
              }}
            />
          }
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
        />
      </ScrollView>
      <TouchableRipple style={{ marginTop: 20 }} onPress={showResetEmail}>
        <Text style={{ color: theme.colors.link }}>Forgot password?</Text>
      </TouchableRipple>
      <Button
        style={styles.button}
        uppercase
        mode="contained"
        onPress={() => {}}
        contentStyle={styles.buttonContent}
      >
        Log in
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
        <Dialog visible={resetEmail} onDismiss={hideResetEmail}>
          <Dialog.Title>Password reset</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Please enter your email address</Text>
            <TextInput style={styles.field} label="Email" mode="outlined" />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideResetEmail}>CANCEL</Button>
            <Button mode="contained" onPress={showResetEmailConfirm}>
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

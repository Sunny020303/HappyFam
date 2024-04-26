import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  Padding,
  FontSize,
  FontFamily,
  Color,
  StyleVariable,
} from "../../GlobalStyles";

const LogIn = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const styles = StyleSheet.create({
    buttonContent: {
      paddingHorizontal: Padding.p_5xl,
      paddingVertical: Padding.p_xs,
    },
    formContent: { paddingHorizontal: Padding.p_3xs, alignItems: "center" },
    signUpTypo: {
      color: theme.colors.onSurfaceVariant,
      letterSpacing: 1,
      fontSize: FontSize.figmaKitKitBody_size,
    },
    title: { fontSize: FontSize.materialThemeHeadlineSmall_size },
    field: {
      paddingVertical: Padding.p_9xs,
      backgroundColor: "transparent",
      marginTop: 8,
      marginBottom: 24,
    },
    credentials: { marginTop: 20, alignSelf: "stretch" },
    link: { color: theme.colors.link },
    forgotPassword: { marginTop: 20 },
    button: {
      minWidth: StyleVariable.accessibilityMinBtnWidth,
      minHeight: StyleVariable.accessibilityMinTargetSize,
      marginTop: 20,
      alignSelf: "stretch",
    },
    signUp: { marginTop: 20, flexDirection: "row" },
    form: { marginTop: 20 },
  });

  return (
    <ScrollView
      style={styles.form}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Welcome back to HappyFam!</Text>
      <ScrollView style={styles.credentials}>
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
      <TouchableRipple style={styles.forgotPassword} onPress={() => {}}>
        <Text style={[styles.signUpTypo, styles.link]}>Forgot password?</Text>
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
        <Text style={styles.signUpTypo}>Don’t have an account?</Text>
        <TouchableRipple
          style={{ marginLeft: 5 }}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={[styles.signUpTypo, styles.link]}>Sign up!</Text>
        </TouchableRipple>
      </View>
    </ScrollView>
  );
};

export default LogIn;

import { useEffect, useState } from "react";
import { Alert, StyleSheet, ScrollView, View } from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  Portal,
  HelperText,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Padding, StyleVariable } from "../../GlobalStyles";
import * as ImagePicker from "expo-image-picker";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";

const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

const SignUp = () => {
  // Handle linking into app from email app.
  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  const theme = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [signUpErrors, setSignUpErrors] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkInitialState, setInitialState] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  });

  async function handleSignUp() {
    setLoading(true);
    setInitialState({
      firstName: false,
      lastName: false,
      email: false,
      password: false,
    });
    await signUpWithEmail();
  }

  async function signUpWithEmail() {
    if (!validateSignUp()) {
      setLoading(false);
      return false;
    }

    if (image) {
      const arraybuffer = await fetch(image).then((res) => res.arrayBuffer());
      const { error } = await supabase.storage
        .from("avatar")
        .upload(`public/${email}.jpg`, arraybuffer, {
          upsert: true,
          contentType: "image/jpeg",
        });
      if (error) {
        Alert.alert("Upload avatar error", error.message);
        setLoading(false);
        return false;
      }
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          avatar: image
            ? `https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/avatar/public/${email}.jpg`
            : null,
        },
        emailRedirectTo: redirectTo,
      },
    });
    if (error) Alert.alert("Sign up error", error.message);
    setLoading(false);
    return !error;
  }

  const validateSignUp = () => {
    let errors = {};

    if (!checkInitialState.firstName) {
      if (!firstName) errors.firstName = "Enter first name";
    }

    if (!checkInitialState.lastName) {
      if (!lastName) errors.lastName = "Enter last name";
    }

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
      else if (password.length < 8) errors.password = "Password too short";
    }

    setSignUpErrors(errors);
    return (
      Object.values(checkInitialState).every((e) => !e) &&
      Object.keys(errors).length === 0
    );
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
    avatar: { backgroundColor: theme.colors.elevation.level5 },
    credentials: { marginTop: 20, alignSelf: "stretch" },
    button: {
      minWidth: StyleVariable.accessibilityMinBtnWidth,
      minHeight: StyleVariable.accessibilityMinTargetSize,
      marginTop: 20,
      alignSelf: "stretch",
    },
    logIn: { marginVertical: 20, flexDirection: "row" },
  });

  const pickImage = async () => {
    hideDialog();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    hideDialog();
    await requestPermission();
    if (!permission) return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const deleteImage = () => {
    hideDialog();
    setImage(null);
  };

  return (
    <ScrollView
      style={{ marginTop: 20 }}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="headlineMedium">Welcome to HappyFam!</Text>
      <TouchableRipple
        style={{ marginTop: 20 }}
        onPress={showDialog}
        disabled={loading}
      >
        {image ? (
          <Avatar.Image source={{ uri: image }} />
        ) : (
          <Avatar.Icon
            color={theme.colors.primary}
            style={styles.avatar}
            icon="camera-outline"
          />
        )}
      </TouchableRipple>
      <ScrollView
        style={styles.credentials}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.field}
          label="First name"
          mode="outlined"
          value={firstName}
          onChangeText={(e) => {
            setFirstName(e);
            validateSignUp();
          }}
          onBlur={() => {
            setInitialState({ ...checkInitialState, firstName: false });
            validateSignUp();
          }}
          error={signUpErrors.firstName}
        />
        <View style={styles.helper}>
          <HelperText type="error">{signUpErrors.firstName}</HelperText>
        </View>
        <TextInput
          style={styles.field}
          label="Last name"
          mode="outlined"
          value={lastName}
          onChangeText={(e) => {
            setLastName(e);
            validateSignUp();
          }}
          onBlur={() => {
            setInitialState({ ...checkInitialState, lastName: false });
            validateSignUp();
          }}
          error={signUpErrors.lastName}
        />
        <View style={styles.helper}>
          <HelperText type="error">{signUpErrors.lastName}</HelperText>
        </View>
        <TextInput
          style={styles.field}
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={(e) => {
            setEmail(e);
            validateSignUp();
          }}
          onBlur={() => {
            setInitialState({ ...checkInitialState, email: false });
            validateSignUp();
          }}
          error={signUpErrors.email}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.helper}>
          <HelperText type="error">{signUpErrors.email}</HelperText>
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
            validateSignUp();
          }}
          onBlur={() => {
            setInitialState({ ...checkInitialState, password: false });
            validateSignUp();
          }}
          error={signUpErrors.password}
        />
        <View style={styles.helper}>
          <HelperText type="error">{signUpErrors.password}</HelperText>
        </View>
      </ScrollView>
      <Button
        style={styles.button}
        uppercase
        mode="contained"
        contentStyle={styles.buttonContent}
        onPress={handleSignUp}
        loading={loading}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>
      <View style={styles.logIn}>
        <Text>Already have an account?</Text>
        <TouchableRipple
          style={{ marginLeft: 5 }}
          onPress={() => navigation.navigate("LogIn")}
          disabled={loading}
        >
          <Text style={{ color: theme.colors.link }}>Log in</Text>
        </TouchableRipple>
      </View>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Upload profile picture</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              A picture helps people recognize you and lets you know when you’re
              signed in to your account
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={takePhoto}>Take a photo</Button>
            <Button onPress={pickImage}>Browse</Button>
            <Button onPress={deleteImage} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default SignUp;

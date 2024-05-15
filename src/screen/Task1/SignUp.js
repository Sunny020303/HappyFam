import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
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

const SignUp = () => {
  const theme = useTheme();
  const navigation = useNavigation();
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

  const handleSignUp = () => {
    setInitialState({
      firstName: false,
      lastName: false,
      email: false,
      password: false,
    });
    if (validateSignUp()) navigation.navigate("Activity");
  };

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

  useEffect(() => {
    if (firstName) setInitialState({ ...checkInitialState, firstName: false });
    if (lastName) setInitialState({ ...checkInitialState, lastName: false });
    if (email) setInitialState({ ...checkInitialState, email: false });
    if (password) setInitialState({ ...checkInitialState, password: false });
    validateSignUp();
  }, [firstName, lastName, email, password]);

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

  return (
    <ScrollView
      style={{ marginTop: 20 }}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="headlineMedium">Welcome to HappyFam!</Text>
      <TouchableRipple style={{ marginTop: 20 }} onPress={showDialog}>
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
          onChangeText={setFirstName}
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
          onChangeText={setLastName}
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
          onChangeText={setEmail}
          error={signUpErrors.email}
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
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
              }}
            />
          }
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
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
      >
        Create account
      </Button>
      <View style={styles.logIn}>
        <Text>Already have an account?</Text>
        <TouchableRipple
          style={{ marginLeft: 5 }}
          onPress={() => navigation.navigate("LogIn")}
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
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default SignUp;

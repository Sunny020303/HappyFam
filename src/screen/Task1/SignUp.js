import { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  Portal,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Padding, FontSize, StyleVariable } from "../../GlobalStyles";
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

  const styles = StyleSheet.create({
    buttonContent: {
      paddingHorizontal: Padding.p_5xl,
      paddingVertical: Padding.p_xs,
    },
    formContent: { paddingHorizontal: Padding.p_3xs, alignItems: "center" },
    logInTypo: {
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
    avatarIcon: { backgroundColor: theme.colors.surfaceVariant },
    avatar: { marginTop: 20 },
    credentials: { marginTop: 20, alignSelf: "stretch" },
    button: {
      minWidth: StyleVariable.accessibilityMinBtnWidth,
      minHeight: StyleVariable.accessibilityMinTargetSize,
      marginTop: 20,
      alignSelf: "stretch",
    },
    link: { color: theme.colors.link },
    logIn: { marginTop: 20, flexDirection: "row" },
    form: { marginTop: 20 },
  });

  const pickImage = async () => {
    hideDialog();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      style={styles.form}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Welcome to HappyFam!</Text>
      <TouchableRipple style={styles.avatar} onPress={showDialog}>
        {image ? (
          <Avatar.Image source={{ uri: image }} />
        ) : (
          <Avatar.Icon style={styles.avatarIcon} icon="camera-outline" />
        )}
      </TouchableRipple>
      <ScrollView style={styles.credentials}>
        <TextInput style={styles.field} label="First name" mode="outlined" />
        <TextInput style={styles.field} label="Last name" mode="outlined" />
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
      <Button
        style={styles.button}
        uppercase
        mode="contained"
        contentStyle={styles.buttonContent}
        onPress={() => console.log("pressed")}
      >
        Create account
      </Button>
      <View style={styles.logIn}>
        <Text style={styles.logInTypo}>Already have an account?</Text>
        <TouchableRipple
          style={{ marginLeft: 5 }}
          onPress={() => navigation.navigate("LogIn")}
        >
          <Text style={[styles.logInTypo, styles.link]}>Log in</Text>
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

import { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  Portal,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FontSize, Color, StyleVariable } from "../../GlobalStyles";
import * as ImagePicker from "expo-image-picker";

const SignUp = () => {
  const navigation = useNavigation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

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
          <Avatar.Icon icon="camera" />
        )}
      </TouchableRipple>
      <ScrollView style={styles.credentials}>
        <TextInput label="First name" mode="outlined" />
        <TextInput label="Last name" mode="outlined" />
        <TextInput label="Email" mode="outlined" />
        <TextInput
          label="Password"
          mode="outlined"
          right=<TextInput.Icon
            icon={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            onPress={() => {
              setSecureTextEntry(!secureTextEntry);
            }}
          />
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
        />
      </ScrollView>
      <Button
        style={styles.button}
        uppercase={true}
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
          <Text style={[styles.logInLink, styles.logInTypo]}>Log in</Text>
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

const styles = StyleSheet.create({
  buttonContent: { paddingHorizontal: 24, paddingVertical: 12 },
  formContent: { paddingHorizontal: 10, alignItems: "center" },
  logInTypo: { letterSpacing: 1, fontSize: FontSize.figmaKitKitBody_size },
  title: { fontSize: FontSize.materialThemeHeadlineSmall_size },
  avatar: { marginTop: 20 },
  credentials: { marginTop: 20, alignSelf: "stretch" },
  button: {
    minWidth: StyleVariable.accessibilityMinBtnWidth,
    minHeight: StyleVariable.accessibilityMinTargetSize,
    marginTop: 20,
  },
  logInLink: { color: Color.colorDarkturquoise },
  logIn: { marginTop: 20, flexDirection: "row" },
  form: { marginTop: 20 },
});

export default SignUp;

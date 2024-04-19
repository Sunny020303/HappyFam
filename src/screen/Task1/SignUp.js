import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Button, Icon, IconButton, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  StyleVariable,
} from "../../GlobalStyles";

const SignUp = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
      <Text style={styles.title}>Welcome to HappyFam!</Text>
      <IconButton icon="camera" mode="contained" style={styles.fab} />
      <View style={styles.credestials}>
        <TextInput label="First name" mode="outlined" />
        <TextInput label="Last name" mode="outlined" />
        <TextInput label="Email" mode="outlined" />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry={true}
          autoCorrect={false}
        />
      </View>
      <Button
        style={styles.button}
        uppercase={true}
        mode="contained"
        contentStyle={styles.buttonContent}
      >
        Create account
      </Button>
      <View style={styles.descriptionParent}>
        <Text style={styles.logInTypo}>Already have an account?</Text>
        <TouchableOpacity
          style={{ marginLeft: 5 }}
          onPress={() => navigation.navigate("LogIn")}
        >
          <Text style={[styles.logIn, styles.logInTypo]}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContent: { paddingHorizontal: 24, paddingVertical: 12 },
  formContent: { paddingHorizontal: 10, alignItems: "center" },
  logInTypo: { letterSpacing: 1, fontSize: FontSize.figmaKitKitBody_size },
  title: { fontSize: FontSize.materialThemeHeadlineSmall_size },
  fab: { marginTop: 20 },
  credestials: { marginTop: 20, alignSelf: "stretch" },
  button: {
    minWidth: StyleVariable.accessibilityMinBtnWidth,
    minHeight: StyleVariable.accessibilityMinTargetSize,
    marginTop: 20,
  },
  logIn: { color: Color.colorDarkturquoise },
  descriptionParent: { marginTop: 20, flexDirection: "row" },
  form: { marginTop: 20 },
});

export default SignUp;

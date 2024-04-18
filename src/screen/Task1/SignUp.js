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
} from "../GlobalStyles";

const SignUp = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
      <Text style={styles.title}>Welcome to HappyFam!</Text>
      <IconButton
        icon="camera"
        mode="contained"
        style={styles.fabDefault}
        contentStyle={styles.fABDefaultBtn}
      />
      <View style={styles.credestials}>
        <TextInput
          style={styles.textFieldOutlined}
          label="First name"
          mode="outlined"
        />
        <TextInput
          style={styles.textFieldOutlined}
          label="Last name"
          mode="outlined"
        />
        <TextInput
          style={styles.textFieldOutlined}
          label="Email"
          mode="outlined"
        />
        <TextInput
          style={styles.textFieldOutlined}
          label="Password"
          mode="outlined"
          secureTextEntry={true}
          autoCorrect={false}
        />
      </View>
      <Button
        style={[styles.buttonDefault, styles.barFlexBox]}
        uppercase={true}
        mode="contained"
        labelStyle={styles.buttonDefaultBtn}
        contentStyle={styles.buttonDefaultBtn1}
      >
        Create account
      </Button>
      <View style={[styles.descriptionParent, styles.barFlexBox]}>
        <Text style={[styles.description, styles.logInTypo]} numberOfLines={1}>
          Already have an account?
        </Text>
        <TouchableOpacity
          style={styles.description1}
          numberOfLines={1}
          activeOpacity={0.2}
          onPress={() => navigation.navigate("LogIn")}
        >
          <Text style={[styles.logIn, styles.logInTypo]}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fABDefaultBtn: {
    padding: 16,
  },
  buttonDefaultBtn: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
  },
  buttonDefaultBtn1: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  formContent: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  logInTypo: {
    fontFamily: FontFamily.materialThemeDisplayLarge,
    lineHeight: 24,
    letterSpacing: 1,
    fontSize: FontSize.figmaKitKitBody_size,
    textAlign: "center",
  },
  title: {
    fontSize: FontSize.materialThemeHeadlineSmall_size,
  },
  fabDefault: {
    marginTop: 20,
  },
  textFieldOutlined: {
    alignSelf: "stretch",
  },
  credestials: {
    marginTop: 20,
    alignSelf: "stretch",
    alignItems: "center",
  },
  buttonDefault: {
    minWidth: StyleVariable.accessibilityMinBtnWidth,
    minHeight: StyleVariable.accessibilityMinTargetSize,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  description: {
    color: Color.materialThemeSysLightOnSurfaceVariant,
  },
  logIn: {
    color: Color.colorDarkturquoise,
  },
  description1: {
    marginLeft: 5,
  },
  descriptionParent: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  form: { marginTop: 20 },
});

export default SignUp;

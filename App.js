import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  IconButton,
} from "react-native-paper";
import LogIn from "./src/screen/Task1/LogIn";
import SignUp from "./src/screen/Task1/SignUp";
import Calendar from "./src/screen/Task2/Calendar";
import Activity from "./src/screen/Task2/Activity";
import { Theme } from "./src/GlobalStyles";

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>HappyFam</Text>

      <View style={styles.ButtonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate("LogIn")}
        ></Button>
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          title="Sign up"
          onPress={() => navigation.navigate("SignUp")}
        ></Button>
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          title="Calendar"
          onPress={() => navigation.navigate("Calendar")}
        ></Button>
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          title="Activity"
          onPress={() => navigation.navigate("Activity")}
        ></Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonContainer: {
    marginTop: 20,
  },
});

const Stack = createNativeStackNavigator();

function App() {
  const theme =
    useColorScheme() === "dark"
      ? { ...MD3DarkTheme, colors: Theme.dark }
      : { ...MD3LightTheme, colors: Theme.light };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="LogIn" component={LogIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Calendar" component={Calendar} />
          <Stack.Screen
            name="Activity"
            component={Activity}
            options={({ navigation, route }) => ({
              // Add a placeholder button without the `onPress` to avoid flicker
              headerRight: () => <IconButton icon="check" />,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;

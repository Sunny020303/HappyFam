import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogIn from "./src/screen/Task1/LogIn";
import SignUp from "./src/screen/Task1/SignUp";
import Calendar from "./src/screen/Task2/Calendar";
import Activity from "./src/screen/Task2/Activity";

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>HappyFam</Text>

      <View style={styles.ButtonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonContainer: {
    marginTop: 20,
  },
});

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LogIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Activity" component={Activity} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

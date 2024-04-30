import 'react-native-gesture-handler';
import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
//import { DrawerActions } from "react-navigation";

import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  IconButton,
  Drawer,
  Appbar,
  Icon,
} from "react-native-paper";
import LogIn from "./src/screen/Task1/LogIn";
import SignUp from "./src/screen/Task1/SignUp";
import Calendar from "./src/screen/Task2/Calendar";
import Activity from "./src/screen/Task2/Activity";
import { Theme, Color, } from "./src/GlobalStyles";

function Home({ navigation }) {

  return (
    <View style={{ width: "100%", height: "100%" }}>
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

const DrawerNav = createDrawerNavigator();
const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ flexDirection: "row", paddingBottom: 10, paddingTop: 10, paddingLeft: 10 }}>
        <View style={{ paddingTop: 2 }}>
          <Icon source="menu" size={25} ></Icon>
        </View>
        <Text style={{ fontSize: 20, paddingLeft: 20, fontWeight: "500" }}>HappyFam</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function App() {
  const iconSize = 20;
  const theme =
    useColorScheme() === "dark"
      ? { ...MD3DarkTheme, colors: Theme.dark }
      : { ...MD3LightTheme, colors: Theme.light };
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <DrawerNav.Navigator
          drawerContent={DrawerContent}
          screenOptions={{
            drawerStyle: {
              backgroundColor: Color.materialThemeSysLightInverseOnSurface,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            },
            drawerItemStyle: {
              borderRadius: 40,
              padding: 0,
            },
            drawerLabelStyle: {
              fontSize: 20,
            },
            drawerActiveBackgroundColor: Color.materialThemeSysLightSecondaryContainer,
            drawerActiveTintColor: "black",
          }}
        >
          <DrawerNav.Screen name="Home" component={Home}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
              // Add a placeholder button without the `onPress` to avoid flicker
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'home' : 'home-outline'} color={color} size={size}></Icon>
            })}
          />
          <DrawerNav.Screen name="LogIn" component={LogIn}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
              // Add a placeholder button without the `onPress` to avoid flicker
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'calendar-blank' : 'calendar-blank-outline'} color={color} size={size}></Icon>
            })}
          />
          <DrawerNav.Screen name="SignUp" component={SignUp}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
              // Add a placeholder button without the `onPress` to avoid flicker
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'image-album' : 'image-album'} color={color} size={size}></Icon>
            })}
          />
          <DrawerNav.Screen name="Calendar" component={Calendar}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
              // Add a placeholder button without the `onPress` to avoid flicker
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'account-multiple' : 'account-multiple-outline'} color={color} size={size}></Icon>
            })}
          />
          <DrawerNav.Screen
            name="Activity"
            component={Activity}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
              // Add a placeholder button without the `onPress` to avoid flicker
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'heart' : 'heart-outline'} color={color} size={size}></Icon>
            })}
          />
        </DrawerNav.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;

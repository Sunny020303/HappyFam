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
import Gallery from "./src/screen/Task1/Gallery";
import Item from "./src/screen/Task1/Item";

import Calendar from "./src/screen/Task2/Calendar";
import Activity from "./src/screen/Task2/Activity";
import Dashboard from "./src/screen/Task2/Dashboard";
import Family from "./src/screen/Task2/Family";

import { Theme, Color, } from "./src/GlobalStyles";



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
          <DrawerNav.Screen name="Dashboard" component={Dashboard}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'home' : 'home-outline'} color={color} size={size}></Icon>
            })}
          />


          <DrawerNav.Screen name="Calendar" component={Calendar}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'calendar-blank' : 'calendar-blank-outline'} color={color} size={size}></Icon>
            })}
          />


          <DrawerNav.Screen name="Gallery" component={Gallery}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'image-album' : 'image-album'} color={color} size={size}></Icon>
            })}
          />


          <DrawerNav.Screen name="Family" component={Family}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: Color.materialThemeSysLightInverseOnSurface,
              },
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton icon="check" />
                </View>
              ),
              drawerIcon: ({ color, size, focused }) => <Icon source={focused ? 'account-multiple' : 'account-multiple-outline'} color={color} size={size}></Icon>
            })}
          />


          <DrawerNav.Screen
            name="Item"
            component={Item}
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


          {/*Screen hidden from drawer and just for navigate

          options={()=>({
              drawerItemStyle: { display: 'none' },
          })},
     
          */}

          <DrawerNav.Screen
            name="Activity"
            component={Activity}
            options={({ navigation, route }) => ({
              headerStyle: {
                backgroundColor: "#F5E388",
              },
            })}
          />

          <DrawerNav.Screen
            name="LogIn"
            component={LogIn} />

          <DrawerNav.Screen
            name="SignUp"
            component={SignUp} />

        </DrawerNav.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;

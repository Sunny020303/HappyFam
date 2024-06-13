import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
//import { DrawerActions } from "react-navigation";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  IconButton,
  Drawer,
  Appbar,
  Icon,
  TouchableRipple,
} from "react-native-paper";

import { supabase } from "./src/lib/supabase";
import { Session } from "@supabase/supabase-js";

import LogIn from "./src/screen/Task1/LogIn";
import SignUp from "./src/screen/Task1/SignUp";
import Gallery from "./src/screen/Task1/Gallery";
import Item from "./src/screen/Task1/Item";

import Calendar from "./src/screen/Task2/Calendar";
import Activity from "./src/screen/Task2/Activity";
import Dashboard from "./src/screen/Task2/Dashboard";
import Family from "./src/screen/Task2/Family";

import { Theme, Color } from "./src/GlobalStyles";
import { Dimensions } from "react-native";

import { QueryClient, QueryClientProvider } from "react-query";
import ViewActivity from "./src/screen/Task2/ViewActivity";

import useGetFamily from "./src/hooks/FamilyHook/useGetFamily";

const screenHeight = Dimensions.get("window").height;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

const Stack = createNativeStackNavigator();
const DrawerNav = createDrawerNavigator();
const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} style={{ height: "100%" }}>
      <View style={styles.drawerContainer}>
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 10,
            paddingTop: 10,
            paddingLeft: 10,
          }}
        >
          <View style={{ paddingTop: 2 }}>
            <Icon source="menu" size={25}></Icon>
          </View>
          <Text style={{ fontSize: 20, paddingLeft: 20, fontWeight: "500" }}>
            HappyFam
          </Text>
        </View>
        <DrawerItemList {...props} />

        <View
          style={{
            position: "absolute",
            bottom: 30,
            width: "100%",
          }}
        >
          {/* Đăng xuất */}
          <TouchableRipple
            onPress={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) Alert.alert("Log out error", error.message);
            }}
          >
            <View
              style={{
                width: "100%",
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 15,
                borderRadius: 40,
              }}
            >
              <Icon source={"logout"} size={25} color="red"></Icon>
              <Text
                style={{
                  fontSize: 20,
                  color: "red",
                  fontWeight: 500,
                  paddingLeft: 20,
                }}
              >
                Logout
              </Text>
            </View>
          </TouchableRipple>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

function App() {
  const theme =
    useColorScheme() === "dark"
      ? { ...MD3DarkTheme, colors: Theme.dark }
      : { ...MD3LightTheme, colors: Theme.light };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AppContent />
      </PaperProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const [session, setSession] = useState(null);

  const GetFamily = useGetFamily(session?.user?.id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      GetFamily.refetch();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      GetFamily.refetch();
    });
  }, []);

  return (
    <NavigationContainer>
      {session && session.user ? (
        GetFamily && GetFamily.data && GetFamily.data.length > 0 ? (
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
              drawerActiveBackgroundColor:
                Color.materialThemeSysLightSecondaryContainer,
              drawerActiveTintColor: "black",
            }}
          >
            <DrawerNav.Screen
              name="Dashboard"
              component={Dashboard}
              options={({ navigation, route }) => ({
                headerStyle: {
                  backgroundColor: "#F5E388",
                },
                headerRight: () => (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton icon="check" />
                  </View>
                ),
                drawerIcon: ({ color, size, focused }) => (
                  <Icon
                    source={focused ? "home" : "home-outline"}
                    color={color}
                    size={size}
                  ></Icon>
                ),
              })}
            />

            <DrawerNav.Screen
              name="Calendar"
              component={Calendar}
              options={({ navigation, route }) => ({
                headerStyle: {
                  backgroundColor: "#F5E388",
                },
                headerRight: () => (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton icon="check" />
                  </View>
                ),
                drawerIcon: ({ color, size, focused }) => (
                  <Icon
                    source={
                      focused ? "calendar-blank" : "calendar-blank-outline"
                    }
                    color={color}
                    size={size}
                  ></Icon>
                ),
              })}
            />

            <DrawerNav.Screen
              name="Gallery"
              component={Gallery}
              options={({ navigation, route }) => ({
                headerStyle: {
                  backgroundColor: "#F5E388",
                },
                headerRight: () => (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton icon="check" />
                  </View>
                ),
                drawerIcon: ({ color, size, focused }) => (
                  <Icon
                    source={focused ? "image-album" : "image-album"}
                    color={color}
                    size={size}
                  ></Icon>
                ),
              })}
            />

            <DrawerNav.Screen
              name="Family"
              options={({ navigation, route }) => ({
                title: GetFamily.data[0].family.name,
                headerStyle: {
                  backgroundColor: Color.materialThemeSysLightInverseOnSurface,
                },
                headerRight: () => (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton icon="check" />
                  </View>
                ),
                drawerIcon: ({ color, size, focused }) => (
                  <Icon
                    source={
                      focused ? "account-multiple" : "account-multiple-outline"
                    }
                    color={color}
                    size={size}
                  ></Icon>
                ),
              })}
            >
              {(props) => (
                <Family {...props} family={GetFamily.data[0].id_family} />
              )}
            </DrawerNav.Screen>

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
                drawerIcon: ({ color, size, focused }) => (
                  <Icon
                    source={focused ? "heart" : "heart-outline"}
                    color={color}
                    size={size}
                  ></Icon>
                ),
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
                drawerItemStyle: { display: "none" },
              })}
            />

            <DrawerNav.Screen
              name="View Activity"
              component={ViewActivity}
              options={({ navigation, route }) => ({})}
            />
          </DrawerNav.Navigator>
        ) : (
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
              drawerActiveBackgroundColor:
                Color.materialThemeSysLightSecondaryContainer,
              drawerActiveTintColor: "black",
            }}
          >
            <DrawerNav.Screen
              name="Create or Join a Family!"
              options={({ navigation, route }) => ({})}
            >
              {(props) => <Family {...props} family={""} />}
            </DrawerNav.Screen>
          </DrawerNav.Navigator>
        )
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={({ navigation, route }) => ({ title: null })}
          />
          <Stack.Screen
            headerBackVisible={false}
            name="LogIn"
            component={LogIn}
            options={({ navigation, route }) => ({
              title: null,
              headerBackVisible: false,
            })}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    height: screenHeight,
  },
});
export default App;

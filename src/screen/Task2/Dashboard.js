
import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";


export default function Home({ navigation }) {

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
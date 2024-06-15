import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { Card, Icon, useTheme } from "react-native-paper";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

export default function Home({ navigation }) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.cardContainer}>
          <Card
            style={{
              width: screenWidth - 20,
              height: screenWidth / 2,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Card.Title title="Graph here!" />
          </Card>

          <Card
            style={[styles.card]}
            onPress={() => navigation.navigate("Calendar")}
          >
            <Card.Title
              title="Calendar"
              subtitle="something"
              titleStyle={styles.cardTitle}
            />
            <Card.Content style={styles.cardContent}>
              <Icon source="calendar-blank" size={60}></Icon>
            </Card.Content>
          </Card>
          <Card
            style={[styles.card]}
            onPress={() => navigation.navigate("Gallery")}
          >
            <Card.Title
              title="Gallery"
              subtitle="something"
              titleStyle={styles.cardTitle}
            />
            <Card.Content style={styles.cardContent}>
              <Icon source="image-album" size={60}></Icon>
            </Card.Content>
          </Card>
          <Card
            style={[styles.card]}
            onPress={() => navigation.navigate("Family")}
          >
            <Card.Title
              title="Family"
              subtitle="something"
              titleStyle={styles.cardTitle}
            />
            <Card.Content style={styles.cardContent}>
              <Icon source="account-multiple" size={60}></Icon>
            </Card.Content>
          </Card>
          <Card
            style={[styles.card]}
            onPress={() => navigation.navigate("Item")}
          >
            <Card.Title
              title="Item"
              subtitle="something"
              titleStyle={styles.cardTitle}
            />
            <Card.Content style={styles.cardContent}>
              <Icon source="heart" size={60}></Icon>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    cardContainer: {
      height: "100%",
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 10,
      gap: 10,
    },
    card: {
      width: screenWidth / 2 - 15,
      height: screenWidth / 2 - 15,
      backgroundColor: theme.colors.surface,
    },
    scrollView: {
      backgroundColor: theme.colors.secondaryContainer,
      width: "100%",
      height: "100%",
    },
    cardTitle: {
      height: 30,
      paddingTop: 5,
      fontSize: 25,
      fontWeight: "bold",
    },
    cardContent: {
      height: screenWidth / 2 - 80,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
  });

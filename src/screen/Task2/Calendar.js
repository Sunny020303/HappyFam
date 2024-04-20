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

export default function Calendar() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Calendar screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
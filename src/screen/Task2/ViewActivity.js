import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default ViewActivity = () => {
    return (
        <View style={styles.container}>
            <Text>This is View Activity!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})
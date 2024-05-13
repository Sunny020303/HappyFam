import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default Gallery = () => {
    return (
        <View style={styles.container}>
            <Text>This is Item!</Text>
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
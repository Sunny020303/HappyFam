import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, View, StyleSheet } from "react-native";
import { Button, Icon, TouchableRipple } from "react-native-paper";
import ImageViewing from "react-native-image-viewing";

export default Gallery = () => {
  const [currentImageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setImages([
      {
        uri: "https://plus.unsplash.com/premium_photo-1714229505201-072ef1c6edcd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1715596828741-3e2aa6bc3aff?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1715590876582-18e4844864a6?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1715645961085-b3c21251a061?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1715520045597-de56a8639058?q=80&w=1286&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ]);
  }, []);

  const onSelect = (index) => {
    setImageIndex(index);
    setIsVisible(true);
  };
  const onRequestClose = () => setIsVisible(false);

  return (
    <View style={styles.root}>
      <FlatList
        data={images}
        numColumns={3}
        style={styles.listRoot}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableRipple
            style={styles.button}
            onPress={() => {
              onSelect(index);
            }}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
          </TouchableRipple>
        )}
      />
      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        visible={isVisible}
        onRequestClose={onRequestClose}
        HeaderComponent={() => {
          return (
            <View style={styles.container}>
              <Button
                icon={({ size, color }) => (
                  <Icon source="arrow-left" size={24} color="#fff" />
                )}
                style={styles.closeButton}
                onPress={onRequestClose}
              />
              <View style={{ flexGrow: 1 }} />
              <View style={styles.endButtons}>
                <Button
                  icon={({ size, color }) => (
                    <Icon source="tray-arrow-down" size={24} color="#fff" />
                  )}
                  style={styles.closeButton}
                  onPress={onRequestClose}
                />
                <Button
                  icon={({ size, color }) => (
                    <Icon
                      source="share-variant-outline"
                      size={24}
                      color="#fff"
                    />
                  )}
                  style={styles.closeButton}
                  onPress={onRequestClose}
                />
                <Button
                  icon={({ size, color }) => (
                    <Icon source="trash-can-outline" size={24} color="#fff" />
                  )}
                  style={styles.closeButton}
                  onPress={onRequestClose}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, marginTop: 10, marginLeft: 5, alignItems: "flex-start" },
  container: {
    backgroundColor: "#00000077",
    flex: 1,
    paddingVertical: 8,
    justifyContent: "center",
    flexDirection: "row",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  endButtons: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  listRoot: { flexGrow: 0 },
  listContainer: { flex: 0 },
  button: { marginRight: 10 },
  image: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
});

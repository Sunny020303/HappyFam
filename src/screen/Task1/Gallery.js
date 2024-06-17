import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, View, StyleSheet } from "react-native";
import { Button, Icon, TouchableRipple } from "react-native-paper";
import ImageViewing from "react-native-image-viewing";
import * as Sharing from "expo-sharing";
import { supabase } from "../../lib/supabase";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

export default Gallery = () => {
  const [currentImageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const saveFile = async (fileUri) => {
    if (permissionResponse.status !== "granted") await requestPermission();
    else {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      return fileUri;
    }
  };

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase.storage
        .from("activityPics")
        .list("public", {
          sortBy: { column: "updated_at", order: "desc" },
        });

      if (error) Alert.alert("Error fetching images", error.message);
      else
        setImages(
          data.map((item) => ({
            name: item.name,
            uri: `https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/${item.name}?${Date.now()}`,
          })),
        );
    }

    fetchImages();
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
            onPress={() => onSelect(index)}
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
        onImageIndexChange={setImageIndex}
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
                  onPress={() => {
                    FileSystem.downloadAsync(
                      images[currentImageIndex].uri,
                      FileSystem.documentDirectory +
                        images[currentImageIndex].name,
                    )
                      .then(async ({ uri }) => {
                        if (await saveFile(uri))
                          Alert.alert(
                            "Image saved successfully",
                            "Image saved to Download folder",
                          );
                      })
                      .catch((error) => console.log(error));
                  }}
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
                  onPress={() => {
                    FileSystem.downloadAsync(
                      images[currentImageIndex].uri,
                      FileSystem.documentDirectory +
                        images[currentImageIndex].name,
                    )
                      .then(
                        async ({ uri }) =>
                          await Sharing.shareAsync(await saveFile(uri)),
                      )
                      .catch((error) => console.log(error));
                  }}
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

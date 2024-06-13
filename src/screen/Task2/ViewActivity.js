import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Image, ViewComponent } from "react-native";
import { FontSize, Color, StyleVariable } from "../../GlobalStyles";
import { Dimensions } from 'react-native';
import { IconButton, ActivityIndicator,Icon } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import userGetActivityById from "../../hooks/ActivityHook/useGetActivityById";
const screenWidth = Dimensions.get('window').width;

export default ViewActivity = ({ route, navigation }) => {
    const isFocus = useIsFocused();
    const activity = userGetActivityById(route.params?.activityId);
    const [title, setTitle] = useState("No title");
    const [image, setImage] = useState("https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/36ab31da-9638-473a-97cb-a71197f5cfa3.png");
    const [location, setLocation] = useState("Somewhere");
    const [begin, setBegin] = useState();
    const [end, setEnd] = useState();
    const [withWho, setWithWho] = useState("everyone");
    const [repeat, setRepeat] = useState({ value: 0, unit: "day" });
    const [remind, setRemind] = useState({ value: 0, unit: "minute" });
    const [note, setNote] = useState("Doan xem");
    const [height, setHeight] = useState(0)


    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                    <IconButton onPress={() => navigation.navigate("Activity", {
                        activityId: route.params?.activityId,
                    })} icon='pencil' />
                    <IconButton onPress={() => console.log("Delete" + route.params?.activityId)} icon='delete-outline' />
                </View>


            ),
        });
        if (isFocus)
            activity.refetch();

    }, [isFocus]);

    React.useEffect(() => {
        if (activity.data) {
            setTitle(activity.data[0].title)
            setImage(activity.data[0].image)
            setLocation(activity.data[0].location)
            setBegin(activity.data[0].start)
            setEnd(activity.data[0].end)
            setWithWho("everyone")
            //setRepeat("None")
            //setRemind("None")
            setNote(activity.data[0].note)
        }
    }, [activity.data])

    navigation.setOptions({
        headerRight: () => (
            <View style={{ flexDirection: "row" }}>
                <IconButton onPress={() => navigation.navigate("Activity", {
                    activityId: route.params?.activityId,
                })} icon='pencil' />
                <IconButton onPress={() => console.log("Delete" + route.params?.activityId)} icon='delete-outline' />
            </View>
        ),
    });


    if (activity.isFetching) {
        return (
            <View style={{ alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                <ActivityIndicator animating={true} color='blue' size="large"></ActivityIndicator>
            </View>
        )
    }

    if(image!=="No image")
    Image.getSize(image, (width, height) => {
        setHeight((screenWidth - 30) * (height / width));
    })

    return (
        <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.formContent}
        >
            <View style={styles.viewContainer}>
                <View style={styles.viewComponent}>
                    <Text style={{ fontSize: 30, fontWeight: "bold" }}>{title}</Text>
                    <Text style={{ fontSize: 20 }}>{location}</Text>
                    {image!=="No image" && (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Image
                                resizeMode="cover"
                                source={{ uri: image }}
                                style={{ width: screenWidth - 30, height: height }}
                            >
                            </Image>
                        </View>
                    )}
                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        {begin}
                    </Text>
                    <Text style={styles.textFormat}>
                        {end}
                    </Text>
                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        repeat
                    </Text>

                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        everyone
                    </Text>

                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        remind
                    </Text>

                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        {note ? note : "No note"}
                    </Text>

                </View>
            </View>


        </ScrollView>

    )
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: Color.materialThemeSysLightOutlineVariant,
    },
    formContent: {
        alignItems: "center",
    },
    viewContainer: {
        width: screenWidth - 30,
        margin: 15,
        backgroundColor: Color.materialThemeSysLightOutlineVariant,
    },
    viewComponent: {
        marginTop: 1,
        backgroundColor: Color.materialThemeSysLightInverseOnSurface,
    },
    textFormat: {
        padding: 20,
        fontSize: 30,
    },

})
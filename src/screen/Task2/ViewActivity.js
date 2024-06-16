import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Image, ViewComponent } from "react-native";
import { FontSize, Color, StyleVariable } from "../../GlobalStyles";
import { Dimensions } from 'react-native';
import { IconButton, ActivityIndicator, Icon, Portal, Dialog, Button } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import userGetActivityById from "../../hooks/ActivityHook/useGetActivityById";
import useDeleteActivity from "../../hooks/ActivityHook/useDeleteActivity";
const screenWidth = Dimensions.get('window').width;

export default ViewActivity = ({ route, navigation }) => {
    const isFocus = useIsFocused();
    const activity = userGetActivityById(route.params?.activityId);
    const deleteActivity = useDeleteActivity(route.params?.activityId)
    const [title, setTitle] = useState("No title");
    const [image, setImage] = useState("No image");
    const [location, setLocation] = useState("Somewhere");
    const [begin, setBegin] = useState();
    const [end, setEnd] = useState();
    const [withWho, setWithWho] = useState("everyone");
    const [repeat, setRepeat] = useState({ value: 0, unit: "day" });
    const [remind, setRemind] = useState({ value: 0, unit: "minute" });
    const [note, setNote] = useState("Doan xem");
    const [height, setHeight] = useState(0)
    const [toggleDelete, setToggleDelete] = useState(false);
    if (deleteActivity.isSuccess) {
        navigation.navigate("Calendar");
    }

    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                    <IconButton onPress={() => navigation.navigate("Activity", {
                        activity: activity.data[0],
                    })} icon='pencil' />
                    <IconButton onPress={() => setToggleDelete(true)} icon='delete-outline' />
                </View>


            ),
        });
        if (isFocus)
            activity.refetch();
        if (!isFocus) {
            deleteActivity.reset();
            setImage("No image");
        }
    }, [isFocus]);

    React.useEffect(() => {
        if (activity.data) {
            setTitle(activity.data[0].title)
            setImage(`${activity.data[0].image}?${Date.now()}`)
            setLocation(activity.data[0].location)
            setBegin(activity.data[0].start)
            setEnd(activity.data[0].end)
            setWithWho("everyone")
            setRepeat(activity.data[0].repeat)
            setRemind(activity.data[0].remind)
            setNote(activity.data[0].note)
            console.log(activity.data[0].image);

        }
    }, [activity.data])

    navigation.setOptions({
        headerRight: () => (
            <View style={{ flexDirection: "row" }}>
                <IconButton onPress={() => navigation.navigate("Activity", {
                    activity: activity.data[0],
                })} icon='pencil' />
                <IconButton onPress={() => setToggleDelete(true)} icon='delete-outline' />
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

    if (image !== "No image")
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
                    <Text style={{ fontSize: 40, fontWeight: "bold", padding: 20, paddingBottom: 0 }}>{title}</Text>
                    <Text style={styles.textFormat}>{location}</Text>
                    {image !== "No image" && (
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
                        {new Date(begin).toString().split(" G")[0]}
                    </Text>
                    <Text style={styles.textFormat}>
                        {new Date(end).toString().split(" G")[0]}
                    </Text>
                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        {repeat.value == 0 ? "No repeat" :
                            "Every " + repeat.value + " " + repeat.unit + (repeat.value > 1 ? "s" : "")
                        }
                    </Text>

                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        everyone
                    </Text>

                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        {remind.unit == "none" ? "No reminder" : remind.value == 0 ? "At time" :
                            remind.value + " " + remind.unit + (remind.value > 1 ? "s" : "") + " before start"
                        }
                    </Text>

                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        {note ? note : "No note"}
                    </Text>

                </View>
            </View>


            <Portal>
                <Dialog visible={toggleDelete} onDismiss={() => setToggleDelete(false)}>
                    <Dialog.Icon icon='delete-outline' size={40}></Dialog.Icon>
                    <Dialog.Title alignSelf="center">Confirm</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete this activity?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setToggleDelete(false);
                            deleteActivity.mutate()
                        }}>Confirm</Button>
                        <Button onPress={() => setToggleDelete(false)}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

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
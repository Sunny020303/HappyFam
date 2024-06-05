import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Image, ViewComponent } from "react-native";
import { FontSize, Color, StyleVariable } from "../../GlobalStyles";
import { Dimensions } from 'react-native';


const screenWidth = Dimensions.get('window').width;

export default ViewActivity = ({ navigation }) => {


    const [title, setTitle] = useState("Activity");
    const [image, setImage] = useState("https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/36ab31da-9638-473a-97cb-a71197f5cfa3.png");
    const [location, setLocation] = useState("Somewhere");
    const [begin, setBegin] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [withWho, setWithWho] = useState("everyone");
    const [repeat, setRepeat] = useState({ value: 0, unit: "day" });
    const [remind, setRemind] = useState({ value: 0, unit: "minute" });
    const [note, setNote] = useState("Doan xem");
    const [height, setHeight] = useState(0)

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
                    {image ? (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Image
                                resizeMode="cover"
                                source={{ uri: image }}
                                style={{ width: screenWidth - 30, height: height }}
                            >
                            </Image>
                        </View>
                    ) : (
                        <View style={{}}>
                            <Icon
                                source="image-outline"
                                style={styles.iconStyle}
                                size={30}
                            ></Icon>
                            <Text style={styles.textDescription}>
                                Add photo
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.viewComponent}>
                    <Text style={styles.textFormat}>
                        {begin.toISOString()}
                    </Text>
                    <Text style={styles.textFormat}>
                        {end.toISOString()}
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
                        {note}
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
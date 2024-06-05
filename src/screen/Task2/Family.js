import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Card, Icon, IconButton, TextInput, Portal, Dialog, Button } from "react-native-paper";
import { Color } from "../../GlobalStyles";
import useUser from "../../hooks/UserHook/useGetUser";
import { useIsFocused } from "@react-navigation/native";
import useCreateFamily from "../../hooks/FamilyHook/useCreateFamily";


export default Family = ({ navigation }) => {

    const isFocus = useIsFocused();
    const user = useUser();
    const [addFamilyToggle, setAddFamilyToggle] = useState(false);
    const [menuFamilyToggle, setMenuFamilyToggle] = useState(false);

    const [dialogToggle, setDialogToggle] = useState(false);
    var dialogTitle="";
    var dialogInfo="";
    var dialogIcon="";



    const [newFamilyName, setNewFamilyName] = useState("");
    //const [userId, setUserId] = useState();

    const familyList = [
        {
            id: '1',
            familyRole: "Mom",
            role: "Admin",
        },
        {
            id: '2',
            familyRole: "Dad",
            role: "Admin",
        },
        {
            id: '3',
            familyRole: "Kid",
            role: "Member",
        },

    ]

    const createFamily = useCreateFamily(user.data?.id, newFamilyName);
    if (createFamily.isSuccess) {
        
    }
    if (createFamily.isError) {
        console.log(createFamily.error)
    }

    React.useEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                    <IconButton onPress={() => setAddFamilyToggle(true)} icon='plus' />

                    <IconButton onPress={() => console.log(user.data?.id)} icon='account-multiple' />
                </View>
            ),
        });
    }, [isFocus]);

    navigation.setOptions({
        headerRight: () => (
            <View style={{ flexDirection: "row" }}>
                <IconButton onPress={() => setAddFamilyToggle(true)} icon='plus' />

                <IconButton onPress={() => console.log(user.data?.id)} icon='account-multiple' />
            </View>
        ),
    });
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {
                    familyList.map((item) => (
                        <MemberCard familyRole={item.familyRole} role={item.role}></MemberCard>
                    ))
                }
                <Card style={styles.cardMember}>
                    <Card.Title
                        title="Add Member"
                        left={() => {
                            return (
                                <Icon source="plus-circle-outline" size={70}></Icon>
                            )
                        }}
                        leftStyle={{ height: "70px", width: "70px", marginTop: 15, borderRadius: 10, backgroundColor: "pink" }}
                        titleStyle={{ height: 50, paddingTop: 27, fontSize: 30, fontWeight: "bold" }}
                    />
                </Card>

                <Portal>
                    <Dialog visible={addFamilyToggle} onDismiss={() => setAddFamilyToggle(false)}>
                        <Dialog.Icon icon='plus' size={40}></Dialog.Icon>
                        <Dialog.Title alignSelf="center">Create a new family.</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                mode="outlined"
                                label="Family's Name"
                                value={newFamilyName}
                                onChangeText={newFamilyName => setNewFamilyName(newFamilyName)}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={
                                () => {
                                    setAddFamilyToggle(false);
                                    createFamily.mutate();
                                }}
                            >Create</Button>
                            <Button onPress={() => setAddFamilyToggle(false)}>Cancel</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                <Portal>
                    <Dialog visible={dialogToggle} onDismiss={() => setDialogToggle(false)}>
                        <Dialog.Icon icon={dialogIcon} size={40}></Dialog.Icon>
                        <Dialog.Title alignSelf="center">{dialogTitle}</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">{dialogInfo}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogToggle(false)}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

            </ScrollView>
        </SafeAreaView>
    )
}

const MemberCard = (props) => {

    return (
        <Card style={styles.cardMember}>
            <Card.Title title={props.familyRole}
                subtitle={props.role}
                left={() => {
                    return (
                        <Icon source="account" size={70}></Icon>
                    )
                }}
                leftStyle={{ height: "70px", width: "70px", marginTop: 15, borderRadius: 10, backgroundColor: "pink" }}
                titleStyle={{ height: 50, paddingTop: 25, fontSize: 30, fontWeight: "bold" }}
                subtitleStyle={{ height: 30, paddingTop: 5, fontSize: 20 }}

            />
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: Color.materialThemeSysLightOutlineVariant
    },
    scrollView: {
        backgroundColor: Color.materialThemeSysLightOutlineVariant,
        width: "100%",
        height: "100%",
    },
    cardMember: {
        marginTop: 5,
        marginBottom: 0,
        height: 100,
        backgroundColor: Color.materialThemeSysLightInverseOnSurface,
        borderRadius: 0,
    }
})
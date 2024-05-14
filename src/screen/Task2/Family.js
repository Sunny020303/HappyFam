import React from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Card, Icon } from "react-native-paper";
import { Color } from "../../GlobalStyles";

export default Family = () => {

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
        margin: 15,
        marginBottom: 0,
        height: 100,
        backgroundColor: Color.materialThemeSysLightInverseOnSurface,
    }
})
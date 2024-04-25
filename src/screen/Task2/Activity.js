import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View, Image, ToastAndroid } from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  Portal,
  TextInput,
  TouchableRipple,
  Icon,
  Switch,
  RadioButton,
  List,
  IconButton,
  Title,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FontSize, Color, StyleVariable } from "../../GlobalStyles";
import * as ImagePicker from "expo-image-picker";
import { TimePickerModal, DatePickerModal } from "react-native-paper-dates";

export default function Activity({ navigation }) {


  

  const [title, setTitle] = useState("");
  const [withWho, setWithWho] = useState("Everyone");
  const [visible, setVisible] = useState("Everyone");
  //repeat
  const [repeat, setRepeat] = useState({ value: 0, unit: "day" });
  const [repeatToggle, setRepeatToggle] = useState(false);

  const onRepeat = (value = 0, unit = "d") => {
    setRepeat({ value: value, unit: unit });
    setRepeatToggle(false);
  }
  //remind
  const [remind, setRemind] = useState({ value: 0, unit: "minute" });
  const [remindToggle, setRemindToggle] = useState(false);

  const onRemind = (value = 0, unit = "minute") => {
    setRemind({ value: value, unit: unit });
    setRemindToggle(false);
  }
  //location
  const [location, setLocation] = useState(null);
  const [note, setNote] = useState("");
  //Date Time
  const [begin, setBegin] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [time, setTime] = useState(true);
  const [date, setDate] = useState(true);
  const [allDay, setAllDay] = useState(false);
  const toggleAllDay = () => setAllDay(!allDay);
  const [visibleTimePicker, setVisibleTimePicker] = React.useState(false)

  //time
  const onDismissTime = () => {
    setVisibleTimePicker(false);
  }
  const onConfirmTime = (parameter) => {
    if (time) {
      var temp = new Date(begin);
      temp.setHours(parameter['hours'], parameter['minutes'], 0);
      setBegin(temp)
    } else {
      var temp = new Date(end);
      temp.setHours(parameter['hours'], parameter['minutes'], 0);
      setEnd(temp);
    }
    setVisibleTimePicker(false);
  }
  //date
  const [dateOpen, setDateOpen] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);

  const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });

  const onDismissDate = () => {
    setOpen(false);
  }

  const onConfirmDate = (params) => {


    var tempBegin = new Date(begin);
    var tempEnd = new Date(end);
    tempBegin.setFullYear(params['startDate'].getFullYear().toString(), params["startDate"].getMonth().toString(), params["startDate"].getDate().toString());
    tempEnd.setFullYear(params['endDate'].getFullYear().toString(), params["endDate"].getMonth().toString(), params["endDate"].getDate().toString());
    setBegin(tempBegin);
    setEnd(tempEnd);
    setRange((params['startDate']), (params['endDate']));
    console.log(range);

    //console.log(params["startDate"].getFullYear().toString())
    //console.log(params["startDate"].getMonth().toString())
    //console.log(params["startDate"].getDate().toString())
    //console.log(params["startDate"].toString())
    setOpen(false);
  }


  //image chosing
  const [image, setImage] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const pickImage = async () => {
    hideDialog();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,

    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    hideDialog();
    await requestPermission();
    if (!permission) return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,

    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //Confirm button
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={() => { }} icon='check' />
      ),
    });
  }, [navigation]);

  navigation.setOptions({
    headerRight: () => (
      <IconButton onPress={() => console.log(title)} icon='check' />
    ),
  });

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.formContent}
    >
      <View style={styles.viewComponent}>
        <TextInput
          placeholder="Title"
          style={styles.inputTitle}
          underlineColor={Color.materialThemeSysLightInverseOnSurface}
          activeUnderlineColor={Color.materialThemeSysLightInverseOnSurface}
          value={title}
          onChangeText={title => setTitle(title)}
        />
      </View>

      <View style={styles.viewComponent}>
        <View style={styles.viewTab}>
          <Icon
            source="clock-outline"
            style={styles.iconStyle}
            size={30}
          ></Icon>
          <View>
            <View style={styles.viewDateTime}>
              <TouchableRipple
                onPress={
                  () => {
                    setOpen(true);
                  }}
              >
                <Text style={styles.textDescription}>
                  {begin.toLocaleDateString()}
                </Text>
              </TouchableRipple>
              {!allDay && <TouchableRipple
                onPress={
                  () => {
                    setTime(true);
                    setVisibleTimePicker(true);
                  }
                }
              >
                <Text style={styles.textDescription}>
                  {begin.getHours().toString() + ":" + (begin.getMinutes() < 10 ? ("0" + begin.getMinutes().toString()) : (begin.getMinutes().toString()))}
                </Text>
              </TouchableRipple>}
            </View>

            <View style={styles.viewDateTime}>
              <TouchableRipple
                onPress={
                  () => {
                    setOpen(true);
                  }}
              >
                <Text style={styles.textDescription}>
                  {end.toLocaleDateString()}
                </Text>
              </TouchableRipple>
              {!allDay && <TouchableRipple
                onPress={
                  () => {
                    setTime(false);
                    setVisibleTimePicker(true);
                  }
                }>
                <Text style={styles.textDescription}>
                  {end.getHours().toString() + ":" + (end.getMinutes() < 10 ? ("0" + end.getMinutes().toString()) : (end.getMinutes().toString()))}
                </Text>
              </TouchableRipple>}
            </View>

            <View style={styles.viewDateTime}>

              <Text style={styles.textDescription}>
                All day
              </Text>
              <Switch
                value={allDay}
                onValueChange={toggleAllDay}
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}>
              </Switch>
            </View>
          </View>
        </View>
      </View>



      <View style={styles.viewComponent}>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.viewTab}>
            <Icon
              source="account-multiple-outline"
              style={styles.iconStyle}
              size={30}
            ></Icon>
            <Text style={styles.textDescription}>
              With who?
            </Text>
            <Text style={styles.textState}>
              {" " + withWho}
            </Text>
          </View>
        </TouchableRipple>
      </View>

      <View style={styles.viewComponent}>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.viewTab}>
            <Icon
              source="eye-outline"
              style={styles.iconStyle}
              size={30}
            ></Icon>
            <Text style={styles.textDescription}>
              Visible to:
            </Text>
            <Text style={styles.textState}>
              {" " + visible}
            </Text>
          </View>
        </TouchableRipple>
      </View>

      <View style={styles.viewComponent}>
        <TouchableRipple onPress={() => { setRepeatToggle(true) }}>
          <View style={styles.viewTab}>
            <Icon
              source="cached"
              style={styles.iconStyle}
              size={30}
            ></Icon>
            <Text style={styles.textDescription}>
              {repeat.value == 0 ? "No repeat" :
                "Every " + repeat.value + " " + repeat.unit + (repeat.value > 1 ? "s" : "")
              }
            </Text>
          </View>
        </TouchableRipple>
      </View>

      <View style={styles.viewComponent}>
        <TouchableRipple onPress={() => { setRemindToggle(true) }}>
          <View style={styles.viewTab}>
            <Icon
              source="bell-outline"
              style={styles.iconStyle}
              size={30}
            ></Icon>
            <Text style={styles.textDescription}>
              {remind.unit == "none" ? "No reminder" : remind.value == 0 ? "At time" :
                remind.value + " " + remind.unit + (remind.value > 1 ? "s" : "") + " before"
              }
            </Text>
          </View>
        </TouchableRipple>
      </View>

      <View style={styles.viewComponent}>
        <TouchableRipple onPress={() => { }}>
          <View style={styles.viewTab}>
            <Icon
              source="map-marker-outline"
              style={styles.iconStyle}
              size={30}
            ></Icon>
            <Text style={styles.textDescription}>
              {location ? location : "Add location"}
            </Text>
          </View>
        </TouchableRipple>
      </View>

      <View style={styles.viewComponent}>
        <TouchableRipple onPress={showDialog}>
          {image ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                resizeMode="contain"
                source={{ uri: image }}
                style={{ width: 500, height: 500 }}
              >
              </Image>
            </View>
          ) : (
            <View style={styles.viewTab}>
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


        </TouchableRipple>
      </View>

      <View style={styles.viewComponent}>
        <View style={styles.viewTab}>
          <Icon
            source="text"
            style={styles.iconStyle}
            size={30}
          ></Icon>
          <TextInput
            placeholder="Add note"
            style={styles.inputTitle}
            underlineColor={Color.materialThemeSysLightInverseOnSurface}
            activeUnderlineColor={Color.materialThemeSysLightInverseOnSurface}
          />
        </View>

      </View>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Upload profile picture</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Pick a photo for your event
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={takePhoto}>Take a photo</Button>
            <Button onPress={pickImage}>Browse</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>


      <Portal>
        <Dialog visible={repeatToggle} onDismiss={() => setRepeatToggle(false)}>
          <Dialog.Icon icon='cached' size={40}></Dialog.Icon>
          <Dialog.Title alignSelf="center">Select repeat time</Dialog.Title>
          <Dialog.Content>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRepeat(0, "day")}>
              <Text style={{ fontSize: 20 }}>No repeat</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRepeat(1, "day")}>
              <Text style={{ fontSize: 20 }}>Every day</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRepeat(2, "day")}>
              <Text style={{ fontSize: 20 }}>Every two day</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRepeat(1, "week")}>
              <Text style={{ fontSize: 20 }}>Every week</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRepeat(2, "week")}>
              <Text style={{ fontSize: 20 }}>Every two week</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRepeat(1, "month")}>
              <Text style={{ fontSize: 20 }}>Every Month</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRepeat(1, "year")}>
              <Text style={{ fontSize: 20 }}>Every Year</Text>
            </Button>
          </Dialog.Content>
          <Dialog.Actions alignSelf="center">
            <Button onPress={() => setRepeatToggle(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={remindToggle} onDismiss={() => setRemindToggle(false)}>
          <Dialog.Icon icon='bell-outline' size={40}></Dialog.Icon>
          <Dialog.Title alignSelf="center">Select remind time</Dialog.Title>
          <Dialog.Content>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRemind(0, "none")}>
              <Text style={{ fontSize: 20 }}>No remind</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRemind(0, "minute")}>
              <Text style={{ fontSize: 20 }}>At time</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRemind(5, "minute")}>
              <Text style={{ fontSize: 20 }}>5 minutes before</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRemind(15, "minute")}>
              <Text style={{ fontSize: 20 }}>15 minutes before</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRemind(30, "minute")}>
              <Text style={{ fontSize: 20 }}>30 minutes before</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRemind(1, "hour")}>
              <Text style={{ fontSize: 20 }}>1 hour before</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.buttonModal} onPress={() => onRemind(1, "day")}>
              <Text style={{ fontSize: 20 }}>1 day before</Text>
            </Button>
          </Dialog.Content>
          <Dialog.Actions alignSelf="center">
            <Button onPress={() => setRemindToggle(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <TimePickerModal
        visible={visibleTimePicker}
        onDismiss={onDismissTime}
        onConfirm={onConfirmTime}
        hours={time ? begin.getHours() : end.getHours()}
        minutes={time ? begin.getMinutes() : end.getMinutes()}
        use24HourClock={false}
      />

      <DatePickerModal
        mode="range"
        visible={open}
        onDismiss={onDismissDate}
        startDate={begin}
        endDate={end}
        onConfirm={onConfirmDate}
        label="Choose date"
      />

    </ScrollView>


  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.materialThemeSysLightOutlineVariant,
  },
  formContent: {
    alignItems: "center",
  },
  inputTitle: {
    height: 60,
    width: "100%",
    alignSelf: "stretch",
    fontSize: 30,
    backgroundColor: Color.materialThemeSysLightInverseOnSurface,
  },
  viewComponent: {
    width: "100%",
    maxHeight: "100%",
    marginTop: 15,
    backgroundColor: Color.materialThemeSysLightInverseOnSurface,
  },
  viewDateTime: {
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  viewTab: {
    minHeight: 60,
    maxHeight: 180,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
  },
  textDescription: {
    paddingLeft: 20,
    fontSize: 30,
    fontWeight: "400",
    color: Color.materialThemeSysLightOnSurface,
  },
  textState: {
    fontSize: 30,
    fontWeight: "400",
    color: Color.materialThemeSysLightPrimary,
  },
  buttonModal: {
    marginTop: 10,
    padding: 5,
  }
});
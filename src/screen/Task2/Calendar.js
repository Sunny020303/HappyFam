import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, Icon, IconButton, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  StyleVariable,
} from "../../GlobalStyles";
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}


export default function Calendar() {
  const navigation = useNavigation();
  const [items, setItems] = React.useState({});
  const [date, setDate] = React.useState(new Date());

  const loadItems = (day) => {
    const items = items || {};



    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
        }
      }
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });

      setItems(newItems);

    }, 10000);


    items["2024-04-07"] = [];
    items['2024-04-07'].push({
      name: 'Hello mn : D',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-04-07'
    });
    items["2024-05-07"] = [];
    items['2024-05-07'].push({
      name: 'Hello mn : D',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-05-07'
    });
    items['2024-05-07'].push({
      name: 'Con tro nay',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-05-07'
    });
    items["2024-05-08"] = [];
    items['2024-05-08'].push({
      name: 'react native suck',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-05-07'
    });

    const newItems = {};
    Object.keys(items).forEach(key => {
      newItems[key] = items[key];
    });

    setItems(newItems);
  };

  //render các tab công việc
  const renderItem = (reservation, isFirst) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';

    return (
      <TouchableOpacity
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };
  //vọc
  //render ngay trong gì đó
  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };
  //render hàng dọc số ngày bên trái
  renderDay = (day) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDate()}</Text>;
    }
    return <View style={styles.dayItem} />;
  };


  //render list
  const renderActivityList = (listProps) => {

  }

  //Header button
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={() => { }} icon='check' />
      ),
    });
  }, [navigation]);

  navigation.setOptions({
    headerRight: () => (
      <IconButton onPress={() => console.log(timeToString(date))} icon='check' />
    ),
  });

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()}
        renderItem={renderItem}
        showClosingKnob={true}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        //renderList={renderActivityList}
        // monthFormat={'yyyy'}
        //markingType={'period'}
        theme={{calendarBackground: Color.materialThemeSysLightInverseOnSurface, agendaKnobColor: '#F5E388' }}
        //renderDay={renderDay}
        //hideExtraDays={true}
        //showOnlySelectedDayItems
        // reservationsKeyExtractor={this.reservationsKeyExtractor}       
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Color.materialThemeSysLightInverseOnSurface,
    width: "100%",
    height: "100%",
  },
  item: {
    backgroundColor: 'pink',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  customDay: {

    fontSize: 40,
    color: 'green',
    backgroundColor: "blue",
    width: 50,
  },
  dayItem: {

    backgroundColor: "red",
    width: 50,
  }
});
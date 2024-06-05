import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, Icon, IconButton, TextInput, Card } from "react-native-paper";
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
  //const [test,setTest] = React.useState("2024-04-27");

  /*const items = {}
  items["2024-04-27"] = [];
    items['2024-04-27'].push({
      name: 'Hello mn : D',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-04-07'
    });
    items["2024-05-26"] = [];
    items['2024-05-26'].push({
      name: 'Hello mn : D',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-05-26'
    });
    items["2024-05-27"] = [];
    items['2024-05-27'].push({
      name: 'Con tro nay',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-05-27'
    });
    items["2024-05-28"] = [];
    items['2024-05-28'].push({
      name: 'react native suck',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-05-28'
    });
    items["2024-05-30"] = [];
    items['2024-05-30'].push({
      name: 'Hello mn : D',
      height: Math.max(50, Math.floor(Math.random() * 150)),
      day: '2024-04-06'
    });*/


  const loadItems = (day) => {
    const items = items || {};
    //console.log(day)

    setTimeout(() => {
      for (let i = 0; i < 50; i++) {
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

    }, 100);


    items["2024-04-27"] = [];
    items['2024-04-27'].push({
      name: 'Hello mn : D',
      image: 'https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/36ab31da-9638-473a-97cb-a71197f5cfa3.png',
      day: '2024-04-07'
    });
    items["2024-05-26"] = [];
    items['2024-05-26'].push({
      name: 'Hello mn : D',
      image: 'https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/36ab31da-9638-473a-97cb-a71197f5cfa3.png',
      day: '2024-05-26'
    });
    items["2024-05-27"] = [];
    items['2024-05-27'].push({
      name: 'Con tro nay',
      image: 'https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/36ab31da-9638-473a-97cb-a71197f5cfa3.png',
      day: '2024-05-27'
    });
    items["2024-05-28"] = [];
    items['2024-05-28'].push({
      name: 'react native suck',
      image: 'No image',
      day: '2024-05-28'
    });
    items["2024-05-30"] = [];
    items['2024-05-30'].push({
      name: 'Hello mn : D',
      image: 'https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/36ab31da-9638-473a-97cb-a71197f5cfa3.png',
      day: '2024-04-06'
    });
    items['2024-05-30'].push({
      name: 'Hello mn : D',
      image: 'https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/36ab31da-9638-473a-97cb-a71197f5cfa3.png',
      day: '2024-04-06'
    });



    setItems(items);
  };

  //render các tab công việc
  const renderItem = (reservation, isFirst) => {

    const height = reservation.image === 'No image' ? 100 : 300

    return (
      <Card
        style={[styles.item, { height: height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        {
          reservation.image !== 'No image' && (
            <Card.Cover style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} source={{ uri: reservation.image }}></Card.Cover>
          )
        }
        <Card.Title title={reservation.name} subtitle={reservation.day}></Card.Title>

      </Card>
    );
  };
  //vọc
  //render ngay trong gì đó
  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>No activity today!</Text>
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
        <IconButton onPress={() => navigation.navigate('Activity')} icon='check' />
      ),
    });
  }, [navigation]);

  navigation.setOptions({
    headerRight: () => (
      <IconButton onPress={() => navigation.navigate('Activity')} icon='plus' />
    ),
  });

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        //selected={date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()}
        //selected={}
        current={400}
        renderItem={renderItem}
        showClosingKnob={true}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        showScrollIndicator={true}
        //onScroll={(offSet)=>console.log(offSet)}
        //onEndReached={()=>console.log("U reach the end")}
        //onStartReached={()=>console.log("U reach the top")}
        pastScrollRange={50}
        futureScrollRange={50}
        //renderList={renderActivityList}
        // monthFormat={'yyyy'}
        //markingType={'period'}
        //onDayChange={(dayData)=>{console.log(dayData)}}
        theme={{
          calendarBackground: Color.materialThemeSysLightInverseOnSurface,

          todayBackgroundColor: Color.materialThemeSysLightSurfaceContainerLow,
          backgroundColor: Color.materialThemeSysLightSurfaceContainerLow,
          
          renderActivityList: Color.materialThemeSysLightSurfaceContainerLow,
          agendaKnobColor: '#F5E388',
          //todayDotColor: "pink", 
          agendaTodayColor: "red",
          //selectedDotColor: "green",
          //dotColor:"yellow",
          //todayButtonTextColor: "purple",
          selectedDayBackgroundColor: "grey",
          selectedDayTextColor: "blue"

        }}
        //renderDay={renderDay}
        hideExtraDays={true}
      //showOnlySelectedDayItems
      // reservationsKeyExtractor={this.reservationsKeyExtractor}       
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.materialThemeSysLightInverseOnSurface,
    width: "100%",
    height: "100%",
  },
  item: {
    backgroundColor: Color.materialThemeSysLightInverseOnSurface,
    flex: 1,
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
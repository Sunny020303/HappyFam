import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, Icon, IconButton, TextInput, Card, ActivityIndicator } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  StyleVariable,
} from "../../GlobalStyles";
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import userGetActivityList from "../../hooks/ActivityHook/useGetActivityList";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}


export default function Calendar() {
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const [items, setItems] = React.useState({});
  const [date, setDate] = React.useState(new Date());
  const activiyList = userGetActivityList("cadb52ea-9d5a-47ba-af1a-3e1f6599aa5c", date);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={() => navigation.navigate('Activity')} icon='check' />
      ),
    });

    console.log("hi there!");
    activiyList.refetch();
    setItems({});
  }, [isFocus]);

  if (activiyList.isFetching) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center",height: "100%", width: "100%" }}>
        <ActivityIndicator animating={true} color='blue' size="large"></ActivityIndicator>
      </View>
    )
  }

  const loadItems = (day) => {
    const items = items || {};
    setTimeout(() => {
      for (let i =-70; i < 70; i++) {
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

    activiyList.data?.map((i) => {
      let start = timeToString(i.start);
      if (!items[start]) {
        items[start] = []
      }
      items[start].push({
        name: i.title,
        image: i.image,
        day: start,
        id: i.id,
      });
    });

    setItems(items);
  };

  //render các tab công việc
  const renderItem = (reservation, isFirst) => {

    const height = reservation.image === 'No image' ? 100 : 300

    return (
      <Card
        style={[styles.item, { height: height }]}
        onPress={() => {
          navigation.navigate('View Activity', {
            activityId: reservation.id,
          });
          console.log("Activity: " + reservation.id)
        }}
      >
        {
          reservation.image !== 'No image' && (
            <Card.Cover style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}source={{ uri: `${reservation.image}?${new Date().getTime()}` }} ></Card.Cover>
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
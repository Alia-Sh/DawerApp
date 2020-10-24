import React , { useState ,useEffect } from 'react';
import { StyleSheet, Text, View, NativeModules,FlatList} from 'react-native';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {FontAwesome5} from '@expo/vector-icons';
import firebase from '../Database/firebase';
import SearchBar from '../components/SearchBar';

const HomeScreen = ({navigation})=>{

  const [CategoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [term, setTerm] = useState('')
  const [SearchList, setSearchList] = useState([])
  const [SearchOccur, setSearchOccur] = useState(false)        


  const Item = ({ item, onPress, style }) => (
  
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <View>
      <Text style={styles.textInput}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const fetchData=()=>{
    console.log('inside fetch categories');
    firebase.database().ref("Category").orderByChild("Name").on('value', (snapshot) =>{
  
      var li = []
      snapshot.forEach((child)=>{
        var temp={
          key: child.key,
          name : child.val().Name
        }

        li.push(temp)
        setLoading(false)
        console.log(child.key);
        console.log(child.val().Name);
        setLoading(false) 
      })
   
      setCategoriesList(li)
   
    })
  
  }
  
  useEffect(()=>{
    fetchData()
  },[])

  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
    const backgroundColor = item.key === selectedId ? "#F3F3F3" : "#F3F3F3";

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.key)}
        style={{ backgroundColor }}
      />
    );
  };

  SearchInList = (word) =>{
    setSearchList(CategoriesList.filter(item => item.name.toLowerCase().includes(word)))
    setSearchOccur(true)
  }


    return (
      <View>
        <View style = {{flexDirection: 'row'}}>
        <FontAwesome5 name="camera" size={34} color="#AFB42B" style={styles.icon}
            onPress={()=>{
                navigation.navigate("ImageClassifier")
            }}/>
            <SearchBar
            term = {term}
            OnTermChange = {newTerm => setTerm(newTerm)}
            OnTermSubmit = {()=> SearchInList(term)}
            />
        </View>
          {/*<View>
                <Text style={styles.textInput}>هنا الصفحة الرئيسية اللي فيها الخمس انواع</Text>
          </View> */}
          <View style={styles.container}>
          {SearchOccur? 
          <FlatList
          contentContainerStyle = {styles.grid}
          numColumns = {2}
          data = {SearchList}
          keyExtractor = {(item)=>item.key}
          onRefresh = {()=>fetchData()}
          refreshing = {loading}
          renderItem={renderItem}
          /*renderItem = {({ item }) => {
            console.log(item);
            return <Text style = {styles.item}>{item}</Text>
          }
          }*/
        /> 
          :
          <FlatList
            contentContainerStyle = {styles.grid}
            numColumns = {2}
            data = {CategoriesList}
            keyExtractor = {(item)=>item.key}
            onRefresh = {()=>fetchData()}
            refreshing = {loading}
            renderItem={renderItem}
            /*renderItem = {({ item }) => {
              console.log(item);
              return <Text style = {styles.item}>{item}</Text>
            }
            }*/
          />}
          </View>
      </View>

      );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 35, //20 -- 55
    },  
    textInput: {
      textAlign: 'center',
      fontSize: 20, //15
      fontWeight: 'bold',
      color:'gray',  
    },
    item: {
      width: 130,
      height: 130,
      paddingTop: 50,
      marginVertical: 8, //25 -- مربع 3
      marginHorizontal: 8, //16 -- 3 مربع
      borderRadius: 30, //100 - 50 -30 -- 0 مربع 
      shadowColor: '#9E9D24',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.90, //0.50 - 0.80
      shadowRadius: 5.65, // 4.65
    },
    grid: {
      marginBottom: 32,
      marginVertical: 8,
      alignItems: 'center',
    },
    icon: {
      left: 12,
      marginTop: 10,
    }
  });
export default HomeScreen;

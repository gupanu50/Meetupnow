import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ImageBackground,
  Platform,
  Alert,
  BackHandler,
  RefreshControl
} from 'react-native';
import { COLORS, FONT_FAMILIES } from '../../Configration';
import withConnect from './withConnect';
import NavHeader from '../../ReuableComponent/NavHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Images } from '../../Assets';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import * as Constant from "../../Constant";
import Network from '../../Network';
import ModalLoader from '../../ReuableComponent/ModalLoader';
import { useIsFocused } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { navigationRef } from '../../Navigator';
import { useDispatch } from 'react-redux';
import { ActionType } from '../../Redux/Type';
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
const { REDVISIBLE } = ActionType;
const { RECEIVERPROFILE, DASHBOARD } = Constant.SCREENS;


const Dashboard = (props: any) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [Sort, setSort] = useState(false);
  const [Filter, setFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  let visibleRed;
  const { search } = props;
  var SEARCH: any;
  const [Search, setSearch] = useState('');
  const [data, setData] = useState<any>();
  const [Online, setOnline] = useState('');
  const [sortData, setsortData] = useState('');
  const [selectedBrands, setSelectedBrands] = React.useState([]);
  const [findCity, setfindCity] = useState(true);
  const [bestMeetUp, setBestMeetUp] = useState<any>(false);
  const [click, setClick] = useState(false);
  const [id1, setId1] = useState();
  const [check, setCheck] = useState<any>();
  let sendSortToApi = '';
  const [cityListData, setCityListData] = useState([]);
  const [selectCity, setSelectCity] = useState('');
  const [chatLoader, setIsLoader] = useState(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const logExit = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit', [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => BackHandler.exitApp(),
      }
    ],
      { cancelable: true }
    )
  }
  useBackHandler(() => {
    const routeInfo = navigationRef.current.getCurrentRoute();
    if (routeInfo.name.toLowerCase() === DASHBOARD) {
      logExit();
    } else {
      if (navigationRef.current.canGoBack()) {
        navigationRef.current.goBack();
      }
    }
    return true
  });
  if (search?.search !== '') {
    SEARCH = search?.search ?? '';
  }
  if (SEARCH == undefined) {
    SEARCH = search?.search ?? '';
  }

  const SORT = [
    { id: 1, img: Images.age, name: 'Age (low to high)', value: 'l_t_h' },
    { id: 2, img: Images.age, name: 'Age (high to low)', value: 'h_t_l' },
  ];



  const [filterData, setfilterData] = useState([
    { key: 1, img: Images.city, name: 'City', slug: 'city' },
    { key: 2, img: Images.bestmeetup, name: 'Best MeetUp', slug: 'best meetUp' },
  ]);

  const renderMenu = (item: any) => {
    const { visibility, age } = item.item;
    let gender

    if (item.item.gender == 'male') {
      gender = Images.male;
    } else {
      gender = Images.female;
    }

    return (
      <>
        {visibility === 1 &&
          <TouchableWithoutFeedback onPress={() => navigation.navigate(RECEIVERPROFILE, { id: item.item.id })}>
            <View style={[styles.flatlist, { maxWidth: '47%' }]}>
              <ImageBackground source={{ uri: item.item.imageurl }} style={styles.bgimg}>
                <View style={styles.gender}>
                  <Image source={gender} style={styles.genderStyle} />
                  <Image source={Images.online} style={[styles.onlinebtn, { tintColor: (item.item.online == 0) ? 'red' : '' }]} />
                </View>
                <View style={styles.flatdata}>
                  <LinearGradient colors={['rgba(0,0,0,0.01)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)']} style={styles.name}>
                    <View
                      style={[styles.up, { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 }]}>
                      <Image style={styles.location} source={Images.location} />
                      <Text
                        style={[
                          styles.txt,
                          {
                            fontSize: responsiveFontSize(1.6),
                            color: COLORS.WHITE,
                            fontWeight: '800',
                            fontFamily: FONT_FAMILIES.INTER_EXTRABOLD
                          },
                        ]}>
                        {' ' + item.item.city}
                      </Text>
                    </View>
                    <View style={[styles.up, { marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', width: '80%' }]}>
                      <Text
                        style={[
                          styles.txt,
                          {
                            fontSize: responsiveFontSize(1.9),
                            color: COLORS.WHITE,
                            fontWeight: 'bold',
                            fontFamily: FONT_FAMILIES.INTER_EXTRABOLD
                          },
                        ]}>
                        {item.item.name}
                      </Text>
                      <Text style={[styles.txt,
                      {
                        fontSize: responsiveFontSize(1.8),
                        color: COLORS.WHITE,
                        fontWeight: '800',
                        fontFamily: FONT_FAMILIES.INTER_EXTRABOLD
                      }
                      ]}>{age}</Text>
                    </View>
                  </LinearGradient>
                </View>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>}
      </>
    );
  };



  const renderSort = (item: any) => {
    const { img, name, id, value } = item.item;

    const sort = () => {
      console.log('sort called')
      if (sortData == name) {
        console.log('sort  if called')
        setsortData('');
        setSort(false);
        callApi()
      }
      else {
        console.log('sort  else called', value)
        setsortData(name);
        sendSortToApi = value;
        setSort(false);
        setClick(false);
        setCheck('');
        callApi()
      }
    }
    const sort1 = () => {
      console.log('sort1 called')
      if (sortData == name) {
        setsortData('');
        setClick(false);
        setCheck('');
        setSort(false);
      }
      else {
        setsortData(name);
        setSort(false);
      }
    }
    return click == true && id1 === id ? (
      <TouchableOpacity onPress={() => sort1()}>
        <View style={[styles.sortcontainer1, { borderColor: (sortData == name) ? 'green' : '#E2E2E2', height: click ? hp(20) : hp(8) }]}>
          <View style={styles.sortcontainer2}>
            <View style={styles.left}>
              <Image source={img} />
            </View>
            <View style={styles.right}>
              <Text style={[styles.txt]}>{name}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => sort()}>
        <View style={[styles.sortcontainer, { borderColor: (sortData == name) ? 'green' : '#E2E2E2' }]}>
          <View style={styles.left}>
            <Image source={img} />
          </View>
          <View style={styles.right}>
            <Text style={[styles.txt]}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderFilter = ({ item, index }) => {
    const { name, slug, key } = item;
    const isSelected = selectedBrands.filter((i) => i === slug).length > 0;
    function checkCity(selectedBrands) {
      return (
        selectedBrands == 'city'
      )
    }
    function checkBestMeetUp(selectedBrands) {
      return (
        selectedBrands == 'best meetUp'
      )
    }
    if (selectedBrands.find(checkBestMeetUp) == 'best meetUp') {
      setBestMeetUp(true);
    } else {
      setBestMeetUp(false);
    }
    if (selectedBrands.find(checkCity) == 'city') {
      setfindCity(true);
    } else {
      setfindCity(false);
    }
    return (
      <TouchableOpacity
        onPress={() => {
          if (isSelected) {
            setSelectedBrands((prev) => prev.filter((i) => i !== slug));
            { slug === 'city' && setSelectCity('') }
          }
          else {
            // @ts-ignore
            setSelectedBrands(prev => [...prev, slug])
          }
        }}
      >
        <View style={[styles.sortcontainer1, { borderColor: isSelected ? 'green' : '#E2E2E2', height: (findCity && key === 1) ? hp(17) : hp(8) }]}>
          <View style={styles.sortcontainer2}>
            <View style={styles.left}>
              <Image source={item.img} />
            </View>
            <View style={styles.right}>
              <Text style={[styles.txt]}>{name}</Text>
            </View>
          </View>
          {(findCity && key === 1) && <View style={styles.cityFoundView}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={cityListData}
              placeholder={'Select City'}
              inputSearchStyle={styles.inputSearchStyle}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.itemTextColor}
              value={selectCity}
              search
              searchPlaceholder="Search your city here"
              onChange={(item: any) => {
                setSelectCity(item.value);
              }}
            />
            <View style={{ height: Platform.OS === 'ios' ? hp(1) : hp(1) }}></View>
            <TouchableOpacity style={styles.cityTouchable} onPress={() => { setFilter(false), callApi() }}>
              <Text style={styles.searchText}>{'Search'}</Text>
            </TouchableOpacity>
          </View>}
        </View>
      </TouchableOpacity>
    );
  };
  const onRefresh = () => {
    setIsRefresh(true);
  };
  // ****************************************use effect************************************************

  useEffect(() => {
    callApi()
  }, [SEARCH, isFocused, isRefresh])

  // ****************************************call api************************************************
  const callApi = async () => {
    setLoading(true);
    setSearch(SEARCH)
    const body = new FormData();
    body.append('search', SEARCH);
    body.append('city', selectCity);
    body.append('best_meetup', bestMeetUp);
    body.append('sort', sendSortToApi);
    const result: any = await Network.createApiClient().dashboardSearch(body);
    if (result.status && result.data.success) {
      setLoading(false);
      const DATA = result.data
      setData(DATA.data)
      setOnline(DATA.onlineusers);
      DATA.new_notification == 0 ? visibleRed = false : visibleRed = true;
      dispatch({ type: REDVISIBLE, payload: visibleRed });
      setIsRefresh(false);
    } else {
      setLoading(false);
      console.log('api not working');
      setIsRefresh(false);
    }
  }
  const callApiCities = async () => {
    setLoading(true);
    try {
      const result: any = await Network.createApiClient().getCities();
      const cities: any[] = result?.data?.data;
      if (Array.isArray(cities)) {
        setCityListData(
          // @ts-ignore
          cities.map(states => ({
            label: states,
            value: states,
          })),
        );
      } else {
        console.error(
          'Invalid API response format. Expected an array of cities.',
        );
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }
  return (
    <View style={styles.container}>
      <NavHeader
        // @ts-ignore
        title={'Dashboard'}
        searchBar={true}
        isRightAction={true}
        dashboardHeader={true}
      />
      <View style={styles.main}>
        <View style={styles.inside}>
          <View style={[styles.first, {}]}>
            <View style={[styles.firstin, {}]}>
              <View style={[styles.online, { width: wp(47) }]}>
                <Text style={[styles.txt, { fontWeight: '400', fontSize: responsiveFontSize(3) }]}>{'Online Users'}</Text>
                <Text style={[styles.txt, { color: '#112BB8', fontWeight: '400', fontSize: responsiveFontSize(3) }]}> {Online}</Text>
              </View>
              <View style={styles.filter}>
                <TouchableOpacity
                  style={styles.filterbtn}
                  onPress={() => { setFilter(true), callApiCities() }}>
                  <Image source={Images.filter} style={{ tintColor: 'black' }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSort(true)}
                  style={[
                    styles.filterbtn,
                    { width: wp('20%'), flexDirection: 'row' },
                  ]}>
                  <Text
                    style={[styles.txt, { fontSize: responsiveFontSize(1.6), fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>
                    {'Sort By'}
                  </Text>
                  <View style={styles.polygon}>
                    <Image source={Images.filter_arrow} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.flat}>
            {data?.length > 0 ?
              <FlatList
                refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
                numColumns={2}
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={renderMenu}
              /> :
              <View style={styles.dataNotFoundView}>
                <Text style={styles.dataNotFoundText}>No User found</Text>
              </View>}
          </View>
        </View>
        <Modal animationType={'slide'} transparent={true} visible={Filter}>
          <View style={[styles.modal, { height: findCity ? hp(33) : hp(23) }]}>
            <View style={styles.cross}>
              <TouchableOpacity onPress={() => { setFilter(false), callApi() }}>
                <View style={styles.modalTouchView}>
                  <Image style={styles.close} source={Images.close_button} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.sortflatlist, { height: hp(40) }]}>
              <FlatList
                data={filterData}
                renderItem={renderFilter}
                scrollEnabled={false}
              />
            </View>
          </View>
        </Modal>
        <Modal animationType={'slide'} transparent={true} visible={Sort}>
          <View style={[styles.modal, { left: 108, height: !click ? hp(20) : hp(35) }]}>
            <View style={styles.cross}>
              <TouchableOpacity onPress={() => setSort(false)}>
                <View style={styles.modalTouchView}>
                  <Image style={styles.close} source={Images.close_button} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.sortflatlist, { height: !click ? hp(16.5) : hp(32) }]}>
              <FlatList
                data={SORT}
                renderItem={renderSort}
                scrollEnabled={false}
              />
            </View>
          </View>
        </Modal>
      </View>
      <ModalLoader loading={loading || chatLoader} />
    </View>
  );
};

export default withConnect(Dashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    alignItems: 'center',
    flex: 1,
    top: '7%',
  },
  inside: {
    height: hp('100%'),
    width: wp('95%'),
  },
  first: {
    height: hp('5.3%'),
    justifyContent: 'flex-end',
  },
  firstin: {
    height: hp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  online: {
    height: hp('4%'),
    width: wp('40%'),
    flexDirection: 'row',
  },
  txt: {
    fontSize: responsiveFontSize(2.3),
    color: '#444444',
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR
  },
  filter: {
    height: hp('4%'),
    width: wp('35%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  filterbtn: {
    backgroundColor: COLORS.WHITE,
    width: wp('12%'),
    height: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 10,
  },
  polygon: {
    height: hp('3%'),
    width: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flat: {
    flex: Platform.OS == 'android' ? 0.72 : 0.65
  },
  flatlist: {
    margin: 5,
    flex: 1,
    elevation: 5,
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(28),
    overflow: 'hidden',
    width: wp(45),
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    borderRadius: 20,
  },
  img: {
    height: hp(22),
    width: wp(37)
  },
  gender: {
    height: hp(3),
    width: wp(37),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    height: hp(8),
    justifyContent: 'center',
    // marginBottom: Platform.OS === 'android' ? 0 : 0,
    // marginTop: hp(10),
    // backgroundColor:'lightblue',
    // justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,1)',
    // alignItems: 'flex-start',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  up: {
    height: hp(3),
  },
  modal: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(20),
    width: wp(70),
    borderRadius: 8,
    left: 23,
    top: Platform.OS === 'android' ? 200 : 245,
    elevation: 10,
    borderColor: '#E2E2E2',
    borderWidth: 1,
  },
  cross: {
    height: hp(2.6),
    width: wp(68),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  close: {
    tintColor: 'black',
  },
  sortflatlist: {
    height: hp(16.5),
    alignItems: 'center',
  },
  sortcontainer: {
    height: hp(7),
    width: wp(65),
    marginVertical: 5,
    borderRadius: 8,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    flexDirection: 'row'
  },
  sortcontainer1: {
    width: wp(65),
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortcontainer2: {
    flexDirection: 'row'
  },
  left: {
    width: wp(20),
    height: hp(6.8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    height: hp(6.8),
    width: wp(40),
    justifyContent: 'center',
  },
  filterdata: {
    height: hp(5),
    alignItems: 'flex-end'
  },
  insidefilterdata: {
    width: wp(35),
    height: hp(5),
    flexDirection: 'row'
  },
  leftfilter: {
    height: hp(5),
    width: wp(17),
    alignItems: 'center'
  },
  bgimg: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  onlinebtn: {
    height: hp(2),
    width: wp(4),
    resizeMode: 'contain'
  },
  flatdata: {
    height: hp(24.5),
    width: wp(45),
    justifyContent: 'flex-end',
    // backgroundColor:'red'
  },
  location: {
    tintColor: COLORS.WHITE,
    resizeMode: 'contain'
  },
  genderStyle: {
    resizeMode: 'contain',
  },
  dataNotFoundView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dataNotFoundText: {
    color: COLORS.BLACK, fontWeight: '500',
    fontSize: responsiveFontSize(3), fontFamily: FONT_FAMILIES.INTER_REGULAR
  },
  cityFoundView: {
    height: Platform.OS === 'ios' ? hp(9.6) : hp(10),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  cityTextfield: {
    fontSize: responsiveFontSize(1.7),
    width: Platform.OS === 'ios' ? wp(32) : wp(35),
    height: Platform.OS === 'android' ? hp(5) : hp(5),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    alignItems: 'center',
    top: Platform.OS === 'ios' ? hp(1) : hp(0),
    fontWeight: '300',
    textAlign: 'center'
  },
  cityTouchable: {
    height: hp(3.25), width: wp(45),
    borderRadius: 30, alignItems: 'center',
    backgroundColor: COLORS.LOGINBUTTON,
    justifyContent: 'center'
  },
  searchText: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.INTER_BOLD,
    fontWeight: '500',
  },
  terms: {
    height: 23,
    width: 23,
    borderColor: COLORS.CHECKBOXBORDER,
    borderWidth: 2,
    borderRadius: 5
  },
  overlay: {
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
  dropdown: {
    height: hp(4),
    width: wp(45),
    backgroundColor: COLORS.SHADOW,
    borderRadius: 8,
    paddingHorizontal: hp(2),
    borderColor: COLORS.WHITE,
    borderWidth: 1.4,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(1.7),
    color: 'grey',
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(1.5),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontWeight: '400',
  },
  itemTextColor: {
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontSize: responsiveFontSize(1.5)
  },
  inputSearchStyle: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(1.5)
  },
  modalTouchView: {
    width: wp(10),
    alignItems: 'flex-end',
    height: hp(2.5),
    justifyContent: 'center'
  }
});
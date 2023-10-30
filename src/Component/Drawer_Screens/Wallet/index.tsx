import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Platform,
  LogBox,
  Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { requestPurchase, useIAP } from 'react-native-iap';
import NavHeader from './../../../ReuableComponent/NavHeader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Images } from '../../../Assets';
import { COLORS, FONT_FAMILIES } from '../../../Configration';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import CardView from 'react-native-cardview';
import ApiClient from '../../../Network';
import { showMessage } from 'react-native-flash-message';
import { FlatList } from 'react-native-gesture-handler';
import withConnect from './withConnect';
import { SCREENS } from "../../../Constant";
import Network from '../../../Network';
import ModalLoader from "../../../ReuableComponent/ModalLoader";
import { useDispatch } from 'react-redux';
import { ActionType } from '../../../Redux/Type';
const { SAVE_COIN } = ActionType;
const { DASHBOARD } = SCREENS;
const Wallet = (props: any) => {
  const { user, saveCoin } = props;
  const dispatch = useDispatch();
  const { getProducts, products } = useIAP();
  const isFocused = useIsFocused();
  const [Screen, setScreen] = useState(1);
  const [key, setKey] = useState();
  const [countcoin, setcountcoin] = useState(1);
  const [countcoin1, setcountcoin1] = useState(1);
  const [orderid, setorderid] = useState(100)
  const [amounttotal, setamounttotal] = useState<any>("")
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [totalcoin, settotalcoin] = useState<any>(0)
  const [totalcoin1, settotalcoin1] = useState<any>(0)
  const [amount1, setamount1] = useState<any>(0)
  const [amount, setamount] = useState<any>(0)
  const navigation: any = useNavigation();
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [transferEarnedCoins, setTransferEarnedCoins] = useState<number | string>();
  const [earnedCoin, setEarnedCoin] = useState<number>();
  const [rewardCoin, setRewardCoin] = useState<number>();
  useEffect(() => {
    setamounttotal(key == 1 ? countamount(key, countcoin) : countamount(key, countcoin1))
  }, [key])

  useEffect(() => {
    calculatecoin();
  }, [totalcoin, amount, amount1, totalcoin1])

  // const addcoinGateway = async () => {
  //   const productIds: any = ['com.meetupnow.1100', 'com.meetupnow.2100'];
  //   await getProducts({ skus: productIds });
  //   // const getProductId: any = await products[0].name;
  //   // console.log("productId" , getProductId)
  //   // await requestPurchase({ skus: productIds })
  // };
  const countacoin = (activekey, count) => {
    const coinss = data.find((item: any) => item.id == activekey)
    // @ts-ignore
    return coinss?.coin * count || 0
  }

  const countamount = (activekey, count) => {
    const amount = data.find((item: any) => item.id == activekey)
    // @ts-ignore
    const detailsamount = amount?.price * count || 0
    return detailsamount

  }

  const increment = () => {
    setcountcoin(
      countcoin + 1
    );
  }

  const decrement = () => {
    if (countcoin > 1) {
      setcountcoin(countcoin - 1);
    } else {
      setcountcoin(
        1
      );
    }
  }


  const increment1 = () => {
    setcountcoin1(
      countcoin1 + 1
    );
  }

  const decrement2 = () => {
    if (countcoin1 > 1) {
      setcountcoin1(countcoin1 - 1);
    } else {
      setcountcoin1(1);
    }
  }

  // ****************** useEffect ************************
  useEffect(() => {
    coinPlan();
  }, []);
  useEffect(() => {
    getProfile();
  }, [earnedCoin, rewardCoin, isFocused]);
  //***********************  get profile Api      ***************** */
  const getProfile = async () => {
    const result2: any = await Network.createApiClient().getProfile();
    setEarnedCoin(result2.data.data.earned_coin);
    setRewardCoin(result2.data.data.referrel_coin);
    dispatch({ type: SAVE_COIN, payload: result2.data.data.balance });
    console.log("earnedandrewardcoins", earnedCoin, rewardCoin, result2)
  }
  //   ********************** coin ucalculate*************
  const calculatecoin = async () => {
    const body = new FormData();
    if (Screen === 2) {
      body.append('coins', totalcoin ? totalcoin : 0);
    }
    else {
      body.append('coins', totalcoin1 ? totalcoin1 : 0);
    }
    console.log('mobile13', body);
    const result: any = await Network.createApiClient().Calculate_coins(body);
    console.log('calculateresult', result);
    if (result.data) {
      if (Screen === 2) {
        setamount(result.data.data.amount)
      }
      else {
        setamount1(result.data.data.amount)
      }
    } else {
      showMessage({ message: result.data.message, type: 'danger' });
    }
  }

  // ********************** coinPlan *****************
  const coinPlan = async () => {
    setLoading(true)
    const result: any = await ApiClient.createApiClient().coinplan();
    let DATA: any = result.data.data;
    if (result.status && result.data.success === true) {
      setData(DATA);
      // addcoinGateway();
      setLoading(false);
    } else {
      setLoading(false);
      showMessage({ message: result.data.message, type: 'danger' });
    }
  };


  // ************************** add coins api ***************************************
  const addcoin = async () => {
    if (key) {
      setLoading(true)
      const body: any = new FormData();
      body.append('package_id', key);
      body.append('amount', amounttotal);
      body.append('order_id', orderid);
      body.append('status', key == 0 ? "0" : "1");
      body.append('quantity', key == 1 ? countcoin : countcoin1);
      console.log('mobile11', body);
      const result: any = await Network.createApiClient().Add_coins(body);
      console.log('newbodylog', result);
      if (result.data) {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'success' });
        const result1: any = await Network.createApiClient().getProfile();
        // addcoinGateway();
        navigation.navigate(DASHBOARD);
        dispatch({ type: SAVE_COIN, payload: result1.data.data.balance });
      } else {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'danger' });
      }
    }
    else {
      setLoading(false);
      showMessage({ message: "Please select atleast one plan", type: 'danger' });
    }
  }
  // if(products.length!=0){
  //   console.log('runningproductsif',products);
  //   setData([...data, products]);
  // }
  // useEffect(()=>{
  //   if(products.length!=0){
  //       console.log('runningproductsif',products);
  //       setData([...data, products]);
  //     }
  // },[products])
  console.log('products', products);
  console.log('DataNewArray', data);
  // ************************** withdraw coins api ***********************************
  const withdrawcoin = async () => {
    setLoading(true)
    if (totalcoin != 0 || totalcoin1 != 0) {
      const body: any = new FormData();
      if (Screen == 2) {
        body.append('coins', totalcoin);
        body.append('amount', amount);
        body.append('type', "1");
      }
      else {
        body.append('coins', totalcoin1);
        body.append('amount', amount1);
        body.append('type', "2");
      }
      console.log('mobile11', body);
      const result: any = await Network.createApiClient().withdraw_coins(body);
      console.log('withdraw coin', result);
      if (result.data.status) {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'success' });

        navigation.navigate(DASHBOARD);
      } else {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'danger' });
      }
    }
    else {
      setLoading(false);
      showMessage({ message: "Please enter coin quantity", type: 'danger' });
    }
  }
  // ************************** transfer coins api ***********************************
  const transferCoin = async () => {
    setVisible1(false);
    setLoading(true)
    if (transferEarnedCoins != 0) {
      const body: any = new FormData();
      body.append('coins', transferEarnedCoins);
      body.append('type', "1");
      console.log('transfercoinbody', body);
      const result: any = await Network.createApiClient().coin_transfer(body);
      console.log('transfercoinresult', result);
      if (result.data.success) {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'success' });
        const result1: any = await Network.createApiClient().getProfile();
        dispatch({ type: SAVE_COIN, payload: result1.data.data.balance });
        setTransferEarnedCoins("");
        setEarnedCoin(result1.data.data.earned_coin);
      } else {
        setLoading(false);
        showMessage({ message: result.data.message, type: 'danger' });
        setTransferEarnedCoins("");
      }
    }
    else {
      setLoading(false);
      showMessage({ message: "Please enter coin quantity", type: 'danger' });
    }
  }
  // ************************************ add coins*****************************************
  const renderPlan = (item: any) => {
    console.log('plansrenderitem', item.item)
    const { id, coin, no_of_chat, no_of_request, price } = item.item;
    return (
      <View style={[styles.rectangle, { backgroundColor: (id == 1) ? '#FFDEE8' : '#9CC0FF' }]}>
        <View style={styles.insiderectangle}>
          <View style={styles.leftRectangle}>
            <Image source={Images.coin} />
          </View>
          <View style={styles.centerRectangle}>
            <View style={styles.uprect}>
              <View style={styles.coins}>
                <Text style={[styles.txt, { color: id == 1 ? '#D7124B' : '#0C357C', fontWeight: 'bold', fontFamily: FONT_FAMILIES.ROBOTO_REGULAR }]}>{coin + ' COINS'}</Text>
              </View>
              <View style={[styles.coins, { alignItems: 'flex-end' }]}>
                <View style={[styles.inrbutton, { backgroundColor: id == 1 ? '#BA3C60' : '#2A6BDE' }]}>
                  <Image source={Images.rupee} style={{ tintColor: COLORS.WHITESHADOW }} />
                  <Text style={[styles.txt, { color: COLORS.WHITESHADOW, fontWeight: 'bold' }]}>{price}</Text>
                </View>
              </View>
            </View>
            <View style={styles.uprect}>
              <View style={styles.insiderect}>
                <View style={[styles.request, { backgroundColor: id == 1 ? '#FF8DAE' : '#053B99' }]}>
                  <Text style={[styles.txt, { color: COLORS.WHITE, fontSize: wp(3), fontFamily: FONT_FAMILIES.INTER_REGULAR, fontWeight: '600' }]}>{no_of_request + ' REQUESTS'}</Text>
                </View>
                <View style={[styles.request, { backgroundColor: id == 1 ? '#EB4273' : '#03245F', borderTopRightRadius: hp(.5), borderBottomRightRadius: hp(.5), borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}>
                  <Text style={[styles.txt, { color: COLORS.WHITESHADOW, fontSize: wp(3), fontFamily: FONT_FAMILIES.INTER_REGULAR, fontWeight: '600' }]}>{no_of_chat + ' MEETUP'}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rightRectangle}>
            <View style={styles.insiderightrect}>
              <TouchableOpacity onPress={() => setKey(id)}>
                <ImageBackground style={styles.outCircle} source={Images.out_circle}>
                  {(key === id) ? <Image source={Images.in_circle} style={styles.inCircle} /> : null}
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // **********************************************addCoins************************************************
  const addCoins = (
    <>
      <View style={styles.second}>
        <FlatList
          data={data}
          renderItem={renderPlan}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {key ? <View style={styles.countmainview}>
        <View style={styles.countsubview}>
          <View style={styles.counttabview}>
            <View style={styles.plusbuttonview}>
              <TouchableOpacity onPress={() => key == 1 ? decrement() : decrement2()}>
                <ImageBackground
                  resizeMode={'contain'}
                  // @ts-ignore
                  source={Images.circle}
                  style={{
                    height: hp(5),
                    width: wp(6.7),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.addbuttonText}>{'-'}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <View style={styles.valueview}>
              <Text style={{ fontSize: responsiveFontSize(2.7), color: "white", fontWeight: "700" }}>{key == 1 ? countcoin : countcoin1}</Text>
            </View>
            <View style={styles.minusbuttonview}>
              <TouchableOpacity onPress={() => key == 1 ? increment() : increment1()} >
                <ImageBackground
                  resizeMode={'contain'}
                  // @ts-ignore
                  source={Images.circle}
                  style={{
                    height: hp(5),
                    width: wp(6.7),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.minusbuttonText}>{'+'}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View> : null}
      <View style={styles.last}>
        <View style={styles.insidelast}>
          <View style={styles.purchase}>
            <View style={styles.leftpurchase}>
              <View style={styles.insideleftpurchase}>
                <Text
                  style={[
                    styles.txt,
                    {
                      fontSize: wp(3),
                      left: 10,
                      fontFamily: FONT_FAMILIES.INTER_REGULAR,
                    },
                  ]}>
                  {'Total Purchase Coin'}
                </Text>
                <Text
                  style={[styles.txt, { color: COLORS.BOTTOM_COLOR, left: 10 }]}>
                  {key == 1 ? countacoin(key, countcoin) : countacoin(key, countcoin1)}
                </Text>
              </View>
            </View>
            <View style={styles.rightpurchase}>
              <View style={styles.insideleftpurchase}>
                <Text
                  style={[
                    styles.txt,
                    {
                      fontSize: wp(3),
                      left: 8,
                      fontFamily: FONT_FAMILIES.INTER_REGULAR,
                    },
                  ]}>
                  {'Total Purchase Amount'}
                </Text>
                <View style={styles.inr}>
                  <View style={styles.upinr}>
                    <Image source={Images.rupee} style={styles.rupee} />
                  </View>
                  <View style={styles.downinr}>
                    <Text style={[styles.txt, { color: COLORS.LOGINBUTTON }]}>
                      {key == 1 ? countamount(key, countcoin) : countamount(key, countcoin1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.pay} onPress={() => addcoin()}>
            <Text
              style={[
                styles.txt,
                {
                  color: COLORS.WHITESHADOW,
                  fontSize: wp(4),
                  fontFamily: FONT_FAMILIES.INTER_BOLD,
                },
              ]}>
              {'Pay Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // ******************************************* withdraw coin *************************************
  const withdrawCoins = (
    <>
      <View style={styles.withdrawview}>
        <View style={styles.coin}>
          <CardView
            style={styles.inp}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <TextInput
              style={styles.textInput}
              value={totalcoin}
              placeholder="Enter Coins here"
              placeholderTextColor={COLORS.GRAY}
              keyboardType={'number-pad'}
              onChangeText={(txt: any) => { settotalcoin(txt) }}
            />
          </CardView>
        </View>
        <View style={styles.exchange}>
          <Image source={Images.exchange} />
        </View>
        <View
          style={[styles.coin, { height: hp(10), justifyContent: 'flex-start' }]}>
          <View style={styles.rs}>
            <Text
              style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>
              {'Rs'}
            </Text>
          </View>
          <CardView
            style={styles.inp}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <Text style={{ color: "black", fontWeight: "700", paddingLeft: 10, fontSize: responsiveFontSize(2.1) }}>{amount}</Text>
          </CardView>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.pay} onPress={() => withdrawcoin()}>
            <Text
              style={[
                styles.txt,
                {
                  color: COLORS.WHITESHADOW,
                  fontSize: responsiveFontSize(2.3),
                  fontFamily: FONT_FAMILIES.INTER_BOLD,
                },
              ]}>
              {'Withdraw Coins'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.pay} onPress={() => setVisible1(true)}>
            <Text
              style={[
                styles.txt,
                {
                  color: COLORS.WHITESHADOW,
                  fontSize: responsiveFontSize(2.3),
                  fontFamily: FONT_FAMILIES.INTER_BOLD,
                },
              ]}>
              {'Add to Purchase coins'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // ******************************************* referral coin *************************************
  const referralCoins = <>
    <View style={styles.withdrawview}>
      <View style={styles.coin}>
        <CardView
          style={styles.inp}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={5}
          borderWidth={1}>
          <TextInput
            style={styles.textInput}
            value={totalcoin1}
            placeholder="Enter Coins here"
            placeholderTextColor={COLORS.GRAY}
            keyboardType={'number-pad'}
            onChangeText={(txt: any) => { settotalcoin1(txt) }}
          />
        </CardView>
      </View>
      <View style={styles.exchange}>
        <Image source={Images.exchange} />
      </View>
      <View
        style={[styles.coin, { height: hp(10), justifyContent: 'flex-start' }]}>
        <View style={styles.rs}>
          <Text
            style={[styles.txt, { fontFamily: FONT_FAMILIES.INTER_REGULAR }]}>
            {'Rs'}
          </Text>
        </View>
        <CardView
          style={styles.inp}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={5}>
          {Screen != 3 ? <Text>{"0"}</Text> : <Text style={{ color: "black", fontWeight: "700", paddingLeft: 10, fontSize: responsiveFontSize(2.1) }}>{amount1}</Text>}
        </CardView>
      </View>
      <View style={styles.button}>
        <TouchableOpacity style={styles.pay} onPress={() => withdrawcoin()}>
          <Text
            style={[
              styles.txt,
              {
                color: COLORS.WHITESHADOW,
                fontSize: responsiveFontSize(2.3),
                fontFamily: FONT_FAMILIES.INTER_BOLD,
              },
            ]}>
            {'Withdraw Coins'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </>;

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.LOGINBACKGROUND }}>
      {/* @ts-ignore */}
      <NavHeader isBack={true} title={'meet'} isRightAction={true} right />

      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.insidemain}>
            <View style={styles.add}>
              <View style={[styles.left, {}]}>
                <View style={[styles.insideleft, {}]}>
                  {Screen == 1 ?
                    <Text style={styles.txt}>{'Add Coins Balance'}</Text> : Screen == 2 ?
                      <Text style={styles.txt}>{'Earned Coins Balance'}</Text> :
                      <Text style={styles.txt}>{'Reward Coins Balance'}</Text>}
                </View>
              </View>
              <View style={[styles.right, {}]}>
                <View style={[styles.insideright, {}]}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Image source={Screen == 1 ? Images.coin : Images.greencoin} style={styles.coinimg} />
                    {Screen == 1 ? <Text
                      style={[
                        styles.txt,
                        { color: COLORS.LOGINBUTTON, fontWeight: 'bold' },
                      ]}>
                      {saveCoin}
                    </Text> : Screen == 2 ? <Text
                      style={[
                        styles.txt,
                        { color: COLORS.LOGINBUTTON, fontWeight: 'bold' },
                      ]}>
                      {earnedCoin}
                    </Text> :
                      <Text
                        style={[
                          styles.txt,
                          { color: COLORS.LOGINBUTTON, fontWeight: 'bold' },
                        ]}>
                        {rewardCoin}
                      </Text>}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.first}>
              <View style={styles.insidefirst}>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      {
                        backgroundColor:
                          Screen == 1
                            ? COLORS.BOTTOM_COLOR
                            : COLORS.WHITESHADOW,
                      },
                    ]}
                    onPress={() => setScreen(1)}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          fontSize: wp(2.9),
                          color:
                            Screen == 1 ? COLORS.WHITESHADOW : COLORS.BLACK,
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Add Coins'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setScreen(2)}
                    style={[
                      styles.btn,
                      {
                        backgroundColor:
                          Screen == 2
                            ? COLORS.BOTTOM_COLOR
                            : COLORS.WHITESHADOW,
                        borderColor: COLORS.TEXTBORDER,
                        borderWidth: 1,
                        width: wp(25),
                      },
                    ]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          fontSize: wp(2.8),
                          color:
                            Screen == 2 ? COLORS.WHITESHADOW : COLORS.BLACK,
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Earned Coins'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setScreen(3)}
                    style={[
                      styles.btn,
                      {
                        backgroundColor:
                          Screen == 3
                            ? COLORS.BOTTOM_COLOR
                            : COLORS.WHITESHADOW,
                        borderColor: COLORS.TEXTBORDER,
                        borderWidth: 1,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.txt,
                        {
                          fontSize: wp(2.8),
                          color:
                            Screen == 3 ? COLORS.WHITESHADOW : COLORS.BLACK,
                          fontFamily: FONT_FAMILIES.INTER_REGULAR,
                        },
                      ]}>
                      {'Reward Coins'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.plan}>
              <View style={styles.insideplan}>
                <Text style={styles.txt}>
                  {Screen == 1 ? 'Select Plan' : 'Enter Coins'}
                </Text>
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                  <Image source={Images.red_information} />
                </TouchableOpacity>
              </View>
            </View>
            {Screen == 1 && addCoins}
            {Screen == 2 && withdrawCoins}
            {Screen == 3 && referralCoins}
          </View>
        </View>
        <Modal animationType={'slide'} transparent={true} visible={visible}>
          <View style={styles.modalView}>
            <View style={[styles.modal, { height: hp(25) }]}>
              <View style={styles.cross}>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <View style={styles.modalView1}>
                    <Image style={styles.close} source={Images.close_button} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.main1}>
                {Screen == 1 ? <>
                  <Text style={styles.toolModalHeading}>“Unlock Your Shortcut to Real-World Connections”</Text>
                  <Text style={styles.toolModalValue}>In order to send Meetup request to your nearby users, you will need to Purchase meetup package, for more
                    details you can check <Text style={styles.bold}>“How its works”</Text> or <Text style={styles.bold}>“FAQ”</Text> section of this app</Text>
                </> : Screen == 2 ? <>
                  <Text style={styles.toolModalHeading}>“Congratulations”</Text>
                  <Text style={styles.toolModalValue}>You can transfer your <Text style={styles.bold}>Earned coins</Text> to your Meetup Package coins at any
                    time or you can withdraw coins in to your <Text style={styles.bold}>Paytm Wallet or UPI id,</Text> in order
                    to <Text style={styles.bold}>withdraw coins</Text> there is a
                    <Text style={styles.bold}>minimum coins limit,</Text> for more details you can check
                    <Text style={styles.bold}>“How its works”</Text> or <Text style={styles.bold}>“FAQ”</Text> section of this
                    app</Text>
                </> : <>
                  <Text style={styles.toolModalHeading}>“Congratulations”</Text>
                  <Text style={styles.toolModalValue}>You can transfer your <Text style={styles.bold}>Reward coins</Text> to your Meetup Package coins at any
                    time or you can <Text style={styles.bold}>Reward coins</Text> in to your <Text style={styles.bold}>Paytm Wallet or UPI id,</Text> in order
                    to <Text style={styles.bold}>withdraw coins</Text> there is a
                    <Text style={styles.bold}>minimum coins limit,</Text> for more details you can check
                    <Text style={styles.bold}>“How its works”</Text> or <Text style={styles.bold}>“FAQ”</Text> section of this
                    app</Text>
                </>}
              </View>
            </View>
          </View>
        </Modal>
        <Modal animationType={'slide'} transparent={true} visible={visible1}>
          <View style={styles.modalView}>
            <View style={styles.modal}>
              <View style={styles.cross}>
                <TouchableOpacity onPress={() => setVisible1(false)}>
                  <View style={styles.modalView1}>
                    <Image style={styles.close} source={Images.close_button} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.second}>
                <View style={styles.insidesecond}>
                  <View style={styles.up}>
                    <Text style={[styles.txt, { fontFamily: FONT_FAMILIES.ROBOTO_REGULAR, fontSize: responsiveFontSize(2) }]}>Enter Coins that you want to add to purchase coins</Text>
                    <CardView
                      style={styles.inp1}
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={5}
                      borderWidth={1}>
                      <TextInput
                        style={styles.textInput1}
                        // @ts-ignore
                        value={transferEarnedCoins}
                        placeholder="Enter Coins here"
                        placeholderTextColor={COLORS.GRAY}
                        keyboardType={'number-pad'}
                        onChangeText={(txt: any) => { setTransferEarnedCoins(txt) }}
                      />
                    </CardView>
                  </View>
                  <View style={[styles.button, { marginTop: hp(1) }]}>
                    <TouchableOpacity style={styles.pay} onPress={() => transferCoin()}>
                      <Text
                        style={[
                          styles.txt,
                          {
                            color: COLORS.WHITESHADOW,
                            fontSize: responsiveFontSize(2.3),
                            fontFamily: FONT_FAMILIES.INTER_BOLD,
                          },
                        ]}>
                        {'Submit'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <ModalLoader loading={isLoading} />
    </View>
  );
}
export default withConnect(Wallet);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  main: {
    backgroundColor: COLORS.WHITESHADOW,
    height: Platform.OS == 'ios' ? hp('80') : hp(85),
    width: wp('95'),
    borderRadius: 30,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main1: {
    flex: 1,
    margin: hp(2),
  },
  insidemain: {
    height: Platform.OS === 'android' ? hp(80) : hp(77),
    width: wp(86.3),
  },
  txt: {
    fontSize: wp(4),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILIES.ROBOTO_REGULAR,
  },
  add: {
    backgroundColor: COLORS.LOGINBACKGROUND,
    height: hp(7),
    borderTopLeftRadius: hp(4),
    borderTopRightRadius: hp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    height: hp(7),
    width: wp(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  insideleft: {
    height: hp(6),
    width: wp(40),
    justifyContent: 'center',
    // backgroundColor:'red'
  },
  right: {
    width: wp(30),
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  insideright: {
    height: hp(6),
    flexDirection: 'row',
  },
  coinimg: {
    height: hp(3),
    width: wp(5.5),
  },
  first: {
    height: hp(8),
    justifyContent: 'flex-end',
  },
  insidefirst: {
    backgroundColor: COLORS.LOGINBACKGROUND,
    height: hp(6.5),
    borderRadius: hp(0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    height: hp(5),
    width: wp(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: COLORS.BOTTOM_COLOR,
    height: hp(5),
    width: wp(26),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(0.5),
  },
  plan: {
    height: hp(5),
    justifyContent: 'flex-end',
  },
  insideplan: {
    height: hp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  second: {
    height: hp(25)
  },
  countmainview: {
    height: hp(7),
    alignItems: 'flex-end',
  },
  countsubview: {
    height: hp(7),
    width: wp(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  counttabview: {
    height: hp(5),
    width: wp(34),
    backgroundColor: '#EB4273',
    borderRadius: 20,
    flexDirection: 'row',
  },
  plusbuttonview: {
    height: hp(5),
    width: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueview: {
    height: hp(5),
    width: wp(16.1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusbuttonview: {
    height: hp(5),
    width: wp(9),
  },
  addbuttonText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: 'black',
    fontFamily: FONT_FAMILIES.INTER_SEMIBOLD
  },
  minusbuttonText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: 'black',
    fontFamily: FONT_FAMILIES.INTER_SEMIBOLD
  },

  last: {
    height: hp(24),
  },
  insidelast: {
    height: hp(13),
    justifyContent: 'flex-end'
  },
  purchase: {
    height: hp(10),
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: hp(0.5),
    flexDirection: 'row',
  },
  leftpurchase: {
    width: wp(40),
    height: hp(9.75),
    borderRightWidth: 1,
    borderColor: '#C8C8C8',
    justifyContent: 'center'
  },
  insideleftpurchase: {
    height: hp(8),
    justifyContent: 'center',
  },
  rightpurchase: {
    width: wp(40),
    height: hp(9.75),
    justifyContent: 'center'
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    marginTop: hp(5)
  },
  pay: {
    backgroundColor: COLORS.LOGINBUTTON,
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(5),
  },
  up: {
    height: hp(15),
  },
  rectangle: {
    justifyContent: 'center',
    height: hp(11),
    marginVertical: 5,
    borderRadius: 8,
  },
  insiderectangle: {
    height: hp(9),
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftRectangle: {
    height: hp(9),
    width: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerRectangle: {
    height: hp(9),
    width: wp(50),
  },
  rightRectangle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insiderightrect: {
    height: hp(6),
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inr: {
    width: wp(20),
    flexDirection: 'row',
  },
  rupee: {
    height: hp(1.6),
    width: wp(2),
  },
  upinr: {
    height: hp(3.4),
    width: wp(4),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  downinr: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  uprect: {
    height: hp(4.5),
    flexDirection: 'row',
  },
  coins: {
    height: hp(4.5),
    width: wp(25),
    justifyContent: 'center',
  },
  inrbutton: {
    height: hp(3),
    width: wp(17),
    flexDirection: 'row',
    borderRadius: hp(0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  insiderect: {
    height: hp(3),
    width: wp(50),
    flexDirection: 'row',
  },
  request: {
    width: wp(25),
    height: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: hp(0.5),
    borderBottomLeftRadius: hp(0.5),
  },
  outCircle: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inCircle: {
    height: 10.3,
    width: 10,
  },
  withdrawview: {
    height: hp(40),
  },
  coin: {
    height: hp(8),
    justifyContent: 'center',
  },
  inp: {
    backgroundColor: COLORS.SHADOW,
    height: hp(6),
    justifyContent: 'center',
    borderColor: '#D7D7D7',
    borderWidth: 1
  },
  inp1: {
    marginTop: hp(1),
    backgroundColor: COLORS.SHADOW,
    height: hp(5),
    justifyContent: 'center',
    borderColor: '#D7D7D7',
    borderWidth: 1
  },
  textInput: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(2),
    left: 3,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  textInput1: {
    color: COLORS.BLACK,
    fontSize: responsiveFontSize(1.8),
    left: 3,
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
  submit: {
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  exchange: {
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rs: {
    height: hp(4),
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: COLORS.WHITESHADOW,
    height: hp(28),
    width: wp(80),
    borderRadius: hp(1.2),
    elevation: 10,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    alignItems: 'center'
  },
  cross: {
    height: hp(2.6),
    width: wp(75),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  close: {
    tintColor: 'black',
  },
  insidesecond: {
    height: hp(12),
  },
  down: {
    flex: 1,
    height: hp(9),
    width: wp(69),
    left: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  third: {
    flex: 0.9,
    justifyContent: 'flex-end'
  },
  insidethird: {
    height: hp(5),
    width: wp(79),
    borderColor: COLORS.BORDER,
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolModalHeading: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.INTER_EXTRABOLD,
    fontSize: responsiveFontSize(1.8),
    color: COLORS.BLACK
  },
  toolModalValue: {
    marginTop: hp(1),
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
    fontSize: responsiveFontSize(1.5),
    color: COLORS.BLACK
  },
  bold: {
    fontWeight: 'bold'
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000050"
  },
  modalView1: {
    alignItems: 'flex-end', 
    justifyContent: 'center', 
    width: wp(6), 
    height: hp(2.5)
  }
});

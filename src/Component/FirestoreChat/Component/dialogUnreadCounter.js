import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FONT_FAMILIES} from '../../../Configration';

export default function DialogUnreadCounter({unreadMessagesCount}) {
  return (
    unreadMessagesCount > 0 && (
      <View style={styles.container}>
        <Text style={styles.counter}>
          {unreadMessagesCount < 100 ? unreadMessagesCount : '<99'}
        </Text>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    lineHeight: 25,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'forestgreen',
  },
  counter: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FONT_FAMILIES.INTER_REGULAR,
  },
});

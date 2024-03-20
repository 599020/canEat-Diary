import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import colors from '../config/colors';
import AppText from './AppText';
import Icon from './Icon';

export default function ListItem({ image, title, klokkeslett, icon, onPress, style }) {
  // Sjekk om `image` er en URL eller en sti
  const imageSource = typeof image === 'string' ? { uri: image } : image;
  


  return (
    <View style={[styles.container, style]}>
      <Image style={styles.image} source={imageSource} resizeMode="contain" />
      <View style={styles.textContainer}>
        <AppText style={[styles.title, !klokkeslett && styles.centerVertically]} numberOfLines={1}>{title}</AppText>
        {klokkeslett && <AppText style={styles.klokkeslett} numberOfLines={1}>Kl: {klokkeslett}</AppText>}
      </View>
      <Icon containerStyle={styles.iconStyle} name={icon} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "75%",
    height: 60,
    backgroundColor: colors.light,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  image: {
    height: 40,
    width: 40,
    marginLeft: 10,
  },
  title: {
    color: colors.skrift,
    fontSize: 16,
    fontFamily: "Avenir",
    fontWeight: "700",
  },
  klokkeslett: {
    color: colors.skrift,
    fontSize: 16,
    fontFamily: "Avenir",
    fontWeight: "700",
  },
  iconStyle: {
    marginLeft: 10,
    color: colors.skrift,
  },
});

import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import colors from '../config/colors';
import AppText from './AppText';
import Icon from './Icon';

export default function ListItem({ image, title, subTitle, klokkeslett, icon, onPress, style }) {
  // Sjekk om `image` er en URL eller en sti
  const imageSource = image ? (typeof image === 'string' ? { uri: image } : image) : null;

  return (
    <View style={[styles.container, style]}>
      {imageSource && <Image style={styles.image} source={imageSource} resizeMode="contain" />}
      <View style={styles.textContainer}>
        <AppText style={[styles.title, !klokkeslett && styles.centerVertically]} numberOfLines={1}>{title}</AppText>
        {subTitle && <AppText style={styles.subTitle} numberOfLines={1}>{subTitle}</AppText>}
        {klokkeslett && <AppText style={styles.klokkeslett} numberOfLines={1}>Kl: {klokkeslett}</AppText>}
      </View>
      {icon && <Icon containerStyle={styles.iconStyle} name={icon} onPress={onPress} />}
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
    marginVertical: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "column",
    
  },
  image: {
    height: 50,
    width: 50,
    marginLeft: 10,
    borderRadius: 10,
  },
  title: {
    color: colors.skrift,
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "700",
  },
  subTitle: {
    color: colors.skrift,
    fontSize: 12,
    fontFamily: "Roboto",
    
    
  },
  klokkeslett: {
    color: colors.skrift,
    fontSize: 16,
    fontFamily: "Roboto",
    
  },
  iconStyle: {
    marginLeft: 10,
    color: colors.skrift,
  },
});
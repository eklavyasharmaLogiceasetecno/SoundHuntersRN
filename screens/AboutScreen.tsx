import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import TextView from "../components/TextView";
import { ABOUT } from "../strings/en";
import ArrowIcon from "../assets/arrowIcon.svg";
import { getHeight, getWidth } from "../libs/styleHelper";
import { fontSize } from "../theme/fontSize";
import fontFamilies from "../theme/fontfamilies";
import { useTheme } from "../theme";
import ArrowIconDark from "../assets/arrowIconDark.svg";
import { useNavigation } from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";

const data = [
  {
    id: "1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est cursus feugiat diam bibendum nam. In lectus morbi fringilla at aliquam scelerisque ut in. Consectetur urna, maecenas cursus id id habitant. Luctus aliquet sit tortor pretium elementum.",
  },
  {
    id: "2",
    text: "Montes, integer elementum nisl, curabitur nec a. Cursus semper quis tristique consectetur quis a ornare gravida nisi. Ornare arcu tellus, rhoncus mi risus, duis amet. Enim suspendisse adipiscing lobortis proin mattis dictumst luctus sem facilisi. Nisl, quis pharetra est cursus.",
  },
  {
    id: "3",
    text: "Sagittis eget sit ultricies diam posuere mauris eget. Maecenas massa turpis in sem facilisi integer accumsan venenatis massa. Sapien eget eleifend nunc tellus turpis. Sed a diam cursus diam ac turpis sed eu sed. Odio adipiscing malesuada tellus leo sit. Bibendum phasellus feugiat quam dis. In eu lorem ullamcorper platea vel fringilla. Est vitae mattis enim egestas interdum egestas mi penatibus orci. Libero mattis quam viverra sed lectus risus.",
  },
  {
    id: "4",
    text: "Rhoncus risus sit neque, velit, arcu. Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh. Nullam enim, quam varius nec malesuada. Sed congue faucibus eu justo, et ut sit ac. Neque elit diam nisi quam et. In congue at maecenas risus neque blandit. Maecenas ullamcorper nisi,",
  },
  {
    id: "5",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
  {
    id: "6",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
  {
    id: "7",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
  {
    id: "8",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
  {
    id: "9",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
  {
    id: "10",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
  {
    id: "11",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
  {
    id: "12",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
  {
    id: "13",
    text: "Mauris ipsum, sed ac, mattis donec tristique vel massa pellentesque. Ultrices non tellus elit facilisis lobortis. In purus adipiscing et hendrerit consequat aliquam facilisis nisl nibh ",
  },
];
function AboutScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.Settings as never);
  };
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
      <View style={styles.arrowIconStyle}>
        <TouchableOpacity onPress={onPressBackButton}>
          {isDark !== true ? <ArrowIcon /> : <ArrowIconDark />}
        </TouchableOpacity>
        <TextView text={ABOUT} style={styles.heading} />
      </View>
      <View style={{ backgroundColor: colors.cardComponentColor }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item: any) => {
            return (
              <TextView
                style={{
                  ...styles.discription,
                  color: colors.primarytextcolor,
                }}
                text={item.text}
                key={item.id}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getWidth(20),
  },
  arrowIconStyle: {
    height: "14%",
    justifyContent: "flex-end",
    padding: getHeight(10),
  },
  heading: {
    fontSize: fontSize.maximum,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    paddingTop: getHeight(10),
  },
  discription: {
    fontFamily: fontFamilies.moderatLight,
    padding: getHeight(20),
    fontWeight: "400",
    fontSize: fontSize.extrasmall,
  },
});

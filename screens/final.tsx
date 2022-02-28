import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { animals, Animal } from "../data";

import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  cancelAnimation,
  withRepeat,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

const CARD_PADDING = 8;
const ICON_SIZE = 24;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);
const RenimatedIcon = Reanimated.createAnimatedComponent(FontAwesome);

const LIKE_SOUND = require("../assets/pop.wav");

type Props = {
  animal: Animal;
  zIndex: number;
  playLikeSound?: () => void;
};

function AnimalCard({ animal: { name, image }, zIndex }: Props) {
  const [isSelected, setIsSelected] = React.useState(false);

  const [sound, setSound] = React.useState<Audio.Sound>();

  const playSound = React.useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(LIKE_SOUND);
    setSound(sound);

    await sound.playAsync();
  }, []);

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const ICON_MAX_SCALE = 2;
  const ICON_MIN_SCALE = 0.7;
  const ANIMATION_TIME_BASELINE = 2000;
  const X_OFFSET_TO_CENTER =
    SCREEN_WIDTH / 2 - CARD_PADDING * 2 - ICON_SIZE / 2;
  const Y_OFFSET_TO_BOTTOM = SCREEN_HEIGHT;
  const Y_OFFSET_BOUNCE = ICON_SIZE;

  const xOffset = useSharedValue(0);
  const yOffset = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const positionStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: xOffset.value },
        { translateY: yOffset.value },
        { scale: iconScale.value },
      ],
    };
  });

  const cancelAnimations = () => {
    cancelAnimation(xOffset);
    cancelAnimation(yOffset);
  };

  const onPress = () => {
    if (isSelected) {
      setIsSelected(false);
      cancelAnimations();

      xOffset.value = withSpring(0, { damping: 50 });
      yOffset.value = withSpring(0, { damping: 50 });
    } else {
      setIsSelected(true);

      playSound();
      cancelAnimations();

      xOffset.value = withSpring(-X_OFFSET_TO_CENTER, { damping: 15 });

      yOffset.value = withSequence(
        withTiming(Y_OFFSET_BOUNCE * 4, {
          duration: ANIMATION_TIME_BASELINE / 4,
        }),
        withDelay(
          ANIMATION_TIME_BASELINE / 4,
          withTiming(-Y_OFFSET_BOUNCE / 5, {
            duration: ANIMATION_TIME_BASELINE / 4,
          })
        ),
        withTiming(Y_OFFSET_TO_BOTTOM, {
          duration: ANIMATION_TIME_BASELINE / 2,
          easing: Easing.in(Easing.exp),
        })
      );

      iconScale.value = withSequence(
        withTiming(ICON_MAX_SCALE, { duration: ANIMATION_TIME_BASELINE / 2 }),
        withTiming(1, { duration: ANIMATION_TIME_BASELINE / 2 })
      );
    }
  };

  const onPressIn = () => {
    scale.value = withTiming(ICON_MIN_SCALE, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { mass: 0.2 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const iconColor = isSelected ? "red" : "black";

  return (
    <Card style={[cardStyles.card, { zIndex }]}>
      <View style={cardStyles.container}>
        <Text style={cardStyles.paragraph}>{name}</Text>
        <Image style={cardStyles.image} source={image} resizeMode="contain" />
      </View>
      <ReanimatedPressable
        style={[cardStyles.iconContainer, buttonStyle]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <RenimatedIcon
          style={[positionStyle, { position: "absolute", zIndex }]}
          name="heart"
          size={ICON_SIZE}
          color="red"
        />
        <RenimatedIcon
          style={{ zIndex: zIndex + 1 }}
          name="heart"
          size={ICON_SIZE}
          color={iconColor}
        />
      </ReanimatedPressable>
    </Card>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    marginTop: 8,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  paragraph: {
    margin: 24,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    height: 128,
    width: 128,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: "black",
  },
  iconContainer: {
    top: CARD_PADDING,
    right: CARD_PADDING,
    position: "absolute",
    alignItems: "flex-end",
  },
});

export default function Final() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<Animal[]>([]);

  const refreshRotation = useSharedValue(0);

  const refreshStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${refreshRotation.value}deg` }],
  }));

  const loadResult = () => {
    setIsLoading(false);
    setSearchResult(animals);
  };

  const onSearch = () => {
    setIsLoading(true);
    setSearchResult([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    refreshRotation.value = withRepeat(
      withTiming(720, { duration: 3000 }),
      1,
      true,
      () => (refreshRotation.value = 0)
    );
    setTimeout(() => {
      loadResult();
    }, 2000);
  };

  const renderItem = (item: Animal, index: number) => {
    return (
      <AnimalCard
        animal={item}
        key={`${index}${item.name}`}
        zIndex={999 - index}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {searchResult.map(renderItem)}
      </ScrollView>
      <ReanimatedPressable
        style={[styles.cta, refreshStyle]}
        onPress={onSearch}
        disabled={isLoading}
      >
        <RenimatedIcon name="refresh" size={ICON_SIZE} color="black" />
      </ReanimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: CARD_PADDING,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  cta: {
    height: 45,
    width: 45,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    top: 0,
    right: CARD_PADDING,
  },
  ctaText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

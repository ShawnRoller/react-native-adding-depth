import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, Card } from "react-native-paper";
import { animals, Animal } from "../data";

const CARD_PADDING = 8;
const ICON_SIZE = 24;

type Props = {
  animal: Animal;
  zIndex: number;
};

function AnimalCard({ animal: { name, image }, zIndex }: Props) {
  const [isSelected, setIsSelected] = React.useState(false);

  const onPress = () => {
    if (isSelected) {
      setIsSelected(false);
    } else {
      setIsSelected(true);
    }
  };

  const iconColor = isSelected ? "red" : "black";

  return (
    <Card style={[cardStyles.card, { zIndex }]}>
      <View style={cardStyles.container}>
        <Text style={cardStyles.paragraph}>{name}</Text>
        <Image style={cardStyles.image} source={image} resizeMode="contain" />
      </View>
      <Pressable style={cardStyles.iconContainer} onPress={onPress}>
        <FontAwesome name="heart" size={ICON_SIZE} color={iconColor} />
      </Pressable>
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

export default function Begin() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<Animal[]>([]);

  const loadResult = () => {
    setSearchResult(animals);
  };

  const onSearch = () => {
    setIsLoading(true);
    setSearchResult([]);

    setTimeout(() => {
      loadResult();
      setIsLoading(false);
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
      <Pressable style={styles.cta} onPress={onSearch} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FontAwesome name="refresh" size={ICON_SIZE} color="black" />
        )}
      </Pressable>
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

export type Animal = {
  name: string;
  image: any;
};

const rocky: Animal = {
  name: "Rocky",
  image: require("./assets/rocky.png"),
};

const diggy: Animal = {
  name: "Diggy",
  image: require("./assets/diggy.png"),
};

const gunner: Animal = {
  name: "Gunner",
  image: require("./assets/gunner.png"),
};

export const animals = [rocky, diggy, gunner];

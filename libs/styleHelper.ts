import { Dimensions } from "react-native";

export const FIGMA_WINDOW_WIDTH = 428
export const FIGMA_WINDOW_HEIGHT = 926

export const getRelativeWidth = (val: number) =>
 `${(val / FIGMA_WINDOW_WIDTH) * 100}%`;
export const getRelativeHeight = (val: number) =>
 `${(val / FIGMA_WINDOW_HEIGHT) * 100}%`;
export const getWidth = (figmaWidth: number) => {
 const windowWidth = Dimensions.get('window').width;
 return (windowWidth / FIGMA_WINDOW_WIDTH) * figmaWidth;
};
export const getHeight = (figmaHeight: number) => {
 const windowHeight = Dimensions.get('window').height;
 return (windowHeight / FIGMA_WINDOW_HEIGHT) * figmaHeight;
};
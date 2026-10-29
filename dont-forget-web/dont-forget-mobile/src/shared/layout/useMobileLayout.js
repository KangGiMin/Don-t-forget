import { useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Layout uses logical points, independent of the device's physical pixel density.
export function useMobileLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tablet = width >= 768;
  const gutter = tablet ? 28 : width < 380 ? 16 : 20;
  return {
    width, height, insets, tablet, gutter,
    pageContent: {
      flexGrow: 1, width: "100%", maxWidth: 840, alignSelf: "center",
      paddingHorizontal: gutter, paddingTop: insets.top + 20,
      paddingBottom: insets.bottom + 32,
    },
  };
}

export function useReadableStyles(source, colors) {
  const { width } = useWindowDimensions();
  return useMemo(() => {
    const original = typeof source === "function" ? source(colors) : source;
    return Object.fromEntries(Object.entries(original).map(([key, value]) => {
      const style = { ...StyleSheet.flatten(value) };
      if (typeof style.fontSize === "number") {
        const oldSize = style.fontSize;
        style.fontSize = Math.max(oldSize >= 14 && oldSize <= 17 ? 16 : 13, oldSize);
        if (width >= 768 && oldSize >= 20) style.fontSize = Math.round(oldSize * 1.08);
        if (typeof style.lineHeight === "number") {
          style.lineHeight = Math.max(style.lineHeight, Math.ceil(style.fontSize * 1.45));
        }
      }
      return [key, style];
    }));
  }, [source, colors, width]);
}

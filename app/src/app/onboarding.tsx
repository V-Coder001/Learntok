import { useRef, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View, type ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useSession } from '@/store/session';
import { colors, radius, space } from '@/theme';
import { Pressable } from 'react-native';

const slides = t.onboarding.slides;

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useSession((s) => s.completeOnboarding);
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isLast = page === slides.length - 1;

  const finish = () => {
    completeOnboarding();
    router.replace('/login');
  };

  const goTo = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
    setPage(index);
  };

  const renderSlide: ListRenderItem<(typeof slides)[number]> = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.illustration} />
      <Typo variant="display">{item.title}</Typo>
      <Typo variant="body" tone="muted">
        {item.body}
      </Typo>
    </View>
  );

  return (
    <Screen edges="both">
      <View style={styles.topRow}>
        <Pressable onPress={finish} accessibilityRole="button" accessibilityLabel={t.onboarding.skip} hitSlop={8}>
          <Typo variant="small" tone="muted">
            {t.onboarding.skip}
          </Typo>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderSlide}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        style={styles.list}
      />

      <View style={styles.dots}>
        {slides.map((slide, index) => (
          <Pressable
            key={slide.title}
            onPress={() => goTo(index)}
            accessibilityRole="button"
            accessibilityLabel={`${index + 1}`}
            hitSlop={10}
            style={[styles.dot, index === page ? styles.dotActive : null]}
          />
        ))}
      </View>

      <Button
        label={isLast ? t.onboarding.start : t.common.next}
        onPress={() => (isLast ? finish() : goTo(page + 1))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: space[4], minHeight: space[10] },
  list: { flexGrow: 0, flexShrink: 1 },
  slide: { paddingHorizontal: space[4], justifyContent: 'center', gap: space[4] },
  illustration: {
    height: space[16] * 3,
    borderRadius: radius.card,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: space[4],
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space[2], paddingVertical: space[6] },
  dot: { width: space[2], height: space[2], borderRadius: radius.pill, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.accent, width: space[6] },
});

import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Flag, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import type { ReactNode } from 'react';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { MerksatzText } from '@/components/MerksatzText';
import { Typo } from '@/components/Typo';
import { formatCount, formatDuration, initialsOf } from '@/lib/quiz';
import { t } from '@/i18n/de';
import type { Clip } from '@/services/types';
import { colors, icon, layout, space } from '@/theme';

interface ClipViewProps {
  clip: Clip;
  height: number;
  topicName?: string;
  onLearn: () => void;
  onShare: () => void;
  onReport: () => void;
  header?: ReactNode;
}

// Ein Vollbild-Clip im Feed: Verlauf, Merksatz, rechte Aktionsleiste, Lern-Button unten.
export function ClipView({ clip, height, topicName, onLearn, onShare, onReport, header }: ClipViewProps) {
  return (
    <View style={[styles.clip, { height }]}>
      <LinearGradient colors={[colors.accentSoft, colors.bg]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
      {header ? <View style={styles.header}>{header}</View> : null}

      <View style={styles.rail}>
        <Avatar initials={initialsOf(clip.author)} size={44} highlighted />
        <Rail label={formatCount(clip.likes)} accessibilityLabel={t.feed.actions.like}>
          <Heart color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />
        </Rail>
        <Rail label={formatCount(clip.comments)} accessibilityLabel={t.feed.actions.comment}>
          <MessageCircle color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />
        </Rail>
        <Rail label={t.feed.actions.share} accessibilityLabel={t.feed.actions.share} onPress={onShare}>
          <Share2 color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />
        </Rail>
        <Rail label={t.feed.actions.save} accessibilityLabel={t.feed.actions.save}>
          <Bookmark color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />
        </Rail>
        <Rail label={t.feed.actions.report} accessibilityLabel={t.feed.actions.report} onPress={onReport}>
          <Flag color={colors.textMuted} size={icon.size} strokeWidth={icon.strokeWidth} />
        </Rail>
      </View>

      <View style={styles.footer}>
        <View style={styles.badges}>
          {topicName ? <Badge label={topicName} tone="accent" /> : null}
          <Badge label={formatDuration(clip.durationSec)} />
          {clip.visibility !== 'public' ? <Badge label={t.myMaterial.status.private} /> : null}
        </View>
        <Typo variant="h2">{clip.title}</Typo>
        <Typo variant="small" tone="muted">
          {clip.author}
        </Typo>
        <MerksatzText text={clip.merksatz} />
        <Button label={t.feed.learn} onPress={onLearn} style={styles.learn} />
      </View>
    </View>
  );
}

function Rail({
  children,
  label,
  accessibilityLabel,
  onPress,
}: {
  children: ReactNode;
  label?: string;
  accessibilityLabel: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.railItem}
      hitSlop={6}
    >
      <View style={styles.railIcon}>{children}</View>
      {label ? (
        <Typo variant="caption" tone="text">
          {label}
        </Typo>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  clip: { width: '100%', justifyContent: 'flex-end', paddingHorizontal: space[4], paddingBottom: space[4] },
  header: { position: 'absolute', top: space[2], left: space[4], right: space[4] },
  rail: {
    position: 'absolute',
    right: space[3],
    bottom: space[16] * 2 + space[4],
    alignItems: 'center',
    gap: space[4],
  },
  railItem: { alignItems: 'center', minWidth: layout.minTouch, minHeight: layout.minTouch, gap: space[1] },
  railIcon: {
    width: layout.minTouch,
    height: layout.minTouch,
    borderRadius: layout.minTouch / 2,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { gap: space[2], paddingRight: space[16] + space[2] },
  badges: { flexDirection: 'row', gap: space[2], flexWrap: 'wrap', marginBottom: space[1] },
  learn: { marginTop: space[2] },
});

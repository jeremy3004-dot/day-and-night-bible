import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { useTheme } from '../../contexts/ThemeContext';
import { shellChrome, shadows, spacing } from '../../design/system';

interface CardSkeletonProps {
  showImage?: boolean;
  lines?: number;
}

export function CardSkeleton({ showImage = false, lines = 3 }: CardSkeletonProps) {
  const { colors } = useTheme();
  const lineWidths = ['100%', '85%', '60%', '75%', '90%'];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.glassBackground, borderColor: colors.cardBorder },
      ]}
    >
      {showImage && <Skeleton width="100%" height={120} borderRadius={16} style={styles.image} />}
      <View style={styles.content}>
        <Skeleton width="60%" height={22} style={styles.title} />
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton
            key={i}
            width={lineWidths[i % lineWidths.length] as `${number}%`}
            height={16}
            style={styles.line}
          />
        ))}
      </View>
    </View>
  );
}

interface StatCardSkeletonProps {
  count?: number;
}

export function StatCardSkeleton({ count = 4 }: StatCardSkeletonProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.statContainer,
        { backgroundColor: colors.glassBackground, borderColor: colors.cardBorder },
      ]}
    >
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.statCard}>
          <Skeleton width={40} height={32} borderRadius={8} style={styles.statValue} />
          <Skeleton width={50} height={14} borderRadius={4} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: shellChrome.panelRadius,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.floating,
  },
  image: {
    marginBottom: 0,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: spacing.sm,
  },
  line: {
    marginBottom: spacing.xs,
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: shellChrome.panelRadius,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
    ...shadows.floating,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    marginBottom: spacing.xs,
  },
});

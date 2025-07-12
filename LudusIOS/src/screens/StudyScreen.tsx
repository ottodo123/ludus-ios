import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {PanGestureHandler, State as GestureState} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  partOfSpeech?: string;
  gender?: string;
  declension?: string;
  conjugation?: string;
}


// Rating system colors
const ratingColors = {
  again: '#DAA520', // mustard yellow
  hard: '#DC2626',  // red
  good: '#16A34A',  // green
  easy: '#2563EB',  // blue
};

const StudyScreen = ({navigation}: any) => {
  
  const mockCards: Flashcard[] = [
    {
      id: '1',
      front: 'puella',
      back: 'girl',
      difficulty: 'easy',
      partOfSpeech: 'noun',
      gender: 'f',
      declension: '1st',
    },
    {
      id: '2',
      front: 'amare',
      back: 'to love',
      difficulty: 'medium',
      partOfSpeech: 'verb',
      conjugation: '1st',
    },
    {
      id: '3',
      front: 'magnus',
      back: 'great, large',
      difficulty: 'easy',
      partOfSpeech: 'adjective',
    },
    {
      id: '4',
      front: 'aqua',
      back: 'water',
      difficulty: 'easy',
      partOfSpeech: 'noun',
      gender: 'f',
      declension: '1st',
    },
    {
      id: '5',
      front: 'laborare',
      back: 'to work',
      difficulty: 'medium',
      partOfSpeech: 'verb',
      conjugation: '1st',
    },
    {
      id: '6',
      front: 'bonus',
      back: 'good',
      difficulty: 'easy',
      partOfSpeech: 'adjective',
    },
    {
      id: '7',
      front: 'villa',
      back: 'house, villa',
      difficulty: 'medium',
      partOfSpeech: 'noun',
      gender: 'f',
      declension: '1st',
    },
    {
      id: '8',
      front: 'servus',
      back: 'slave, servant',
      difficulty: 'easy',
      partOfSpeech: 'noun',
      gender: 'm',
      declension: '2nd',
    },
    {
      id: '9',
      front: 'vocare',
      back: 'to call',
      difficulty: 'medium',
      partOfSpeech: 'verb',
      conjugation: '1st',
    },
    {
      id: '10',
      front: 'dominus',
      back: 'master, lord',
      difficulty: 'easy',
      partOfSpeech: 'noun',
      gender: 'm',
      declension: '2nd',
    },
    {
      id: '11',
      front: 'necare',
      back: 'to kill',
      difficulty: 'hard',
      partOfSpeech: 'verb',
      conjugation: '1st',
    },
    {
      id: '12',
      front: 'porta',
      back: 'gate, door',
      difficulty: 'medium',
      partOfSpeech: 'noun',
      gender: 'f',
      declension: '1st',
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState(0);
  const [againCount, setAgainCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0);
  const [currentSwipeDirection, setCurrentSwipeDirection] = useState<'again' | 'hard' | 'good' | 'easy' | null>(null);
  
  // Pan gesture refs and animated values
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  
  // Animated color values for smooth transitions (separate from transform animations)
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  
  // State-based colors to avoid native driver conflicts
  const [currentBorderColor, setCurrentBorderColor] = useState(colors.neutral.border);
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(colors.neutral.white);
  
  // Track haptic feedback state - only trigger once per gesture
  const hasTriggeredHapticForDirection = useRef<boolean>(false);

  const currentCard = mockCards[currentCardIndex];
  const isLastCard = currentCardIndex === mockCards.length - 1;

  // Hide status bar and tab bar for immersive experience
  useEffect(() => {
    StatusBar.setHidden(true, 'fade');
    // Hide tab bar when entering study mode
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' }
      });
    }
    
    return () => {
      StatusBar.setHidden(false, 'fade');
      // Show tab bar when leaving study mode
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            backgroundColor: colors.neutral.white,
            borderTopWidth: 1,
            borderTopColor: colors.neutral.border,
            paddingBottom: 34,
            paddingTop: 5,
            height: 90,
          }
        });
      }
    };
  }, [navigation]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMasterCard = () => {
    // Master/suspend this card - remove from daily reviews
    ReactNativeHapticFeedback.trigger('impactMedium');
    setMasteredCount(masteredCount + 1);
    setStudiedCards(studiedCards + 1);
    
    // Animate card scale for feedback
    Animated.sequence([
      Animated.timing(cardScaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    if (isLastCard) {
      navigation.goBack();
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    // Success haptic feedback for card completion
    ReactNativeHapticFeedback.trigger('impactHeavy');
    
    setStudiedCards(studiedCards + 1);
    
    // Update counters based on rating
    if (rating === 'again') {
      setAgainCount(againCount + 1);
    } else if (rating === 'good' || rating === 'easy') {
      setGoodCount(goodCount + 1);
    }
    // Note: 'hard' doesn't increment either counter (neutral)
    
    // Animate card scale down then back to normal for satisfying feedback
    Animated.sequence([
      Animated.timing(cardScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Reset card position with native driver
    Animated.parallel([
      Animated.spring(translateX, {toValue: 0, useNativeDriver: true}),
      Animated.spring(translateY, {toValue: 0, useNativeDriver: true}),
    ]).start();
    
    // Reset colors immediately to avoid conflicts
    setCurrentSwipeDirection(null);
    setCurrentBorderColor(colors.neutral.border);
    setCurrentBackgroundColor(colors.neutral.white);
    hasTriggeredHapticForDirection.current = false;
    
    if (isLastCard) {
      // Show completion screen or navigate back
      navigation.goBack();
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  // Track the dominant direction
  const dominantDirection = useRef<'horizontal' | 'vertical' | null>(null);
  const startTime = useRef<number>(0);

  const onGestureEvent = (event: any) => {
    const {translationX, translationY} = event.nativeEvent;
    
    // Determine dominant direction on first significant movement
    if (dominantDirection.current === null) {
      if (Math.abs(translationX) > 10 || Math.abs(translationY) > 10) {
        dominantDirection.current = Math.abs(translationX) > Math.abs(translationY) ? 'horizontal' : 'vertical';
      }
    }
    
    let direction: 'again' | 'hard' | 'good' | 'easy' | null = null;
    let distance = 0;
    
    // Constrain movement to dominant direction and determine swipe direction
    if (dominantDirection.current === 'horizontal') {
      translateX.setValue(translationX);
      translateY.setValue(0);
      distance = Math.abs(translationX);
      
      if (translationX < -30) {
        direction = 'again';
      } else if (translationX > 30) {
        direction = 'good';
      }
    } else if (dominantDirection.current === 'vertical') {
      translateY.setValue(translationY);
      translateX.setValue(0);
      distance = Math.abs(translationY);
      
      if (translationY < -30) {
        direction = 'easy';
      } else if (translationY > 30) {
        direction = 'hard';
      }
    }
    
    // Update card appearance based on swipe with smooth animations
    if (direction && distance > 30) {
      setCurrentSwipeDirection(direction);
      
      // Trigger haptic feedback only once when first entering a direction
      if (!hasTriggeredHapticForDirection.current) {
        ReactNativeHapticFeedback.trigger('selection');
        hasTriggeredHapticForDirection.current = true;
      }
      
      // Calculate smooth color transition progress
      const borderProgress = Math.min(distance / 80, 1);
      const backgroundProgress = Math.max(0, Math.min((distance - 60) / 40, 1));
      
      // Update colors directly with interpolated values
      const baseColor = ratingColors[direction];
      if (borderProgress > 0.1) {
        setCurrentBorderColor(baseColor);
      } else {
        setCurrentBorderColor(colors.neutral.border);
      }
      
      if (backgroundProgress > 0.1) {
        // Use opaque background colors instead of translucent
        const opaqueBackgroundColors = {
          again: '#F5E6A3', // Light mustard yellow
          hard: '#FECACA',  // Light red
          good: '#DCFCE7', // Light green
          easy: '#DBEAFE', // Light blue
        };
        setCurrentBackgroundColor(opaqueBackgroundColors[direction]);
      } else {
        setCurrentBackgroundColor(colors.neutral.white);
      }
    } else {
      setCurrentSwipeDirection(null);
      
      // Reset colors immediately when not swiping
      setCurrentBorderColor(colors.neutral.border);
      setCurrentBackgroundColor(colors.neutral.white);
    }
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === GestureState.BEGAN) {
      // Reset dominant direction and haptic state for new gesture
      dominantDirection.current = null;
      hasTriggeredHapticForDirection.current = false;
      startTime.current = Date.now();
    } else if (event.nativeEvent.state === GestureState.END) {
      const {translationX, translationY} = event.nativeEvent;
      const threshold = 80;
      
      // Determine which rating based on swipe direction and dominant axis
      let shouldAnimate = true;
      
      if (dominantDirection.current === 'horizontal') {
        if (translationX < -threshold || (translationX < -40 && event.nativeEvent.velocityX < -800)) {
          handleRating('again');
          shouldAnimate = false;
        } else if (translationX > threshold || (translationX > 40 && event.nativeEvent.velocityX > 800)) {
          handleRating('good');
          shouldAnimate = false;
        }
      } else if (dominantDirection.current === 'vertical') {
        if (translationY < -threshold || (translationY < -40 && event.nativeEvent.velocityY < -800)) {
          handleRating('easy');
          shouldAnimate = false;
        } else if (translationY > threshold || (translationY > 40 && event.nativeEvent.velocityY > 800)) {
          handleRating('hard');
          shouldAnimate = false;
        }
      }
      
      // Reset position if threshold not met
      if (shouldAnimate) {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
            velocity: -event.nativeEvent.velocityX / 100
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
            velocity: -event.nativeEvent.velocityY / 100
          }),
        ]).start();
      }
      
      // Reset swipe direction and dominant direction
      setCurrentSwipeDirection(null);
      hasTriggeredHapticForDirection.current = false;
      dominantDirection.current = null;
      
      // Reset colors immediately
      setCurrentBorderColor(colors.neutral.border);
      setCurrentBackgroundColor(colors.neutral.white);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.semantic.successText;
      case 'medium':
        return colors.semantic.warningText;
      case 'hard':
        return colors.semantic.errorText;
      default:
        return colors.neutral.gray;
    }
  };



  return (
    <View style={styles.fullScreenContainer}>
      {/* Close Button - Fixed position upper left */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Icon name="close" size={28} color={colors.neutral.darkGray} />
      </TouchableOpacity>

      {/* Rating Counters - Top of screen */}
      <View style={styles.ratingCounters}>
        <View style={styles.againCounter}>
          <Icon name="close" size={16} color="#DC2626" />
          <Text style={styles.againCounterText}>{againCount}</Text>
        </View>
        <View style={styles.progressAndMastered}>
          <Text style={styles.counterProgressText}>
            {currentCardIndex + 1} of {mockCards.length}
          </Text>
          {masteredCount > 0 && (
            <Text style={styles.masteredCountText}>
              {masteredCount} mastered
            </Text>
          )}
        </View>
        <View style={styles.goodCounter}>
          <Icon name="checkmark" size={16} color="#16A34A" />
          <Text style={styles.goodCounterText}>{goodCount}</Text>
        </View>
      </View>

      {/* Constrained Swipeable Flashcard */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View 
          style={[
            styles.swipeableCard,
            {
              transform: [
                {translateX: translateX},
                {translateY: translateY},
                {scale: cardScaleAnim}
              ],
              borderColor: currentBorderColor,
              backgroundColor: currentBackgroundColor,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.fullScreenTouchable} 
            onPress={handleFlip}
            activeOpacity={1}
          >
            {/* Card Icons */}
            <View style={styles.cardIcons}>
              <TouchableOpacity style={styles.cardIcon}>
                <Icon name="volume-medium-outline" size={24} color={colors.neutral.lightGray} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardIcon}>
                <Icon name="star-outline" size={24} color={colors.neutral.lightGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
              {!isFlipped ? (
                /* Front of card */
                <View style={styles.cardSide}>
                  <Text style={styles.cardMainText}>{currentCard.front}</Text>
                  <View style={styles.cardMetadata}>
                    <View style={[styles.difficultyBadge, {backgroundColor: getDifficultyColor(currentCard.difficulty) + '30'}]}>
                      <Text style={[styles.difficultyText, {color: getDifficultyColor(currentCard.difficulty)}]}>
                        {currentCard.difficulty}
                      </Text>
                    </View>
                    {currentCard.partOfSpeech && (
                      <View style={styles.posBadge}>
                        <Text style={styles.posText}>{currentCard.partOfSpeech}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.tapToReveal}>Tap to reveal answer</Text>
                </View>
              ) : (
                /* Back of card */
                <View style={styles.cardSide}>
                  <Text style={styles.cardMainText}>{currentCard.back}</Text>
                  <View style={styles.cardMetadata}>
                    {currentCard.gender && (
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaText}>{currentCard.gender}</Text>
                      </View>
                    )}
                    {currentCard.declension && (
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaText}>{currentCard.declension} decl</Text>
                      </View>
                    )}
                    {currentCard.conjugation && (
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaText}>{currentCard.conjugation} conj</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>

      {/* Navigation Controls */}
      <View style={styles.navigationControls}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="arrow-undo" size={28} color={colors.neutral.lightGray} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.masterButton]} 
          onPress={handleMasterCard}
        >
          <Icon name="checkmark-done" size={28} color={colors.semantic.successText} />
        </TouchableOpacity>
      </View>

      {/* Instructions at bottom - Fixed position */}
      {isFlipped && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            ← Again    ↓ Hard    → Good    ↑ Easy
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.neutral.lightBackground,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 12,
    zIndex: 10,
  },
  swipeableCard: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    bottom: 120,
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.neutral.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 20, // High z-index to appear above all other elements
  },
  progressContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  progressText: {
    ...typography.caption,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fullScreenTouchable: {
    flex: 1,
  },
  ratingCounters: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    zIndex: 5,
  },
  counterProgressText: {
    ...typography.body,
    color: colors.neutral.gray,
    fontWeight: '500',
  },
  againCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FECACA', // Light red background
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  againCounterText: {
    color: '#DC2626', // Dark red text
    fontWeight: '600',
    fontSize: 16,
  },
  goodCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7', // Light green background
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  goodCounterText: {
    color: '#16A34A', // Dark green text
    fontWeight: '600',
    fontSize: 16,
  },
  cardIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardIcon: {
    padding: 8,
  },
  navigationControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 80,
    zIndex: 5,
  },
  navButton: {
    padding: 12,
  },
  masterButton: {
    backgroundColor: colors.semantic.successText + '20',
    borderRadius: 50,
  },
  progressAndMastered: {
    alignItems: 'center',
  },
  masteredCountText: {
    ...typography.caption,
    color: colors.semantic.successText,
    fontWeight: '600',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.neutral.darkGray,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.neutral.border,
    marginHorizontal: 16,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary.blue,
    borderRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.neutral.darkGray,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral.lightGray,
    marginTop: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  flashcard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  cardSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMainText: {
    fontSize: 52,
    fontWeight: '200',
    color: colors.neutral.darkGray,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 60,
  },
  cardMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  posBadge: {
    backgroundColor: colors.primary.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  posText: {
    ...typography.caption,
    color: colors.primary.darkBlue,
    fontWeight: '600',
  },
  metaBadge: {
    backgroundColor: colors.neutral.lightBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metaText: {
    ...typography.caption,
    color: colors.neutral.gray,
    fontWeight: '500',
  },
  tapToReveal: {
    ...typography.body,
    color: colors.neutral.lightGray,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  answerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  answerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  incorrectButton: {
    backgroundColor: colors.semantic.errorText,
  },
  correctButton: {
    backgroundColor: colors.semantic.successText,
  },
  answerButtonText: {
    ...typography.button,
    color: colors.neutral.white,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    zIndex: 10,
  },
  instructionsText: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    textAlign: 'center',
    lineHeight: 20,
    backgroundColor: colors.neutral.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default StudyScreen;
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [selectedTime, setSelectedTime] = useState<'morning' | 'evening' | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  // For simplicity, we use fixed color values rather than dynamic theme additions.
  const colors = {
    background: isDark ? '#000' : '#fff',
    text: isDark ? '#fff' : '#000',
    primary: ['#2196F3', '#1976D2'],
    sectionLight: isDark ? '#444' : '#f9f9f9',
  };

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProgress();
    checkDarkMode();
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('azkarProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const checkDarkMode = () => {
    const hour = new Date().getHours();
    setIsDark(hour >= 18 || hour < 6);
  };

  const saveProgress = async (newProgress: { [key: string]: number }) => {
    try {
      await AsyncStorage.setItem('azkarProgress', JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const resetProgress = async () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setProgress({});
    await AsyncStorage.removeItem('azkarProgress');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Minimal arrays provided; you can extend these with your full data.
  const morningAzkar = [
    {
      id: 1,
      text: 'الْحَمْدُ لِلَّهِ وَحْدَهُ، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى مَنْ لاَ نَبِيَّ بَعْدَهُ',
      initial: 1
    },
    {
      id: 2,
      text: 'آية الكرسي: {اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَوَاتِ وَالْأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ}.',
      initial: 1
    },
    {
      id: 3,
      text: 'سورة الإخلاص: {قُلْ هُوَ اللَّهُ أَحَدٌ* اللَّهُ الصَّمَدُ* لَمْ يَلِدْ وَلَمْ يُولَدْ* وَلَمْ يَكُن لَّهُ كُفُواً أَحَدٌ}.',
      initial: 3
    },
    {
      id: 4,
      text: 'سورة الفلق: {قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ* مِن شَرِّ مَا خَلَقَ* وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ* وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ* وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ}.',
      initial: 3
    },
    {
      id: 5,
      text: 'سورة الناس: {قُلْ أَعُوذُ بِرَبِّ النَّاسِ* مَلِكِ النَّاسِ* إِلَهِ النَّاسِ* مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ* الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ* مِنَ الْجِنَّةِ وَالنَّاسِ}.',
      initial: 3
    },
    {
      id: 6,
      text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.',
      initial: 1
    },
    {
      id: 7,
      text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.',
      initial: 1
    },
    {
      id: 8,
      text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنوبَ إِلَّا أَنْتَ.',
      initial: 1
    },
    {
      id: 9,
      text: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتِكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ.',
      initial: 4
    },
    {
      id: 10,
      text: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.',
      initial: 1
    },
    {
      id: 11,
      text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ.',
      initial: 3
    },
    {
      id: 12,
      text: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلَّا هُوَ عَلَيهِ تَوَكَّلتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.',
      initial: 7
    },
    {
      id: 13,
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ: فِي دِينِي وَدُنْيَايَ وَأَهْلِي، وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَينِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.',
      initial: 1
    },
    {
      id: 14,
      text: 'اللَّهُمَّ عَالِمَ الغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطانِ وَشَرَكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءاً، أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ.',
      initial: 1
    },
    {
      id: 15,
      text: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلاَ فِي السّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
      initial: 3
    },
    {
      id: 16,
      text: 'رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالْإِسْلاَمِ دِيناً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيّاً.',
      initial: 3
    },
    {
      id: 17,
      text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغيثُ أَصْلِحْ لِي شَأْنِيَ كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.',
      initial: 1
    },
    {
      id: 18,
      text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ، وَنَصْرَهُ، وَنورَهُ، وَبَرَكَتَهُ، وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ.',
      initial: 1
    },
    {
      id: 19,
      text: 'أَصْبَحْنا عَلَى فِطْرَةِ الْإِسْلاَمِ، وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشرِكِينَ.',
      initial: 1
    },
    {
      id: 20,
      text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.',
      initial: 100
    },
    {
      id: 21,
      text: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
      initial: 10
    },
    {
      id: 22,
      text: 'لاَ إِلَهَ إِلاَّ اللَّهُ، وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
      initial: 100
    },
    {
      id: 23,
      text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.',
      initial: 3
    },
    {
      id: 24,
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً طَيِّباً، وَعَمَلاً مُتَقَبَّلاً.',
      initial: 1
    },
    {
      id: 25,
      text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.',
      initial: 100
    },
    {
      id: 26,
      text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبَيِّنَا مُحَمَّدٍ.',
      initial: 10
    }
  ];

  const eveningAzkar = [
    {
      id: 27,
      text: 'الْحَمْدُ لِلَّهِ وَحْدَهُ، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى مَنْ لاَ نَبِيَّ بَعْدَهُ.',
      initial: 1
    },
    {
      id: 28,
      text: 'آية الكرسي: {اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَوَاتِ وَالْأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ}.',
      initial: 1
    },
    {
      id: 29,
      text: 'سورة الإخلاص: {قُلْ هُوَ اللَّهُ أَحَدٌ* اللَّهُ الصَّمَدُ* لَمْ يَلِدْ وَلَمْ يُولَدْ* وَلَمْ يَكُن لَّهُ كُفُواً أَحَدٌ}.',
      initial: 3
    },
    {
      id: 30,
      text: 'سورة الفلق: {قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ* مِن شَرِّ مَا خَلَقَ* وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ* وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ* وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ}.',
      initial: 3
    },
    {
      id: 31,
      text: 'سورة الناس: {قُلْ أَعُوذُ بِرَبِّ النَّاسِ* مَلِكِ النَّاسِ* إِلَهِ النَّاسِ* مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ* الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ* مِنَ الْجِنَّةِ وَالنَّاسِ}.',
      initial: 3
    },
    {
      id: 32,
      text: 'أَمْسَيْنَا وَأَمْسَا الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الليلة وَخَيرَ مَا بَعْدَها، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الليلة وَشَرِّ مَا بَعْدَها، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.',
      initial: 1
    },
    {
      id: 33,
      text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا ، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ المصير.',
      initial: 1
    },
    {
      id: 34,
      text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنوبَ إِلَّا أَنْتَ.',
      initial: 1
    },
    {
      id: 35,
      text: 'اللَّهُمَّ إِنِّي أَمسيت أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتِكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ.',
      initial: 4
    },
    {
      id: 36,
      text: 'اللَّهُمَّ مَا أَمسى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.',
      initial: 1
    },
    {
      id: 37,
      text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ.',
      initial: 3
    },
    {
      id: 38,
      text: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلَّا هُوَ عَلَيهِ تَوَكَّلتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.',
      initial: 7
    },
    {
      id: 39,
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ: فِي دِينِي وَدُنْيَايَ وَأَهْلِي، وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَينِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.',
      initial: 1
    },
    {
      id: 40,
      text: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلاَ فِي السّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
      initial: 3
    },
    {
      id: 41,
      text: 'رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالْإِسْلاَمِ دِيناً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيّاً.',
      initial: 3
    },
    {
      id: 42,
      text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغيثُ أَصْلِحْ لِي شَأْنِيَ كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.',
      initial: 1
    },
    {
      id: 43,
      text: 'أَمسينا وَأَمسا الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَه الليلة فَتْحَها، وَنَصْرَها، وَنورَها، وَبَرَكَتَها، وَهُدَاها، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ.',
      initial: 1
    },
    {
      id: 44,
      text: 'أَمسينا عَلَى فِطْرَةِ الْإِسْلاَمِ، وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشرِكِينَ.',
      initial: 1
    },
    {
      id: 45,
      text: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
      initial: 10
    },
    {
      id: 46,
      text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.',
      initial: 100
    },
    {
      id: 47,
      text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
      initial: 3
    },
    {
      id: 48,
      text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبَيِّنَا مُحَمَّدٍ.',
      initial: 10
    }
  ];


  const handleTimeSelect = (time: 'morning' | 'evening') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedTime(time);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const getProgressPercentage = (timeType: 'morning' | 'evening') => {
    const azkarList = timeType === 'morning' ? morningAzkar : eveningAzkar;
    let completed = 0;
    azkarList.forEach((item) => {
      if (progress[item.id] === 0) completed++;
    });
    return (completed / azkarList.length) * 100;
  };

  const renderProgressCircle = (timeType: 'morning' | 'evening') => {
    const percentage = getProgressPercentage(timeType);
    return (
      <View style={styles.progressCircle}>
        <Text style={[styles.progressText, { color: colors.text }]}>{percentage.toFixed(0)}%</Text>
      </View>
    );
  };

  const AzkarItem: React.FC<{
    item: { id: number; text: string; initial: number };
    progress: { [key: string]: number };
    onProgressChange: (newCount: number) => void;
  }> = ({ item, progress, onProgressChange }) => {
    const scaleAnimItem = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const count = progress[item.id] === undefined ? item.initial : progress[item.id];
    const isCompleted = count === 0;

    useEffect(() => {
      Animated.timing(progressAnim, {
        toValue: 1 - count / item.initial,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [count]);

    const handlePress = () => {
      if (count > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onProgressChange(count - 1);
        Animated.sequence([
          Animated.timing(scaleAnimItem, {
            toValue: 1.05,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimItem, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Animated.View style={[itemStyles.azkarItem, { transform: [{ scale: scaleAnimItem }], backgroundColor: colors.sectionLight }]}>
          <LinearGradient
            colors={
              isCompleted
                ? isDark
                  ? ['#1a237e44', '#0d47a144']
                  : ['#2196F322', '#1976D222']
                : ['transparent', 'transparent']
            }
            style={itemStyles.azkarGradient}
          >
            <View style={itemStyles.azkarContent}>
              <Text style={[itemStyles.azkarText, { color: colors.text }]}>{item.text}</Text>
              <View style={itemStyles.counterContainer}>
                <Text style={[itemStyles.counter, { color: isCompleted ? colors.primary[1] : colors.text }]}>{count}</Text>
                {isCompleted && (
                  <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary[1]} style={itemStyles.completedIcon} />
                )}
              </View>
            </View>
            <Animated.View style={[itemStyles.progressBar, { width: progressWidth, backgroundColor: isDark ? '#1a237e66' : '#2196F366' }]} />
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.content,
            { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }], opacity: slideAnim },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>أذكار الصباح والمساء</Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
              <LinearGradient colors={isDark ? ['#1a237e', '#0d47a1'] : ['#2196F3', '#1976D2']} style={styles.gradientButton}>
                <FontAwesome5 name="redo" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeToggle} onPress={() => setIsDark((prev) => !prev)}>
              <LinearGradient colors={isDark ? ['#1a237e', '#0d47a1'] : ['#2196F3', '#1976D2']} style={styles.gradientButton}>
                <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {!selectedTime ? (
            <View style={styles.timeSelection}>
              <TouchableOpacity style={[styles.timeCard, { backgroundColor: colors.sectionLight }]} onPress={() => handleTimeSelect('morning')}>
                <LinearGradient colors={isDark ? ['#1a237e44', '#0d47a144'] : ['#2196F322', '#1976D222']} style={styles.gradientCard}>                  <MaterialCommunityIcons 
                    name="white-balance-sunny" 
                    size={60} 
                    color={colors.text} 
                    style={styles.morningIcon} 
                  />
                  <Text style={[styles.timeText, { color: colors.text }]}>أذكار الصباح</Text>
                  {renderProgressCircle('morning')}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.timeCard, { backgroundColor: colors.sectionLight }]} onPress={() => handleTimeSelect('evening')}>
                <LinearGradient colors={isDark ? ['#1a237e44', '#0d47a144'] : ['#2196F322', '#1976D222']} style={styles.gradientCard}>
                  <MaterialCommunityIcons name="weather-night" size={60} color={colors.text} />
                  <Text style={[styles.timeText, { color: colors.text }]}>أذكار المساء</Text>
                  {renderProgressCircle('evening')}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
              <View style={[styles.azkarSection, { backgroundColor: colors.sectionLight }]}>
                <LinearGradient colors={isDark ? ['#1a237e22', '#0d47a122'] : ['#2196F311', '#1976D211']} style={styles.gradientSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{selectedTime === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => setSelectedTime(null)}>
                      <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  {(selectedTime === 'morning' ? morningAzkar : eveningAzkar).map((item) => (
                    <AzkarItem
                      key={item.id}
                      item={item}
                      progress={progress}
                      onProgressChange={(newCount) => {
                        const newProgress = { ...progress, [item.id]: newCount };
                        setProgress(newProgress);
                        saveProgress(newProgress);
                      }}
                    />
                  ))}
                </LinearGradient>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  content: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', writingDirection: 'rtl' },
  resetButton: { borderRadius: 12, overflow: 'hidden' },
  modeToggle: { borderRadius: 12, overflow: 'hidden' },
  gradientButton: { padding: 12, alignItems: 'center', justifyContent: 'center' },
  timeSelection: { gap: 20 },
  timeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradientCard: { padding: 20, alignItems: 'center', justifyContent: 'center' },  morningIcon: { marginVertical: 10 },
  timeText: { fontSize: 20, fontWeight: '600', marginTop: 10, writingDirection: 'rtl' },
  progressCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00000011', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  progressText: { fontSize: 12, fontWeight: '600' },
  azkarSection: { borderRadius: 20, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  gradientSection: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '600', writingDirection: 'rtl' },
  backButton: { padding: 8 },
});

const itemStyles = StyleSheet.create({
  azkarItem: { borderRadius: 15, marginBottom: 15, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
  azkarGradient: { position: 'relative' },
  azkarContent: { padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  azkarText: { flex: 1, fontSize: 18, writingDirection: 'rtl', textAlign: 'right' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  counter: { fontSize: 20, fontWeight: '600' },
  completedIcon: { marginLeft: 4 },
  progressBar: { position: 'absolute', bottom: 0, left: 0, height: 3 },
});

export default HomeScreen;
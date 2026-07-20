import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AppHeader from '@/components/AppHeader';
import FormInput from '@/components/FormInput';
import FormTextArea from '@/components/FormTextArea';
import FormPrioritySelect from '@/components/FormPrioritySelect';
import FormDatePicker from '@/components/FormDatePicker';
import { useSurvey } from '@/contexts/SurveyContext';
import { AppColors, AppShadows } from '@/constants/theme';
import { Priority } from '@/types/survey';

type FormErrors = {
  siteName?: string;
  clientName?: string;
  description?: string;
  priority?: string;
  date?: string;
  photo?: string;
  location?: string;
};

export default function CreateSurveyScreen() {
  const router = useRouter();
  const { addSurvey } = useSurvey();

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [date, setDate] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', `Camera ${useCamera ? 'access' : 'roll'} permission is required.`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setPhoto(result.assets[0].uri);
        setErrors(prev => ({ ...prev, photo: undefined }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Something went wrong while trying to select an image.');
    }
  };

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to create a survey.');
        setIsLocating(false);
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLatitude(locationResult.coords.latitude);
      setLongitude(locationResult.coords.longitude);
      setAccuracy(locationResult.coords.accuracy ?? null);
      setErrors(prev => ({ ...prev, location: undefined }));
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Could not fetch your GPS location. Would you like to use fallback mock coordinates for testing?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Use Mock GPS',
            onPress: () => {
              setLatitude(37.7749);
              setLongitude(-122.4194);
              setAccuracy(10);
              setErrors(prev => ({ ...prev, location: undefined }));
            }
          }
        ]
      );
    } finally {
      setIsLocating(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!siteName.trim()) {
      newErrors.siteName = 'Site name is required';
    }
    if (!clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }
    if (!photo) {
      newErrors.photo = 'Site photo is required';
    }
    if (latitude === null || longitude === null) {
      newErrors.location = 'GPS Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields, including photo and location.');
      return;
    }

    const photoTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ', ' + new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newSurvey = addSurvey({
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date,
      photo: photo || undefined,
      photoTime,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      accuracy: accuracy !== null ? accuracy : undefined,
    });

    Alert.alert('Survey Created', `Survey "${newSurvey.id}" has been created successfully!`, [
      {
        text: 'View History',
        onPress: () => router.push('/(tabs)/history'),
      },
      {
        text: 'Create Another',
        onPress: () => {
          setSiteName('');
          setClientName('');
          setDescription('');
          setPriority('Medium');
          setDate('');
          setPhoto(null);
          setLatitude(null);
          setLongitude(null);
          setAccuracy(null);
          setErrors({});
        },
      },
    ]);
  };

  const handleClear = () => {
    Alert.alert('Clear Form', 'Are you sure you want to clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setSiteName('');
          setClientName('');
          setDescription('');
          setPriority('Medium');
          setDate('');
          setPhoto(null);
          setLatitude(null);
          setLongitude(null);
          setAccuracy(null);
          setErrors({});
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="New Survey"
        subtitle="Fill in the site details"
      />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="clipboard-outline" size={22} color={AppColors.primary} />
            <Text style={styles.formTitle}>Site Information</Text>
          </View>
          <View style={styles.divider} />

          <FormInput
            label="Site Name"
            value={siteName}
            onChangeText={setSiteName}
            placeholder="e.g. Downtown Office Complex"
            error={errors.siteName}
            required
            icon="location"
          />

          <FormInput
            label="Client Name"
            value={clientName}
            onChangeText={setClientName}
            placeholder="e.g. ABC Corporation"
            error={errors.clientName}
            required
            icon="business"
          />

          <FormTextArea
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the survey scope and objectives..."
            error={errors.description}
            required
          />

          <FormPrioritySelect
            label="Priority"
            value={priority}
            onChange={setPriority}
            error={errors.priority}
            required
          />

          <FormDatePicker
            label="Survey Date"
            value={date}
            onChange={setDate}
            error={errors.date}
            required
          />

          <View style={styles.formSectionDivider} />

          {/* Site Photo Section */}
          <View style={styles.formSectionHeaderRow}>
            <Ionicons name="camera-outline" size={20} color={AppColors.primary} />
            <Text style={styles.sectionSubTitle}>Site Photo <Text style={styles.requiredAsterisk}>*</Text></Text>
          </View>
          <View style={styles.photoContainer}>
            {photo ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photo }} style={styles.photoPreview} />
                <Pressable style={styles.removePhotoBtn} onPress={() => setPhoto(null)}>
                  <Ionicons name="close-circle" size={24} color={AppColors.danger} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.photoButtonsRow}>
                <Pressable 
                  style={({ pressed }) => [styles.photoSelectBtn, pressed && styles.pressed]}
                  onPress={() => handlePickImage(true)}
                >
                  <Ionicons name="camera" size={24} color={AppColors.primary} />
                  <Text style={styles.photoBtnText}>Take Photo</Text>
                </Pressable>
                <Pressable 
                  style={({ pressed }) => [styles.photoSelectBtn, pressed && styles.pressed]}
                  onPress={() => handlePickImage(false)}
                >
                  <Ionicons name="image" size={24} color={AppColors.primary} />
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </Pressable>
              </View>
            )}
            {errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}
          </View>

          <View style={styles.formSectionDivider} />

          {/* Location Section */}
          <View style={styles.formSectionHeaderRow}>
            <Ionicons name="navigate-outline" size={20} color={AppColors.primary} />
            <Text style={styles.sectionSubTitle}>GPS Location <Text style={styles.requiredAsterisk}>*</Text></Text>
          </View>
          <View style={styles.locationContainer}>
            {latitude !== null && longitude !== null ? (
              <View style={styles.locationDisplayCard}>
                <View style={styles.locationDataRow}>
                  <View style={styles.coordBox}>
                    <Text style={styles.coordLabel}>Latitude</Text>
                    <Text style={styles.coordValue}>{latitude.toFixed(6)}</Text>
                  </View>
                  <View style={styles.coordBox}>
                    <Text style={styles.coordLabel}>Longitude</Text>
                    <Text style={styles.coordValue}>{longitude.toFixed(6)}</Text>
                  </View>
                </View>
                {accuracy !== null && (
                  <Text style={styles.locationAccuracyText}>
                    Accuracy: ±{accuracy.toFixed(1)} meters
                  </Text>
                )}
                <Pressable 
                  style={({ pressed }) => [styles.locationRefreshBtn, pressed && styles.pressed]}
                  onPress={handleGetLocation}
                >
                  <Ionicons name="refresh" size={16} color={AppColors.primary} />
                  <Text style={styles.locationRefreshText}>Update Location</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable 
                style={({ pressed }) => [styles.locationGetBtn, pressed && styles.pressed]}
                onPress={handleGetLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <ActivityIndicator size="small" color={AppColors.white} />
                ) : (
                  <>
                    <Ionicons name="location" size={20} color={AppColors.white} />
                    <Text style={styles.locationGetText}>Get Current Location</Text>
                  </>
                )}
              </Pressable>
            )}
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color={AppColors.white} />
            <Text style={styles.submitText}>Create Survey</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
            onPress={handleClear}
          >
            <Ionicons name="trash-outline" size={20} color={AppColors.danger} />
            <Text style={styles.clearText}>Clear Form</Text>
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray50,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'transparent',
    ...AppShadows.sm,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 16,
  },
  formSectionDivider: {
    height: 1,
    backgroundColor: AppColors.gray100,
    marginVertical: 20,
  },
  formSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionSubTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  requiredAsterisk: {
    color: AppColors.danger,
  },
  photoContainer: {
    width: '100%',
  },
  photoPreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    padding: 2,
    ...AppShadows.sm,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoSelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: AppColors.primary + '50',
    borderRadius: 14,
    backgroundColor: AppColors.primary + '05',
    gap: 8,
  },
  photoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
  },
  locationContainer: {
    width: '100%',
  },
  locationDisplayCard: {
    backgroundColor: AppColors.gray50,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray100,
  },
  locationDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coordBox: {
    flex: 1,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: 11,
    color: AppColors.gray400,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  coordValue: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  locationAccuracyText: {
    fontSize: 12,
    color: AppColors.gray500,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  locationRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  locationRefreshText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
  },
  locationGetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.secondary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    ...AppShadows.sm,
  },
  locationGetText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.white,
  },
  errorText: {
    color: AppColors.danger,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    ...AppShadows.md,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: AppColors.danger + '40',
    gap: 8,
    ...AppShadows.sm,
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.danger,
  },
  pressed: {
    opacity: 0.7,
  },
  bottomPadding: {
    height: 20,
  },
});

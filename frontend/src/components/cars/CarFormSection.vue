<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/i18n'
import type { CarFormModel } from '@/types/entities'
import { CAR_CLASSES, CAR_STATUSES, FUEL_TYPES, TRANSMISSIONS } from '@/types/entities'
import {
  MAX_CAR_IMAGE_COUNT,
  MAX_CAR_IMAGE_SIZE_BYTES,
  RUSSIAN_PLATE_PATTERN,
  normalizePlateNumberInput,
} from '@/utils/car-form'
import { humanizeEnum } from '@/utils/format'

const props = defineProps<{
  modelValue: CarFormModel
  makes: string[]
  models: string[]
  locations: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CarFormModel]
}>()

const { locale } = useI18n()
const imageError = ref('')
const imageInput = ref<HTMLInputElement | null>(null)
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        make: 'Марка',
        model: 'Модель',
        plate: 'Госномер',
        year: 'Год',
        class: 'Класс',
        status: 'Статус',
        location: 'Локация',
        transmission: 'Коробка',
        fuel: 'Топливо',
        seats: 'Мест',
        odometer: 'Одометр, км',
        image: 'Изображение',
        notes: 'Комментарий',
        makeHint: 'Можно выбрать существующую марку или ввести новую.',
        modelHint: 'Можно выбрать существующую модель или ввести новую.',
        plateHint: 'Формат: А123ВС154',
        locationHint: 'Выберите локацию из уже существующих.',
        imageHint: 'JPG, PNG или WEBP. SVG запрещен.',
        imageAction: 'Загрузить файлы',
        imageReplace: 'Добавить еще файлы',
        imageRemove: 'Удалить',
        imageTooLarge: 'Файл слишком большой. Допустимый размер до 1.5 МБ.',
        imageWrongType: 'Можно загружать только JPG, PNG или WEBP.',
        imageLimit: `Максимум ${MAX_CAR_IMAGE_COUNT} изображений на автомобиль.`,
        imageRequiredSet: 'Загрузите фото автомобиля снаружи и салона.',
      }
    : {
        make: 'Make',
        model: 'Model',
        plate: 'Plate number',
        year: 'Year',
        class: 'Class',
        status: 'Status',
        location: 'Location',
        transmission: 'Transmission',
        fuel: 'Fuel',
        seats: 'Seats',
        odometer: 'Odometer, km',
        image: 'Image',
        notes: 'Notes',
        makeHint: 'Choose an existing make or type a new one.',
        modelHint: 'Choose an existing model or type a new one.',
        plateHint: 'Format: A123BC154',
        locationHint: 'Choose one of the existing locations.',
        imageHint: 'JPG, PNG, or WEBP. SVG is not allowed.',
        imageAction: 'Upload files',
        imageReplace: 'Add more files',
        imageRemove: 'Remove',
        imageTooLarge: 'File is too large. Maximum size is 1.5 MB.',
        imageWrongType: 'Only JPG, PNG, or WEBP images are allowed.',
        imageLimit: `Maximum ${MAX_CAR_IMAGE_COUNT} images per car.`,
        imageRequiredSet: 'Upload exterior and interior photos.',
      },
)

function update<K extends keyof CarFormModel>(key: K, value: CarFormModel[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function updateTextField<K extends 'make' | 'model'>(key: K, value: string) {
  update(key, value.trimStart() as CarFormModel[K])
}

function updatePlateNumber(value: string) {
  update('plateNumber', normalizePlateNumberInput(value))
}

function clearImage() {
  imageError.value = ''
  update('imageUrls', [])
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  imageError.value = ''

  if (!files.length) {
    return
  }

  if (props.modelValue.imageUrls.length + files.length > MAX_CAR_IMAGE_COUNT) {
    imageError.value = copy.value.imageLimit
    input.value = ''
    return
  }

  for (const file of files) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      imageError.value = copy.value.imageWrongType
      input.value = ''
      return
    }

    if (file.size > MAX_CAR_IMAGE_SIZE_BYTES) {
      imageError.value = copy.value.imageTooLarge
      input.value = ''
      return
    }
  }

  const newImageUrls = await Promise.all(files.map((file) => readFileAsDataUrl(file)))
  update('imageUrls', [...props.modelValue.imageUrls, ...newImageUrls])
  input.value = ''
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

function removeImage(index: number) {
  update(
    'imageUrls',
    props.modelValue.imageUrls.filter((_, currentIndex) => currentIndex !== index),
  )
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <label class="field-group">
      <span class="field-label">{{ copy.make }}</span>
      <input
        class="input-base"
        list="car-makes"
        :value="modelValue.make"
        @input="updateTextField('make', ($event.target as HTMLInputElement).value)"
      />
      <datalist id="car-makes">
        <option v-for="make in makes" :key="make" :value="make" />
      </datalist>
      <span class="text-xs text-muted-foreground">{{ copy.makeHint }}</span>
    </label>
    <label class="field-group">
      <span class="field-label">{{ copy.model }}</span>
      <input
        class="input-base"
        list="car-models"
        :value="modelValue.model"
        @input="updateTextField('model', ($event.target as HTMLInputElement).value)"
      />
      <datalist id="car-models">
        <option v-for="model in models" :key="model" :value="model" />
      </datalist>
      <span class="text-xs text-muted-foreground">{{ copy.modelHint }}</span>
    </label>
    <label class="field-group"
      ><span class="field-label">VIN</span
      ><input
        class="input-base"
        :value="modelValue.vin"
        @input="update('vin', ($event.target as HTMLInputElement).value)"
    /></label>
    <label class="field-group">
      <span class="field-label">{{ copy.plate }}</span>
      <input
        class="input-base"
        :value="modelValue.plateNumber"
        maxlength="9"
        placeholder="А123ВС154"
        :pattern="RUSSIAN_PLATE_PATTERN.source"
        @input="updatePlateNumber(($event.target as HTMLInputElement).value)"
      />
      <span class="text-xs text-muted-foreground">{{ copy.plateHint }}</span>
    </label>
    <label class="field-group"
      ><span class="field-label">{{ copy.year }}</span
      ><input
        class="input-base"
        min="2018"
        type="number"
        :value="modelValue.year"
        @input="update('year', Number(($event.target as HTMLInputElement).value))"
    /></label>
    <label class="field-group"
      ><span class="field-label">{{ copy.class }}</span
      ><select
        class="input-base"
        :value="modelValue.carClass"
        @change="update('carClass', ($event.target as HTMLSelectElement).value as CarFormModel['carClass'])"
      >
        <option v-for="item in CAR_CLASSES" :key="item" :value="item">{{ humanizeEnum(item) }}</option>
      </select></label
    >
    <label class="field-group"
      ><span class="field-label">{{ copy.status }}</span
      ><select
        class="input-base"
        :value="modelValue.status"
        @change="update('status', ($event.target as HTMLSelectElement).value as CarFormModel['status'])"
      >
        <option v-for="item in CAR_STATUSES" :key="item" :value="item">{{ humanizeEnum(item) }}</option>
      </select></label
    >
    <label class="field-group">
      <span class="field-label">{{ copy.location }}</span>
      <select
        class="input-base"
        :value="modelValue.location"
        @change="update('location', ($event.target as HTMLSelectElement).value)"
      >
        <option disabled value="">{{ locale === 'ru' ? 'Выберите локацию' : 'Choose location' }}</option>
        <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
      </select>
      <span class="text-xs text-muted-foreground">{{ copy.locationHint }}</span>
    </label>
    <label class="field-group"
      ><span class="field-label">{{ copy.transmission }}</span
      ><select
        class="input-base"
        :value="modelValue.transmission"
        @change="update('transmission', ($event.target as HTMLSelectElement).value as CarFormModel['transmission'])"
      >
        <option v-for="item in TRANSMISSIONS" :key="item" :value="item">{{ humanizeEnum(item) }}</option>
      </select></label
    >
    <label class="field-group"
      ><span class="field-label">{{ copy.fuel }}</span
      ><select
        class="input-base"
        :value="modelValue.fuelType"
        @change="update('fuelType', ($event.target as HTMLSelectElement).value as CarFormModel['fuelType'])"
      >
        <option v-for="item in FUEL_TYPES" :key="item" :value="item">{{ humanizeEnum(item) }}</option>
      </select></label
    >
    <label class="field-group"
      ><span class="field-label">{{ copy.seats }}</span
      ><input
        class="input-base"
        min="2"
        type="number"
        :value="modelValue.seats"
        @input="update('seats', Number(($event.target as HTMLInputElement).value))"
    /></label>
    <label class="field-group"
      ><span class="field-label">{{ copy.odometer }}</span
      ><input
        class="input-base"
        min="0"
        type="number"
        :value="modelValue.odometerKm"
        @input="update('odometerKm', Number(($event.target as HTMLInputElement).value))"
    /></label>
    <div class="field-group md:col-span-2">
      <span class="field-label">{{ copy.image }}</span>
      <div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div class="overflow-hidden rounded-lg border border-border/60 bg-surface/70">
            <img :src="modelValue.imageUrls[0] || '/car-placeholder.svg'" alt="" class="h-52 w-full object-cover" />
          </div>
          <div v-if="modelValue.imageUrls.length" class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div v-for="(imageUrl, index) in modelValue.imageUrls" :key="`${imageUrl}-${index}`" class="space-y-2">
              <div class="overflow-hidden rounded-lg border border-border/60 bg-surface/70">
                <img :src="imageUrl" alt="" class="h-24 w-full object-cover" />
              </div>
              <button class="btn-secondary w-full" type="button" @click="removeImage(index)">
                {{ copy.imageRemove }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <input
            ref="imageInput"
            class="input-base"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            @change="uploadImage"
          />
          <div class="flex flex-wrap gap-3">
            <button class="btn-secondary" type="button" @click="imageInput?.click()">
              {{ modelValue.imageUrls.length ? copy.imageReplace : copy.imageAction }}
            </button>
            <button v-if="modelValue.imageUrls.length" class="btn-secondary" type="button" @click="clearImage">
              {{ locale === 'ru' ? 'Очистить все' : 'Clear all' }}
            </button>
          </div>
          <span class="text-xs text-muted-foreground">{{ copy.imageHint }}</span>
          <span class="text-xs text-muted-foreground">{{ copy.imageLimit }}</span>
          <span class="text-xs text-muted-foreground">{{ copy.imageRequiredSet }}</span>
          <span v-if="imageError" class="text-sm text-danger">{{ imageError }}</span>
        </div>
      </div>
    </div>
    <label class="field-group md:col-span-2"
      ><span class="field-label">{{ copy.notes }}</span
      ><textarea
        class="input-base min-h-[110px]"
        :value="modelValue.notes"
        @input="update('notes', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>
  </div>
</template>

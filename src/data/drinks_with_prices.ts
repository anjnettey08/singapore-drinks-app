import { DrinkType, DrinkCustomization } from '../types/index';

// Common customizations for Singapore drinks
const sweetnessOptions: DrinkCustomization = {
  id: 'sweetness',
  name: 'sweetness',
  displayName: 'Sweetness Level',
  type: 'sweetness',
  isRequired: true,
  defaultOption: 'normal',
  options: [
    { id: 'gao', name: 'gao', displayName: 'Gao (Strong/Sweet)', priceModifier: 0 },
    { id: 'normal', name: 'normal', displayName: 'Normal', priceModifier: 0 },
    { id: 'siu_dai', name: 'siu_dai', displayName: 'Siu Dai (Less Sweet)', priceModifier: 0 },
    { id: 'kosong', name: 'kosong', displayName: 'Kosong (No Sugar)', priceModifier: 0 },
  ],
};

const bubbleTeaSweetnessOptions: DrinkCustomization = {
  id: 'sweetness',
  name: 'sweetness',
  displayName: 'Sweetness Level',
  type: 'sweetness',
  isRequired: true,
  defaultOption: '50',
  options: [
    { id: '0', name: '0', displayName: '0% (No Sugar)', priceModifier: 0 },
    { id: '25', name: '25', displayName: '25%', priceModifier: 0 },
    { id: '50', name: '50', displayName: '50%', priceModifier: 0 },
    { id: '75', name: '75', displayName: '75%', priceModifier: 0 },
    { id: '100', name: '100', displayName: '100% (Full Sugar)', priceModifier: 0 },
  ],
};

const iceOptions: DrinkCustomization = {
  id: 'ice',
  name: 'ice',
  displayName: 'Ice Level',
  type: 'ice',
  isRequired: true,
  defaultOption: 'normal',
  options: [
    { id: 'no_ice', name: 'no_ice', displayName: 'No Ice', priceModifier: 0 },
    { id: 'less_ice', name: 'less_ice', displayName: 'Less Ice', priceModifier: 0 },
    { id: 'normal', name: 'normal', displayName: 'Normal Ice', priceModifier: 0 },
    { id: 'extra_ice', name: 'extra_ice', displayName: 'Extra Ice', priceModifier: 0 },
  ],
};

const temperatureOptions: DrinkCustomization = {
  id: 'temperature',
  name: 'temperature',
  displayName: 'Temperature',
  type: 'temperature',
  isRequired: true,
  defaultOption: 'hot',
  options: [
    { id: 'hot', name: 'hot', displayName: 'Hot', priceModifier: 0 },
    { id: 'cold', name: 'cold', displayName: 'Cold', priceModifier: 0 },
  ],
};

const sizeOptions: DrinkCustomization = {
  id: 'size',
  name: 'size',
  displayName: 'Size',
  type: 'size',
  isRequired: true,
  defaultOption: 'regular',
  options: [
    { id: 'small', name: 'small', displayName: 'Small', priceModifier: 0 },
    { id: 'regular', name: 'regular', displayName: 'Regular', priceModifier: 0 },
    { id: 'large', name: 'large', displayName: 'Large', priceModifier: 0 },
  ],
};

const strengthOptions: DrinkCustomization = {
  id: 'strength',
  name: 'strength',
  displayName: 'Strength',
  type: 'strength',
  isRequired: false,
  defaultOption: 'normal',
  options: [
    { id: 'light', name: 'light', displayName: 'Light', priceModifier: 0 },
    { id: 'normal', name: 'normal', displayName: 'Normal', priceModifier: 0 },
    { id: 'strong', name: 'strong', displayName: 'Strong', priceModifier: 0 },
  ],
};

const bubbleTeaToppingsOptions: DrinkCustomization = {
  id: 'toppings',
  name: 'toppings',
  displayName: 'Toppings',
  type: 'extras',
  isRequired: false,
  options: [
    { id: 'none', name: 'none', displayName: 'No Toppings', priceModifier: 0 },
    { id: 'pearls', name: 'pearls', displayName: 'Tapioca Pearls', priceModifier: 0 },
    { id: 'pudding', name: 'pudding', displayName: 'Pudding', priceModifier: 0 },
    { id: 'jelly', name: 'jelly', displayName: 'Grass Jelly', priceModifier: 0 },
    { id: 'aloe', name: 'aloe', displayName: 'Aloe Vera', priceModifier: 0 },
    { id: 'crystal_pearls', name: 'crystal_pearls', displayName: 'Crystal Pearls', priceModifier: 0 },
    { id: 'cheese_foam', name: 'cheese_foam', displayName: 'Cheese Foam', priceModifier: 0 },
    { id: 'red_bean', name: 'red_bean', displayName: 'Red Bean', priceModifier: 0 },
    { id: 'taro_balls', name: 'taro_balls', displayName: 'Taro Balls', priceModifier: 0 },
    { id: 'coconut_jelly', name: 'coconut_jelly', displayName: 'Coconut Jelly', priceModifier: 0 },
    { id: 'popping_pearls', name: 'popping_pearls', displayName: 'Popping Pearls', priceModifier: 0 },
  ],
};

export const drinks: DrinkType[] = [
  // Coffee - Traditional
  {
    id: 'kopi',
    name: 'Kopi',
    category: 'coffee',
    price: 1.8,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions, strengthOptions],
  },
  {
    id: 'kopi_o',
    name: 'Kopi O',
    category: 'coffee',
    price: 1.5,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions, strengthOptions],
  },
  {
    id: 'kopi_c',
    name: 'Kopi C',
    category: 'coffee',
    price: 2.0,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions, strengthOptions],
  },
  {
    id: 'coffee_latte',
    name: 'Coffee Latte',
    category: 'coffee',
    price: 4.5,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'coffee',
    price: 4.8,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'americano',
    name: 'Americano',
    category: 'coffee',
    price: 3.8,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'specialty_latte',
    name: 'Specialty Latte',
    category: 'coffee',
    price: 5.5,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },

  // Tea
  {
    id: 'teh',
    name: 'Teh',
    category: 'tea',
    price: 1.8,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions, strengthOptions],
  },
  {
    id: 'teh_o',
    name: 'Teh O',
    category: 'tea',
    price: 1.5,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions, strengthOptions],
  },
  {
    id: 'teh_c',
    name: 'Teh C',
    category: 'tea',
    price: 2.0,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions, strengthOptions],
  },
  {
    id: 'teh_tarik',
    name: 'Teh Tarik',
    category: 'tea',
    price: 2.2,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'thai_tea',
    name: 'Thai Tea',
    category: 'tea',
    price: 3.5,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },

  // Bubble Tea - Classic
  {
    id: 'bubble_tea_classic',
    name: 'Classic Bubble Tea',
    category: 'bubble-tea',
    price: 4.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'bubble_tea_taro',
    name: 'Taro Bubble Tea',
    category: 'bubble-tea',
    price: 5.0,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'bubble_tea_matcha',
    name: 'Matcha Bubble Tea',
    category: 'bubble-tea',
    price: 5.2,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'bubble_tea_chocolate',
    name: 'Chocolate Bubble Tea',
    category: 'bubble-tea',
    price: 5.2,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'bubble_tea_brown_sugar',
    name: 'Brown Sugar Bubble Tea',
    category: 'bubble-tea',
    price: 5.8,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'bubble_tea_tiger',
    name: 'Tiger Sugar Bubble Tea',
    category: 'bubble-tea',
    price: 6.0,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'bubble_tea_premium',
    name: 'Premium Bubble Tea',
    category: 'bubble-tea',
    price: 6.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'bubble_tea_oolong',
    name: 'Oolong Bubble Tea',
    category: 'bubble-tea',
    price: 5.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },

  // Milk Tea
  {
    id: 'milk_tea_original',
    name: 'Original Milk Tea',
    category: 'milk-tea',
    price: 4.2,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'milk_tea_oolong',
    name: 'Oolong Milk Tea',
    category: 'milk-tea',
    price: 4.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'milk_tea_jasmine',
    name: 'Jasmine Milk Tea',
    category: 'milk-tea',
    price: 4.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'milk_tea_earl_grey',
    name: 'Earl Grey Milk Tea',
    category: 'milk-tea',
    price: 4.8,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'milk_tea_hokkaido',
    name: 'Hokkaido Milk Tea',
    category: 'milk-tea',
    price: 5.2,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'milk_tea_thai',
    name: 'Thai Milk Tea',
    category: 'milk-tea',
    price: 4.8,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'milk_tea_signature',
    name: 'Signature Milk Tea',
    category: 'milk-tea',
    price: 5.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'milk_tea_roasted',
    name: 'Roasted Milk Tea',
    category: 'milk-tea',
    price: 4.8,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },

  // Fruit Tea
  {
    id: 'fruit_tea_passion',
    name: 'Passion Fruit Tea',
    category: 'fruit-tea',
    price: 4.2,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'fruit_tea_lemon',
    name: 'Lemon Fruit Tea',
    category: 'fruit-tea',
    price: 3.8,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'fruit_tea_grape',
    name: 'Grape Fruit Tea',
    category: 'fruit-tea',
    price: 4.2,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'fruit_tea_strawberry',
    name: 'Strawberry Fruit Tea',
    category: 'fruit-tea',
    price: 4.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'fruit_tea_mango',
    name: 'Mango Fruit Tea',
    category: 'fruit-tea',
    price: 4.8,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'fruit_tea_mixed',
    name: 'Mixed Fruit Tea',
    category: 'fruit-tea',
    price: 5.2,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },

  // Cheese Tea
  {
    id: 'cheese_tea_oolong',
    name: 'Oolong Cheese Tea',
    category: 'cheese-tea',
    price: 5.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'cheese_tea_jasmine',
    name: 'Jasmine Cheese Tea',
    category: 'cheese-tea',
    price: 5.8,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'cheese_tea_earl_grey',
    name: 'Earl Grey Cheese Tea',
    category: 'cheese-tea',
    price: 6.0,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'cheese_tea_fruit',
    name: 'Fruit Cheese Tea',
    category: 'cheese-tea',
    price: 6.5,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },
  {
    id: 'cheese_tea_signature',
    name: 'Signature Cheese Tea',
    category: 'cheese-tea',
    price: 7.2,
    customizations: [bubbleTeaSweetnessOptions, iceOptions, sizeOptions, bubbleTeaToppingsOptions],
  },

  // Juice
  {
    id: 'orange_juice',
    name: 'Orange Juice',
    category: 'juice',
    price: 3.5,
    customizations: [sizeOptions, iceOptions],
  },
  {
    id: 'apple_juice',
    name: 'Apple Juice',
    category: 'juice',
    price: 3.5,
    customizations: [sizeOptions, iceOptions],
  },
  {
    id: 'watermelon_juice',
    name: 'Watermelon Juice',
    category: 'juice',
    price: 4.0,
    customizations: [sizeOptions, iceOptions],
  },
  {
    id: 'sugarcane_juice',
    name: 'Sugarcane Juice',
    category: 'juice',
    price: 2.5,
    customizations: [sizeOptions, iceOptions],
  },
  {
    id: 'fresh_lime_juice',
    name: 'Fresh Lime Juice',
    category: 'juice',
    price: 2.8,
    customizations: [sweetnessOptions, sizeOptions, iceOptions],
  },

  // Soft Drinks
  {
    id: 'coke',
    name: 'Coke',
    category: 'soft-drink',
    price: 1.8,
    customizations: [sizeOptions, iceOptions],
  },
  {
    id: 'sprite',
    name: 'Sprite',
    category: 'soft-drink',
    price: 1.8,
    customizations: [sizeOptions, iceOptions],
  },
  {
    id: '100_plus',
    name: '100 Plus',
    category: 'soft-drink',
    price: 2.0,
    customizations: [sizeOptions, iceOptions],
  },

  // Other Local Drinks
  {
    id: 'bandung',
    name: 'Bandung',
    category: 'other-local-drinks',
    price: 2.2,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'milo',
    name: 'Milo',
    category: 'other-local-drinks',
    price: 2.5,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'horlicks',
    name: 'Horlicks',
    category: 'other-local-drinks',
    price: 2.8,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'barley',
    name: 'Barley Water',
    category: 'other-local-drinks',
    price: 2.2,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'chrysanthemum',
    name: 'Chrysanthemum Tea',
    category: 'other-local-drinks',
    price: 2.5,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'soybean',
    name: 'Soybean Drink',
    category: 'other-local-drinks',
    price: 2.2,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'grass_jelly',
    name: 'Grass Jelly Drink',
    category: 'other-local-drinks',
    price: 2.8,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'chin_chow',
    name: 'Chin Chow',
    category: 'other-local-drinks',
    price: 2.8,
    customizations: [sweetnessOptions, temperatureOptions, sizeOptions],
  },
  {
    id: 'ice_kacang',
    name: 'Ice Kacang',
    category: 'other-local-drinks',
    price: 3.5,
    customizations: [sweetnessOptions, sizeOptions],
  },

  // Alcohol
  {
    id: 'beer_tiger',
    name: 'Tiger Beer',
    category: 'alcohol',
    price: 8.0,
    customizations: [temperatureOptions, sizeOptions],
  },
  {
    id: 'beer_heineken',
    name: 'Heineken',
    category: 'alcohol',
    price: 9.0,
    customizations: [temperatureOptions, sizeOptions],
  },
  {
    id: 'wine_red',
    name: 'Red Wine',
    category: 'alcohol',
    price: 12.0,
    customizations: [temperatureOptions, sizeOptions],
  },
  {
    id: 'wine_white',
    name: 'White Wine',
    category: 'alcohol',
    price: 12.0,
    customizations: [temperatureOptions, sizeOptions],
  },
  {
    id: 'cocktail_singapore_sling',
    name: 'Singapore Sling',
    category: 'alcohol',
    price: 15.0,
    customizations: [iceOptions, sizeOptions],
  },
];
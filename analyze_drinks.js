// Comprehensive analysis of drink coverage after fixes
const fs = require('fs');

// Read the actual drinks.ts file
const drinksContent = fs.readFileSync('./src/data/drinks.ts', 'utf8');
const restaurantsContent = fs.readFileSync('./src/data/restaurants.ts', 'utf8');

// Extract drink IDs from drinks.ts
const drinkMatches = drinksContent.match(/id: '([^']+)',\s*name:/g);
const allDrinkIds = drinkMatches ? drinkMatches.map(match => match.match(/id: '([^']+)'/)[1]) : [];

// Extract available drinks from restaurants.ts
const availableMatches = restaurantsContent.match(/availableDrinks: \[([^\]]+)\]/g);
const allAvailableDrinks = new Set();

if (availableMatches) {
  availableMatches.forEach(match => {
    const drinksArray = match.match(/availableDrinks: \[([^\]]+)\]/)[1];
    const drinks = drinksArray.split(',').map(d => d.trim().replace(/['"]/g, ''));
    drinks.forEach(drink => allAvailableDrinks.add(drink));
  });
}

// Find missing drinks
const missingDrinks = allDrinkIds.filter(drinkId => !allAvailableDrinks.has(drinkId));

// Find invalid drinks (in restaurants but not in drinks.ts)
const invalidDrinks = [...allAvailableDrinks].filter(drinkId => !allDrinkIds.includes(drinkId));

console.log('=== DRINK COVERAGE ANALYSIS ===');
console.log(`Total drinks in drinks.ts: ${allDrinkIds.length}`);
console.log(`Unique drinks available in restaurants: ${allAvailableDrinks.size}`);
console.log(`Missing drinks (in drinks.ts but not available): ${missingDrinks.length}`);
console.log(`Invalid drinks (in restaurants but not in drinks.ts): ${invalidDrinks.length}`);

if (missingDrinks.length > 0) {
  console.log('\n❌ MISSING DRINKS:');
  missingDrinks.forEach(drink => console.log(`  - ${drink}`));
}

if (invalidDrinks.length > 0) {
  console.log('\n❌ INVALID DRINKS:');
  invalidDrinks.forEach(drink => console.log(`  - ${drink}`));
}

if (missingDrinks.length === 0 && invalidDrinks.length === 0) {
  console.log('\n✅ SUCCESS: All drinks have corresponding shops!');
  console.log('✅ All shop drinks reference valid drinks!');
}

// Group drinks by category for better overview
const categoryMapping = {
  coffee: allDrinkIds.filter(id => ['kopi', 'coffee', 'cappuccino', 'americano', 'latte'].some(keyword => id.includes(keyword))),
  tea: allDrinkIds.filter(id => ['teh'].some(keyword => id.includes(keyword)) && !id.includes('bubble') && !id.includes('milk') && !id.includes('fruit') && !id.includes('cheese')),
  bubbleTea: allDrinkIds.filter(id => id.startsWith('bubble_tea_')),
  milkTea: allDrinkIds.filter(id => id.startsWith('milk_tea_')),
  fruitTea: allDrinkIds.filter(id => id.startsWith('fruit_tea_')),
  cheeseTea: allDrinkIds.filter(id => id.startsWith('cheese_tea_')),
  juice: allDrinkIds.filter(id => id.includes('juice') || ['orange_juice', 'apple_juice', 'watermelon_juice', 'sugarcane_juice', 'fresh_lime_juice'].includes(id)),
  softDrinks: allDrinkIds.filter(id => ['coke', 'sprite', '100_plus'].includes(id)),
  localDrinks: allDrinkIds.filter(id => ['bandung', 'milo', 'horlicks', 'barley', 'chrysanthemum', 'soybean', 'grass_jelly', 'chin_chow', 'ice_kacang'].includes(id)),
  alcohol: allDrinkIds.filter(id => id.includes('beer_') || id.includes('wine_') || id.includes('cocktail_'))
};

console.log('\n=== DRINKS BY CATEGORY ===');
Object.entries(categoryMapping).forEach(([category, drinks]) => {
  const availableCount = drinks.filter(drink => allAvailableDrinks.has(drink)).length;
  console.log(`${category}: ${availableCount}/${drinks.length} available`);
});
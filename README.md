# Singapore Drinks Discovery Web App

A React web application for discovering drinks and restaurants/stalls in Singapore with comprehensive filtering and search capabilities.

🌐 **Live Demo**: [View App Online](https://yourusername.github.io/singapore-drinks-app) *(Update with your username)*

## 🚀 Quick Deploy to GitHub Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

```bash
npm install
npm run deploy
```

## Features

### 🥤 Drink Selection
- Browse all available drinks in Singapore by category (Coffee, Tea, Juice, Soft Drinks, Alcohol)
- Customize drinks with traditional Singapore options:
  - **Sweetness levels**: Gao (strong/sweet), Normal, Siu Dai (less sweet), Kosong (no sugar)
  - **Temperature**: Hot, Cold, Iced
  - **Size**: Small, Regular, Large
  - **Strength**: Light, Normal, Strong
  - **Special options**: Different milk types, toppings for bubble tea, etc.

### 🔍 Smart Filtering
- **Distance filter**: Set maximum travel distance (1-20km)
- **Price filter**: Set maximum price per drink ($10-$100)
- **Rating filter**: Minimum Google rating (3.0-5.0 stars)
- **Location services**: Use current location or search custom location
- **Opening hours filter**: Show only open restaurants (toggle option)
- **Promotions filter**: Show only restaurants with current promos

### 🏪 Restaurant Discovery
- **Proximity-based ranking**: Results sorted by distance by default
- **Multiple sorting options**: Distance, Rating, Price, Name
- **Real-time status**: Shows if restaurant is open/closed
- **Closing alerts**: Highlights restaurants closing within 30 minutes
- **Contact integration**: Direct call and website access
- **Detailed information**: Address, rating, reviews, price range, wait times

### 📍 Location Features
- Current location detection
- Custom location search
- Distance calculation to all restaurants
- Location-based filtering

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: CSS modules and custom CSS
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Create React App
- **Data**: Mock data representing real Singapore establishments

## Installation & Setup

1. **Prerequisites**:
   ```bash
   node --version  # Ensure Node.js 16+ is installed
   npm --version   # Ensure npm is available
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm start
   ```
   The app will open in your browser at `http://localhost:3000`

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── screens/
│   ├── DrinkSelectionScreen.tsx    # Main drink browsing screen
│   ├── DrinkSelectionScreen.css    # Styles for drink selection
│   ├── FiltersScreen.tsx           # Search filters interface
│   ├── FiltersScreen.css           # Styles for filters
│   ├── RestaurantListScreen.tsx    # Results listing with sorting
│   └── RestaurantListScreen.css    # Styles for restaurant list
├── data/
│   ├── drinks.ts                   # Singapore drinks data with customizations
│   └── restaurants.ts              # Restaurant/stall data with details
├── types/
│   └── index.ts                    # TypeScript type definitions
├── utils/
│   └── index.ts                    # Utility functions (distance, time, etc.)
├── index.tsx                       # App entry point
└── index.css                       # Global styles
```

## Available Scripts

- **`npm start`**: Runs the app in development mode
- **`npm run build`**: Builds the app for production
- **`npm test`**: Launches the test runner
- **`npm run eject`**: Ejects from Create React App (one-way operation)

## Singapore Drinks Included

### Coffee (Kopi)
- Kopi (coffee with condensed milk)
- Kopi O (black coffee with sugar)
- Kopi C (coffee with evaporated milk)
- Western-style: Latte, Cappuccino, Americano

### Tea (Teh)
- Teh (tea with condensed milk)
- Teh O (tea with sugar)
- Teh C (tea with evaporated milk)
- Teh Tarik (pulled tea)
- Thai Tea, Bubble Tea

### Fresh Juices
- Sugarcane juice (with lemon/ginger options)
- Fresh orange juice
- Watermelon juice

### Local Drinks
- Bandung (rose syrup milk)
- Milo, Horlicks
- Local beers: Tiger, Carlsberg

## Development

### Adding New Drinks
1. Update `src/data/drinks.ts`
2. Add drink type with customization options
3. Ensure restaurant availability in `src/data/restaurants.ts`

### Adding New Restaurants
1. Update `src/data/restaurants.ts`
2. Include opening hours, location, and available drinks
3. Add contact information and pricing

### Customizing Styles
1. Modify CSS files in `src/screens/` for component-specific styles
2. Update `src/index.css` for global styles
3. Modify `App.css` for app-wide layout and theming

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- [ ] Real GPS location services via browser geolocation API
- [ ] Google Maps integration
- [ ] Real-time opening hours via Google Places API
- [ ] User reviews and photos
- [ ] Favorites and order history (localStorage)
- [ ] PWA (Progressive Web App) capabilities
- [ ] Push notifications for promotions
- [ ] Multi-language support (Chinese, Malay, Tamil)
- [ ] Mobile-responsive improvements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with TypeScript support
4. Add mock data as needed
5. Test in multiple browsers
6. Submit pull request

## License

MIT License - Feel free to use this project for learning and development.

---

Built with ❤️ for Singapore's vibrant food and drinks culture!

**Now running as a web application!** 🌐
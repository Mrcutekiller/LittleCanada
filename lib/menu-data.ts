export interface MenuItem {
  id: string
  name: string
  basePrice: number
  emoji: string
  popular?: boolean
  description?: string
  ingredients: string[]
  coverImage?: string
  funFact?: string
}

export interface MenuCategory {
  burgers: MenuItem[]
  pizzas: MenuItem[]
  breakfast: MenuItem[]
  desserts: MenuItem[]
}

export const MENU: MenuCategory = {
  burgers: [
    {
      id: 'b1',
      name: 'L.C Special Burger',
      basePrice: 700,
      emoji: '🍔',
      popular: true,
      description: 'Beef patty with Canadian cheese & house sauces',
      ingredients: ['beef', 'canadian cheese', 'lettuce', 'tomato', 'sauce', 'onion', 'mayo'],
      coverImage: '/food/L.C Special Burger.png',
      funFact: '🍁 Named after the Great White North — this is the burger that started it all at Little Canada. Inspired by cross-country road trips from Vancouver to Toronto.',
    },
    {
      id: 'b2',
      name: 'Fried Chicken Burger',
      basePrice: 800,
      emoji: '🍗',
      description: 'Crispy fried chicken fillet with Canadian cheese',
      ingredients: ['fried chicken', 'canadian cheese', 'lettuce', 'tomato', 'sauce', 'onion', 'mayo'],
      coverImage: '/food/Fried Chicken Burger.png',
      funFact: '🇨🇦 Canada is one of the world\'s top chicken consumers — we put it on everything, even poutine. This crispy beast is a tribute to that love.',
    },
    {
      id: 'b3',
      name: 'Half Half Burger',
      basePrice: 800,
      emoji: '🍔',
      description: 'Best of both worlds — beef & chicken in one',
      ingredients: ['beef', 'chicken', 'canadian cheese', 'lettuce', 'tomato', 'sauce', 'onion', 'mayo'],
      coverImage: '/food/Half Half Burger.png',
      funFact: '🌗 Canada is bilingual — English AND French. This burger is bilingual too — beef AND chicken. Best of both worlds, eh!',
    },
    {
      id: 'b4',
      name: 'Veggie Burger',
      basePrice: 500,
      emoji: '🥗',
      description: '100% plant-based with vegan mayo',
      ingredients: ['plant-based patty', 'vegan mayo', 'lettuce', 'tomato'],
      coverImage: '/food/Veggie Burger.png',
      funFact: '🌱 British Columbia grows more organic produce than anywhere in Canada. This plant-powered patty brings that West Coast vibes to Addis Ababa.',
    },
    {
      id: 'b5',
      name: 'Double Beef Burger',
      basePrice: 1000,
      emoji: '🍔',
      popular: true,
      description: 'Double stacked beef patties — the real deal',
      ingredients: ['double beef', 'cheese', 'lettuce', 'tomato', 'sauce', 'onion', 'mayo'],
      coverImage: '/food/Double Beef Burger.png',
      funFact: '🐄 Alberta is called "Canada\'s Beef Country" — they raise over 5 million cattle. This double stack honours that ranching tradition.',
    },
    {
      id: 'b6',
      name: 'Double Chicken Burger',
      basePrice: 1300,
      emoji: '🍗',
      description: 'Stacked double chicken with Canadian cheese',
      ingredients: ['double chicken', 'canadian cheese', 'lettuce', 'tomato', 'sauce', 'onion', 'mayo'],
      coverImage: '/food/Double Chicken Burger.png',
      funFact: '🍗 Ontario\'s chicken farms produce over 300 million birds a year. We stacked two right here so you get double the Canadian flavour.',
    },
  ],
  pizzas: [
    {
      id: 'p1',
      name: 'L.C Special Pizza',
      basePrice: 800,
      emoji: '🍕',
      popular: true,
      description: 'Signature house pizza with veggie & chicken',
      ingredients: ['veggie', 'chicken', 'tomato sauce', 'canadian cheese'],
      coverImage: '/food/L.C Special Pizza.png',
      funFact: '🍁 The pizza was invented in Italy, but Canada made it legendary — Montreal alone has over 800 pizzerias. This is our signature slice.',
    },
    {
      id: 'p2',
      name: 'BBQ Chicken Pizza',
      basePrice: 800,
      emoji: '🍕',
      description: 'Smoky BBQ base with grilled chicken & veggies',
      ingredients: ['BBQ sauce', 'veggie', 'chicken', 'tomato sauce', 'canadian cheese'],
      coverImage: '/food/BBQ Chicken Pizza.png',
      funFact: '🔥 Canadians spend over $1 billion on BBQ every summer. From backyard cook-offs in Winnipeg to food trucks in Halifax — BBQ is a way of life.',
    },
    {
      id: 'p3',
      name: 'Steak Pizza',
      basePrice: 800,
      emoji: '🍕',
      popular: true,
      description: 'Tender meat with caramelized onions & mushrooms',
      ingredients: ['meat', 'caramelized onions', 'mushroom', 'pepper', 'cheese'],
      coverImage: '/food/Steak Pizza.png',
      funFact: '🥩 Canada\'s Rocky Mountain regions produce some of the finest grass-fed beef in the world. We put it right on top of your pizza.',
    },
    {
      id: 'p4',
      name: 'Margarita Pizza',
      basePrice: 600,
      emoji: '🍕',
      description: 'Classic Italian simplicity at its finest',
      ingredients: ['tomato sauce', 'canadian cheese'],
      coverImage: '/food/Margarita Pizza.png',
      funFact: '🇮🇹 Simple, clean, perfect — just like a Canadian sunset over Lake Louise. Sometimes less really is more.',
    },
    {
      id: 'p5',
      name: 'Hawaiian Pizza',
      basePrice: 700,
      emoji: '🍕',
      description: 'Sweet meets savory with ham & pineapple',
      ingredients: ['tomato sauce', 'ham', 'canadian cheese', 'pineapple'],
      coverImage: '/food/Hawaiian Pizza.png',
      funFact: '🍍 Plot twist — Hawaiian pizza was actually invented in Canada by Sam Panopoulos in 1962 in Chatham, Ontario. You\'re welcome, world!',
    },
    {
      id: 'p6',
      name: 'Veggie Pizza',
      basePrice: 600,
      emoji: '🌿',
      description: 'Fresh plant-based toppings on tomato base',
      ingredients: ['plant-based toppings', 'tomato sauce'],
      coverImage: '/food/Veggie Pizza.png',
      funFact: '🌿 The Okanagan Valley in BC grows some of the best organic veggies in North America. Fresh from farm to your pizza slice.',
    },
  ],
  breakfast: [
    {
      id: 'br1',
      name: 'Omelette Sandwich',
      basePrice: 350,
      emoji: '🍳',
      description: 'Fresh egg omelette in a toasted sandwich',
      ingredients: ['egg omelette', 'toasted bread', 'veggies'],
      coverImage: '/food/Omelette Sandwich.png',
      funFact: '🍳 Canadians eat more eggs per person than almost anywhere in the Americas — over 200 per year. This omelette is pure Canadian comfort.',
    },
    {
      id: 'br2',
      name: 'Tuna Sandwich',
      basePrice: 400,
      emoji: '🥪',
      description: 'Premium tuna with fresh fillings',
      ingredients: ['tuna', 'bread', 'lettuce', 'mayo'],
      coverImage: '/food/Tuna Sandwich.png',
      funFact: '🐟 Nova Scotia is Canada\'s seafood capital — fresh Atlantic tuna is a delicacy. This sandwich brings that East Coast flavour to your table.',
    },
    {
      id: 'br3',
      name: 'French Toast',
      basePrice: 350,
      emoji: '🍞',
      description: 'Golden crispy French toast — a morning classic',
      ingredients: ['bread', 'egg', 'butter', 'cinnamon'],
      coverImage: '/food/French Toast.png',
      funFact: '🍁 Quebec produces 70% of the world\'s maple syrup — the real liquid gold. We drizzle it on this French toast just like they do in Montreal.',
    },
  ],
  desserts: [
    {
      id: 'd1',
      name: 'Chocolate Pizza',
      basePrice: 500,
      emoji: '🍫',
      popular: true,
      description: 'Dessert pizza loaded with Nutella & toppings',
      ingredients: ['nutella', 'white chocolate', 'maple syrup', 'oreo', 'kitkat', 'mars', 'strawberry'],
      coverImage: '/food/Chocolate Pizza.png',
      funFact: '🍫 Canada\'s chocolate heritage goes back to 1720 when it was first served in Quebec City. This chocolate pizza is our sweet tribute to that legacy.',
    },
    {
      id: 'd2',
      name: 'Waffle / Pancake',
      basePrice: 350,
      emoji: '🧇',
      description: 'Fluffy waffle or pancake stack',
      ingredients: ['flour', 'eggs', 'butter', 'syrup'],
      coverImage: '/food/Waffle Pancake.png',
      funFact: '🥞 Canada has a National Pancake Day every February — stack \'em high with maple syrup, just like they do from coast to coast.',
    },
    {
      id: 'd3',
      name: 'Ice Cream',
      basePrice: 300,
      emoji: '🍦',
      description: 'Creamy scoops in classic flavours',
      ingredients: ['fresh cream', 'vanilla', 'sugar'],
      coverImage: '/food/Ice Cream.png',
      funFact: '🍦 Canadians consume over 10 million litres of ice cream every summer — even when it\'s -20°C outside. We don\'t play with dessert.',
    },
    {
      id: 'd4',
      name: 'Nutella Ice Cream Sandwich',
      basePrice: 350,
      emoji: '🍪',
      description: 'Nutella spread between ice cream layers',
      ingredients: ['nutella', 'ice cream', 'wafer'],
      coverImage: '/food/Nutella Ice Cream Sandwich.png',
      funFact: '🍪 Canadians invented the Ice Cream Sandwich concept — combining two favourites into one cold, creamy, chocolatey masterpiece.',
    },
    {
      id: 'd5',
      name: 'Ice Coffee & Milkshake',
      basePrice: 250,
      emoji: '☕',
      description: 'Chilled coffee or blended milkshake',
      ingredients: ['coffee/milk', 'ice', 'sugar', 'cream'],
      coverImage: '/food/Ice Coffee & Milkshake.png',
      funFact: '☕ Canada is the 8th largest coffee-consuming nation on earth. From Tim Hortons to Little Canada — we take our coffee seriously.',
    },
    {
      id: 'd6',
      name: 'Soft Drinks',
      basePrice: 60,
      emoji: '🥤',
      description: 'Assorted chilled soft drinks',
      ingredients: ['coca-cola', 'sprite', 'fanta', 'water'],
      coverImage: '/food/Soft Drinks.png',
      funFact: '🥤 Canada has one of the most diverse soft drink markets in the world — from classic cola to unique local flavours. Something for everyone!',
    },
  ],
}

export type CategoryKey = keyof MenuCategory

export const CATEGORIES = [
  { key: 'burgers' as CategoryKey, label: '🍔 Burgers' },
  { key: 'pizzas' as CategoryKey, label: '🍕 Pizzas' },
  { key: 'breakfast' as CategoryKey, label: '🍳 Breakfast' },
  { key: 'desserts' as CategoryKey, label: '🍫 Desserts & Drinks' },
]

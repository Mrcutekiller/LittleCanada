export interface MenuItem {
  id: string
  name: string
  basePrice: number
  emoji: string
  popular?: boolean
  description?: string
  ingredients: string[]
  coverImage?: string
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
      ingredients: ['Beef patty', 'Canadian cheese', 'Lettuce', 'Tomato', 'Pickles', 'House special sauce', 'Brioche bun'],
      coverImage: '/food/L.C Special Burger.png',
    },
    {
      id: 'b2',
      name: 'Fried Chicken Burger',
      basePrice: 800,
      emoji: '🍗',
      description: 'Crispy fried chicken fillet with Canadian cheese',
      ingredients: ['Crispy fried chicken fillet', 'Canadian cheese', 'Lettuce', 'Coleslaw', 'Sriracha mayo', 'Brioche bun'],
      coverImage: '/food/Fried Chicken Burger.png',
    },
    {
      id: 'b3',
      name: 'Half Half Burger',
      basePrice: 800,
      emoji: '🍔',
      description: 'Best of both worlds — beef & chicken in one',
      ingredients: ['Beef patty', 'Fried chicken fillet', 'Canadian cheese', 'Lettuce', 'Tomato', 'House sauce', 'Brioche bun'],
      coverImage: '/food/Half Half Burger.png',
    },
    {
      id: 'b4',
      name: 'Veggie Burger',
      basePrice: 500,
      emoji: '🥗',
      description: '100% plant-based with vegan mayo',
      ingredients: ['Plant-based patty', 'Vegan mayo', 'Lettuce', 'Tomato', 'Pickles', 'Mustard', 'Brioche bun'],
      coverImage: '/food/Veggie Burger.png',
    },
    {
      id: 'b5',
      name: 'Double Beef Burger',
      basePrice: 1000,
      emoji: '🍔',
      popular: true,
      description: 'Double stacked beef patties — the real deal',
      ingredients: ['Double beef patties', 'Double Canadian cheese', 'Lettuce', 'Tomato', 'Pickles', 'House sauce', 'Brioche bun'],
      coverImage: '/food/Double Beef Burger.png',
    },
    {
      id: 'b6',
      name: 'Double Chicken Burger',
      basePrice: 1300,
      emoji: '🍗',
      description: 'Stacked double chicken with Canadian cheese',
      ingredients: ['Double fried chicken fillets', 'Canadian cheese', 'Lettuce', 'Coleslaw', 'Sriracha mayo', 'Brioche bun'],
      coverImage: '/food/Double Chicken Burger.png',
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
      ingredients: ['Tomato base', 'Mozzarella', 'Grilled chicken', 'Bell peppers', 'Onions', 'Mushrooms', 'House seasoning'],
      coverImage: '/food/L.C Special Pizza.png',
    },
    {
      id: 'p2',
      name: 'BBQ Chicken Pizza',
      basePrice: 800,
      emoji: '🍕',
      description: 'Smoky BBQ base with grilled chicken & veggies',
      ingredients: ['BBQ sauce base', 'Mozzarella', 'Grilled chicken', 'Red onion', 'Corn', 'Cilantro'],
      coverImage: '/food/BBQ Chicken Pizza.png',
    },
    {
      id: 'p3',
      name: 'Steak Pizza',
      basePrice: 800,
      emoji: '🍕',
      popular: true,
      description: 'Tender meat with caramelized onions & mushrooms',
      ingredients: ['Tomato base', 'Mozzarella', 'Tender beef strips', 'Caramelized onions', 'Mushrooms', 'Garlic'],
      coverImage: '/food/Steak Pizza.png',
    },
    {
      id: 'p4',
      name: 'Margarita Pizza',
      basePrice: 600,
      emoji: '🍕',
      description: 'Classic Italian simplicity at its finest',
      ingredients: ['San Marzano tomato base', 'Fresh mozzarella', 'Basil', 'Olive oil', 'Sea salt'],
      coverImage: '/food/Margarita Pizza.png',
    },
    {
      id: 'p5',
      name: 'Hawaiian Pizza',
      basePrice: 700,
      emoji: '🍕',
      description: 'Sweet meets savory with ham & pineapple',
      ingredients: ['Tomato base', 'Mozzarella', 'Smoked ham', 'Pineapple', 'Bell peppers'],
      coverImage: '/food/Hawaiian Pizza.png',
    },
    {
      id: 'p6',
      name: 'Veggie Pizza',
      basePrice: 600,
      emoji: '🌿',
      description: 'Fresh plant-based toppings on tomato base',
      ingredients: ['Tomato base', 'Mozzarella', 'Bell peppers', 'Mushrooms', 'Onions', 'Olives', 'Zucchini'],
      coverImage: '/food/Veggie Pizza.png',
    },
  ],
  breakfast: [
    {
      id: 'br1',
      name: 'Omelette Sandwich',
      basePrice: 350,
      emoji: '🍳',
      description: 'Fresh egg omelette in a toasted sandwich',
      ingredients: ['Fresh eggs', 'Toasted bread', 'Butter', 'Salt', 'Pepper', 'Cheese (optional)'],
      coverImage: '/food/Omelette Sandwich.png',
    },
    {
      id: 'br2',
      name: 'Tuna Sandwich',
      basePrice: 400,
      emoji: '🥪',
      description: 'Premium tuna with fresh fillings',
      ingredients: ['Premium tuna', 'Mayonnaise', 'Lettuce', 'Tomato', 'Toasted bread'],
      coverImage: '/food/Tuna Sandwich.png',
    },
    {
      id: 'br3',
      name: 'French Toast',
      basePrice: 350,
      emoji: '🍞',
      description: 'Golden crispy French toast — a morning classic',
      ingredients: ['Thick-cut bread', 'Eggs', 'Milk', 'Cinnamon', 'Vanilla', 'Powdered sugar', 'Maple syrup'],
      coverImage: '/food/French Toast.png',
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
      ingredients: ['Nutella base', 'Mozzarella', 'Banana', 'Strawberry', 'Chocolate drizzle', 'Powdered sugar'],
      coverImage: '/food/Chocolate Pizza.png',
    },
    {
      id: 'd2',
      name: 'Waffle / Pancake',
      basePrice: 350,
      emoji: '🧇',
      description: 'Fluffy waffle or pancake stack',
      ingredients: ['Flour', 'Eggs', 'Milk', 'Butter', 'Maple syrup', 'Fresh berries'],
      coverImage: '/food/Waffle Pancake.png',
    },
    {
      id: 'd3',
      name: 'Ice Cream',
      basePrice: 300,
      emoji: '🍦',
      description: 'Creamy scoops in classic flavours',
      ingredients: ['Cream', 'Milk', 'Sugar', 'Vanilla — served in classic flavours'],
      coverImage: '/food/Ice Cream.png',
    },
    {
      id: 'd4',
      name: 'Nutella Ice Cream Sandwich',
      basePrice: 350,
      emoji: '🍪',
      description: 'Nutella spread between ice cream layers',
      ingredients: ['Nutella', 'Ice cream scoops', 'Waffle cookies'],
      coverImage: '/food/Nutella Ice Cream Sandwich.png',
    },
    {
      id: 'd5',
      name: 'Ice Coffee & Milkshake',
      basePrice: 250,
      emoji: '☕',
      description: 'Chilled coffee or blended milkshake',
      ingredients: ['Espresso or blended milk', 'Ice', 'Flavoured syrups'],
      coverImage: '/food/Ice Coffee & Milkshake.png',
    },
    {
      id: 'd6',
      name: 'Soft Drinks',
      basePrice: 60,
      emoji: '🥤',
      description: 'Assorted chilled soft drinks',
      ingredients: ['Assorted chilled canned and bottled beverages'],
      coverImage: '/food/Soft Drinks.png',
    },
  ],
}

export interface IngredientLayer {
  id: string
  label: string
  defaultY: number
  explodedY: number
  emoji: string
}

export function getIngredientLayers(type: string): IngredientLayer[] {
  if (type === 'burger') {
    return [
      { id: 'bottom-bun', label: 'Bottom Bun', defaultY: -0.42, explodedY: -1.6, emoji: '🍞' },
      { id: 'patty', label: 'Beef Patty', defaultY: 0.12, explodedY: -0.6, emoji: '🥩' },
      { id: 'sauce', label: 'Special Sauce', defaultY: 0.28, explodedY: 0.2, emoji: '🫗' },
      { id: 'cheese', label: 'Cheddar Cheese', defaultY: 0.30, explodedY: 1.0, emoji: '🧀' },
      { id: 'lettuce', label: 'Fresh Lettuce', defaultY: 0.34, explodedY: 1.8, emoji: '🥬' },
      { id: 'tomato', label: 'Tomato Slice', defaultY: 0.38, explodedY: 2.6, emoji: '🍅' },
      { id: 'top-bun', label: 'Top Bun', defaultY: 0.52, explodedY: 3.6, emoji: '🍞' },
    ]
  }
  if (type === 'pizza') {
    return [
      { id: 'crust', label: 'Pizza Crust', defaultY: 0.02, explodedY: -1.2, emoji: '🫓' },
      { id: 'sauce', label: 'Tomato Sauce', defaultY: 0.055, explodedY: -0.3, emoji: '🍅' },
      { id: 'cheese', label: 'Mozzarella', defaultY: 0.08, explodedY: 0.6, emoji: '🧀' },
      { id: 'toppings', label: 'Toppings', defaultY: 0.12, explodedY: 1.6, emoji: '🍕' },
    ]
  }
  if (type === 'sandwich') {
    return [
      { id: 'bottom-bread', label: 'Bottom Bread', defaultY: -0.28, explodedY: -1.4, emoji: '🍞' },
      { id: 'filling', label: 'Chicken Filling', defaultY: 0.14, explodedY: -0.4, emoji: '🍗' },
      { id: 'cheese', label: 'Cheese Slice', defaultY: 0.18, explodedY: 0.5, emoji: '🧀' },
      { id: 'lettuce', label: 'Lettuce', defaultY: 0.22, explodedY: 1.3, emoji: '🥬' },
      { id: 'tomato', label: 'Tomato', defaultY: 0.24, explodedY: 2.1, emoji: '🍅' },
      { id: 'top-bread', label: 'Top Bread', defaultY: 0.26, explodedY: 3.0, emoji: '🍞' },
    ]
  }
  return [
    { id: 'cone', label: 'Waffle Cone', defaultY: -0.45, explodedY: -1.5, emoji: '🍦' },
    { id: 'scoop1', label: 'Vanilla Scoop', defaultY: 0.15, explodedY: 0.0, emoji: '🍨' },
    { id: 'scoop2', label: 'Chocolate Scoop', defaultY: 0.62, explodedY: 1.5, emoji: '🍫' },
    { id: 'topping', label: 'Strawberry', defaultY: 1.0, explodedY: 2.8, emoji: '🍓' },
  ]
}

export type CategoryKey = keyof MenuCategory

export const CATEGORIES = [
  { key: 'burgers' as CategoryKey, label: '🍔 Burgers' },
  { key: 'pizzas' as CategoryKey, label: '🍕 Pizzas' },
  { key: 'breakfast' as CategoryKey, label: '🍳 Breakfast' },
  { key: 'desserts' as CategoryKey, label: '🍫 Desserts & Drinks' },
]

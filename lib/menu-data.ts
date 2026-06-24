export interface MenuItem {
  id: string
  name: string
  basePrice: number
  price?: number
  emoji: string
  image: string
  popular?: boolean
  desc?: string
  description?: string
  ingredients: string[]
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
      basePrice: 600,
      emoji: '🍔',
      image: '/food/b1-lc-special-burger.png',
      popular: true,
      description: 'Beef patty with Canadian cheese & house sauces',
      ingredients: ['Beef patty', 'Canadian cheese', 'Lettuce', 'Tomato', 'Pickles', 'House special sauce', 'Brioche bun'],
    },
    {
      id: 'b2',
      name: 'Fried Chicken Burger',
      basePrice: 800,
      emoji: '🍗',
      image: '/food/b2-fried-chicken-burger.png',
      description: 'Crispy fried chicken fillet with Canadian cheese',
      ingredients: ['Crispy fried chicken fillet', 'Canadian cheese', 'Lettuce', 'Coleslaw', 'Sriracha mayo', 'Brioche bun'],
    },
    {
      id: 'b3',
      name: 'Half Half Burger',
      basePrice: 700,
      emoji: '🍔',
      image: '/food/b3-half-half-burger.png',
      description: 'Best of both worlds — beef & chicken in one',
      ingredients: ['Beef patty', 'Fried chicken fillet', 'Canadian cheese', 'Lettuce', 'Tomato', 'House sauce', 'Brioche bun'],
    },
    {
      id: 'b4',
      name: 'Veggie Burger',
      basePrice: 500,
      emoji: '🥗',
      image: '/food/b4-veggie-burger.png',
      description: '100% plant-based with vegan mayo',
      ingredients: ['Plant-based patty', 'Vegan mayo', 'Lettuce', 'Tomato', 'Pickles', 'Mustard', 'Brioche bun'],
    },
    {
      id: 'b5',
      name: 'Double Beef Burger',
      basePrice: 1000,
      emoji: '🍔',
      image: '/food/b5-double-beef-burger.png',
      popular: true,
      description: 'Double stacked beef patties — the real deal',
      ingredients: ['Double beef patties', 'Double Canadian cheese', 'Lettuce', 'Tomato', 'Pickles', 'House sauce', 'Brioche bun'],
    },
    {
      id: 'b6',
      name: 'Double Chicken Burger',
      basePrice: 1000,
      emoji: '🍗',
      image: '/food/b6-double-chicken-burger.png',
      description: 'Stacked double chicken with Canadian cheese',
      ingredients: ['Double fried chicken fillets', 'Canadian cheese', 'Lettuce', 'Coleslaw', 'Sriracha mayo', 'Brioche bun'],
    },
  ],
  pizzas: [
    {
      id: 'p1',
      name: 'L.C Special Pizza',
      basePrice: 600,
      emoji: '🍕',
      image: '/food/p1-lc-special-pizza.png',
      popular: true,
      description: 'Signature house pizza with veggie & chicken',
      ingredients: ['Tomato base', 'Mozzarella', 'Grilled chicken', 'Bell peppers', 'Onions', 'Mushrooms', 'House seasoning'],
    },
    {
      id: 'p2',
      name: 'BBQ Chicken Pizza',
      basePrice: 600,
      emoji: '🍕',
      image: '/food/p2-bbq-chicken-pizza.png',
      description: 'Smoky BBQ base with grilled chicken & veggies',
      ingredients: ['BBQ sauce base', 'Mozzarella', 'Grilled chicken', 'Red onion', 'Corn', 'Cilantro'],
    },
    {
      id: 'p3',
      name: 'Steak Pizza',
      basePrice: 700,
      emoji: '🍕',
      image: '/food/p3-steak-pizza.png',
      popular: true,
      description: 'Tender meat with caramelized onions & mushrooms',
      ingredients: ['Tomato base', 'Mozzarella', 'Tender beef strips', 'Caramelized onions', 'Mushrooms', 'Garlic'],
    },
    {
      id: 'p4',
      name: 'Margarita Pizza',
      basePrice: 500,
      emoji: '🍕',
      image: '/food/p4-margarita-pizza.png',
      description: 'Classic Italian simplicity at its finest',
      ingredients: ['San Marzano tomato base', 'Fresh mozzarella', 'Basil', 'Olive oil', 'Sea salt'],
    },
    {
      id: 'p5',
      name: 'Hawaiian Pizza',
      basePrice: 600,
      emoji: '🍕',
      image: '/food/p5-hawaiian-pizza.png',
      description: 'Sweet meets savory with ham & pineapple',
      ingredients: ['Tomato base', 'Mozzarella', 'Smoked ham', 'Pineapple', 'Bell peppers'],
    },
    {
      id: 'p6',
      name: 'Veggie Pizza',
      basePrice: 500,
      emoji: '🌿',
      image: '/food/p6-veggie-pizza.png',
      description: 'Fresh plant-based toppings on tomato base',
      ingredients: ['Tomato base', 'Mozzarella', 'Bell peppers', 'Mushrooms', 'Onions', 'Olives', 'Zucchini'],
    },
  ],
  breakfast: [
    {
      id: 'br1',
      name: 'Omelette Sandwich',
      basePrice: 350,
      emoji: '🍳',
      image: '/food/br1-omelette-sandwich.png',
      description: 'Fresh egg omelette in a toasted sandwich',
      ingredients: ['Fresh eggs', 'Toasted bread', 'Butter', 'Salt', 'Pepper', 'Cheese (optional)'],
    },
    {
      id: 'br2',
      name: 'Tuna Sandwich',
      basePrice: 400,
      emoji: '🥪',
      image: '/food/br2-tuna-sandwich.png',
      description: 'Premium tuna with fresh fillings',
      ingredients: ['Premium tuna', 'Mayonnaise', 'Lettuce', 'Tomato', 'Toasted bread'],
    },
    {
      id: 'br3',
      name: 'French Toast',
      basePrice: 350,
      emoji: '🍞',
      image: '/food/br3-french-toast.png',
      description: 'Golden crispy French toast — a morning classic',
      ingredients: ['Thick-cut bread', 'Eggs', 'Milk', 'Cinnamon', 'Vanilla', 'Powdered sugar', 'Maple syrup'],
    },
  ],
  desserts: [
    {
      id: 'd1',
      name: 'Chocolate Pizza',
      basePrice: 500,
      emoji: '🍫',
      image: '/food/d1-chocolate-pizza.png',
      popular: true,
      description: 'Dessert pizza loaded with Nutella & toppings',
      ingredients: ['Nutella base', 'Mozzarella', 'Banana', 'Strawberry', 'Chocolate drizzle', 'Powdered sugar'],
    },
    {
      id: 'd2',
      name: 'Waffle / Pancake',
      basePrice: 350,
      emoji: '🧇',
      image: '/food/d2-waffle-pancake.png',
      description: 'Fluffy waffle or pancake stack',
      ingredients: ['Flour', 'Eggs', 'Milk', 'Butter', 'Maple syrup', 'Fresh berries'],
    },
    {
      id: 'd3',
      name: 'Ice Cream',
      basePrice: 300,
      emoji: '🍦',
      image: '/food/d3-ice-cream.png',
      description: 'Creamy scoops in classic flavours',
      ingredients: ['Cream', 'Milk', 'Sugar', 'Vanilla — served in classic flavours'],
    },
    {
      id: 'd4',
      name: 'Nutella Ice Cream Sandwich',
      basePrice: 350,
      emoji: '🍪',
      image: '/food/d4-nutella-ice-cream.png',
      description: 'Nutella spread between ice cream layers',
      ingredients: ['Nutella', 'Ice cream scoops', 'Waffle cookies'],
    },
    {
      id: 'd5',
      name: 'Ice Coffee & Milkshake',
      basePrice: 200,
      emoji: '☕',
      image: '/food/d5-ice-coffee.png',
      description: 'Chilled coffee or blended milkshake',
      ingredients: ['Espresso or blended milk', 'Ice', 'Flavoured syrups'],
    },
    {
      id: 'd6',
      name: 'Soft Drinks',
      basePrice: 50,
      emoji: '🥤',
      image: '/food/d6-soft-drinks.png',
      description: 'Assorted chilled soft drinks',
      ingredients: ['Assorted chilled canned and bottled beverages'],
    },
  ],
}

export const TOPPINGS = ['🥑 Avocado', '🍄 Mushroom', '🧅 Onion', '🫑 Pepper', '🍅 Tomato', '🥓 Bacon']

export type CategoryKey = keyof MenuCategory

export const CATEGORIES = [
  { key: 'burgers' as CategoryKey, label: '🍔 Burgers' },
  { key: 'pizzas' as CategoryKey, label: '🍕 Pizzas' },
  { key: 'breakfast' as CategoryKey, label: '🍳 Breakfast' },
  { key: 'desserts' as CategoryKey, label: '🍫 Desserts & Drinks' },
]

// Flat array of all menu items for carousel
export const menuItems: MenuItem[] = [
  ...MENU.burgers,
  ...MENU.pizzas,
  ...MENU.breakfast,
  ...MENU.desserts,
]

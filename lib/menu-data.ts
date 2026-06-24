export interface MenuItem {
  id: string
  name: string
  price: number
  emoji: string
  popular?: boolean
  desc: string
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
      price: 600,
      emoji: '🍔',
      popular: true,
      desc: 'Beef patty with Canadian cheese & house sauces',
      ingredients: ['Beef patty', 'Canadian cheese', 'Lettuce', 'Tomato', 'Pickles', 'House special sauce', 'Brioche bun'],
    },
    {
      id: 'b2',
      name: 'Fried Chicken Burger',
      price: 800,
      emoji: '🍗',
      desc: 'Crispy fried chicken fillet with Canadian cheese',
      ingredients: ['Crispy fried chicken fillet', 'Canadian cheese', 'Lettuce', 'Coleslaw', 'Sriracha mayo', 'Brioche bun'],
    },
    {
      id: 'b3',
      name: 'Half Half Burger',
      price: 700,
      emoji: '🍔',
      desc: 'Best of both worlds — beef & chicken in one',
      ingredients: ['Beef patty', 'Fried chicken fillet', 'Canadian cheese', 'Lettuce', 'Tomato', 'House sauce', 'Brioche bun'],
    },
    {
      id: 'b4',
      name: 'Veggie Burger',
      price: 500,
      emoji: '🥗',
      desc: '100% plant-based with vegan mayo',
      ingredients: ['Plant-based patty', 'Vegan mayo', 'Lettuce', 'Tomato', 'Pickles', 'Mustard', 'Brioche bun'],
    },
    {
      id: 'b5',
      name: 'Double Beef Burger',
      price: 1000,
      emoji: '🍔',
      popular: true,
      desc: 'Double stacked beef patties — the real deal',
      ingredients: ['Double beef patties', 'Double Canadian cheese', 'Lettuce', 'Tomato', 'Pickles', 'House sauce', 'Brioche bun'],
    },
    {
      id: 'b6',
      name: 'Double Chicken Burger',
      price: 1000,
      emoji: '🍗',
      desc: 'Stacked double chicken with Canadian cheese',
      ingredients: ['Double fried chicken fillets', 'Canadian cheese', 'Lettuce', 'Coleslaw', 'Sriracha mayo', 'Brioche bun'],
    },
  ],
  pizzas: [
    {
      id: 'p1',
      name: 'L.C Special Pizza',
      price: 600,
      emoji: '🍕',
      popular: true,
      desc: 'Signature house pizza with veggie & chicken',
      ingredients: ['Tomato base', 'Mozzarella', 'Grilled chicken', 'Bell peppers', 'Onions', 'Mushrooms', 'House seasoning'],
    },
    {
      id: 'p2',
      name: 'BBQ Chicken Pizza',
      price: 600,
      emoji: '🍕',
      desc: 'Smoky BBQ base with grilled chicken & veggies',
      ingredients: ['BBQ sauce base', 'Mozzarella', 'Grilled chicken', 'Red onion', 'Corn', 'Cilantro'],
    },
    {
      id: 'p3',
      name: 'Steak Pizza',
      price: 700,
      emoji: '🍕',
      popular: true,
      desc: 'Tender meat with caramelized onions & mushrooms',
      ingredients: ['Tomato base', 'Mozzarella', 'Tender beef strips', 'Caramelized onions', 'Mushrooms', 'Garlic'],
    },
    {
      id: 'p4',
      name: 'Margarita Pizza',
      price: 500,
      emoji: '🍕',
      desc: 'Classic Italian simplicity at its finest',
      ingredients: ['San Marzano tomato base', 'Fresh mozzarella', 'Basil', 'Olive oil', 'Sea salt'],
    },
    {
      id: 'p5',
      name: 'Hawaiian Pizza',
      price: 600,
      emoji: '🍕',
      desc: 'Sweet meets savory with ham & pineapple',
      ingredients: ['Tomato base', 'Mozzarella', 'Smoked ham', 'Pineapple', 'Bell peppers'],
    },
    {
      id: 'p6',
      name: 'Veggie Pizza',
      price: 500,
      emoji: '🌿',
      desc: 'Fresh plant-based toppings on tomato base',
      ingredients: ['Tomato base', 'Mozzarella', 'Bell peppers', 'Mushrooms', 'Onions', 'Olives', 'Zucchini'],
    },
  ],
  breakfast: [
    {
      id: 'br1',
      name: 'Omelette Sandwich',
      price: 350,
      emoji: '🍳',
      desc: 'Fresh egg omelette in a toasted sandwich',
      ingredients: ['Fresh eggs', 'Toasted bread', 'Butter', 'Salt', 'Pepper', 'Cheese (optional)'],
    },
    {
      id: 'br2',
      name: 'Tuna Sandwich',
      price: 400,
      emoji: '🥪',
      desc: 'Premium tuna with fresh fillings',
      ingredients: ['Premium tuna', 'Mayonnaise', 'Lettuce', 'Tomato', 'Toasted bread'],
    },
    {
      id: 'br3',
      name: 'French Toast',
      price: 350,
      emoji: '🍞',
      desc: 'Golden crispy French toast — a morning classic',
      ingredients: ['Thick-cut bread', 'Eggs', 'Milk', 'Cinnamon', 'Vanilla', 'Powdered sugar', 'Maple syrup'],
    },
  ],
  desserts: [
    {
      id: 'd1',
      name: 'Chocolate Pizza',
      price: 500,
      emoji: '🍫',
      popular: true,
      desc: 'Dessert pizza loaded with Nutella & toppings',
      ingredients: ['Nutella base', 'Mozzarella', 'Banana', 'Strawberry', 'Chocolate drizzle', 'Powdered sugar'],
    },
    {
      id: 'd2',
      name: 'Waffle / Pancake',
      price: 350,
      emoji: '🧇',
      desc: 'Fluffy waffle or pancake stack',
      ingredients: ['Flour', 'Eggs', 'Milk', 'Butter', 'Maple syrup', 'Fresh berries'],
    },
    {
      id: 'd3',
      name: 'Ice Cream',
      price: 300,
      emoji: '🍦',
      desc: 'Creamy scoops in classic flavours',
      ingredients: ['Cream', 'Milk', 'Sugar', 'Vanilla — served in classic flavours'],
    },
    {
      id: 'd4',
      name: 'Nutella Ice Cream Sandwich',
      price: 350,
      emoji: '🍪',
      desc: 'Nutella spread between ice cream layers',
      ingredients: ['Nutella', 'Ice cream scoops', 'Waffle cookies'],
    },
    {
      id: 'd5',
      name: 'Ice Coffee & Milkshake',
      price: 200,
      emoji: '☕',
      desc: 'Chilled coffee or blended milkshake',
      ingredients: ['Espresso or blended milk', 'Ice', 'Flavoured syrups'],
    },
    {
      id: 'd6',
      name: 'Soft Drinks',
      price: 50,
      emoji: '🥤',
      desc: 'Assorted chilled soft drinks',
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

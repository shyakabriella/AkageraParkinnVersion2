import { Grape, Flame, Leaf, UtensilsCrossed, Fish, Wheat, IceCream } from 'lucide-react';
export const menu = [
    {
        icon: Grape,
        course: 'Breakfast',
        name: 'Full Breakfast',
        desc: 'Included with every room booking — continental, Full English/Irish, and Italian options available.',
        price: 'Included',
        tags: ['Included with rooms', 'Daily'],
    },
    {
        icon: Leaf,
        course: 'African',
        name: 'Rwandan Specialties',
        desc: 'Seasonal African dishes prepared with local ingredients and traditional flavours.',
        price: '—',
        tags: ['Local', 'Seasonal'],
    },
    {
        icon: Fish,
        course: 'American',
        name: 'American Classics',
        desc: 'Familiar favourites from the grill and kitchen, served in our restaurant and lounge.',
        price: '—',
        tags: ['Grill', 'Comfort food'],
    },
    {
        icon: Flame,
        course: 'Argentinian',
        name: 'Argentinian Grill',
        desc: 'Fire-grilled meats and bold flavours — a highlight of our international menu.',
        price: '—',
        tags: ['Grill', 'Signature'],
    },
    {
        icon: Wheat,
        course: 'Dietary',
        name: 'Vegetarian & Halal',
        desc: 'Vegetarian, dairy-free, and halal options available on request — just ask your server.',
        price: '—',
        tags: ['Vegetarian', 'Halal', 'Dairy-free'],
    },
    {
        icon: IceCream,
        course: 'Bar',
        name: 'Poolside Bar',
        desc: 'Cold drinks and cocktails in the lounge and by the pool after a day in the park.',
        price: '—',
        tags: ['Bar', 'Poolside'],
    },
    {
        icon: UtensilsCrossed,
        course: 'Services',
        name: 'Room Service',
        desc: 'Order from the restaurant menu to your room — available for hotel guests throughout the day.',
        price: '—',
        tags: ['Room service', 'All day'],
    },
];
export const diningPhilosophy = [
    {
        title: 'Breakfast included with every room',
        body: 'All room bookings include a full breakfast for registered guests — start each day well before heading into the park.',
    },
    {
        title: 'Three cuisines, one kitchen',
        body: 'Our restaurant serves African, American, and Argentinian dishes in a relaxed lounge atmosphere.',
    },
    {
        title: 'Dietary needs welcome',
        body: 'Vegetarian, dairy-free, and halal options are available on request. You can also book restaurant service without a room.',
    },
];

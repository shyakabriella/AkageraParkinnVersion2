import roomOne from '../Assets/room one.jpeg';
import roomTwo from '../Assets/room two.jpeg';
import loo from '../Assets/loo.png';
import p10 from '../Assets/p10.jpg';
import p9 from '../Assets/p9.jpg';
import p8 from '../Assets/p8.jpg';
import p1 from '../Assets/p1.jpg';
import p3 from '../Assets/p3.jpg';
export const suites = [
    {
        slug: 'twin-room',
        name: 'Twin Room',
        tagline: 'Buffalo & Elephant Room · Garden view',
        desc: 'Spacious 20 m² room inspired by the gentle giants of Akagera. Earthy tones, handcrafted wooden furniture, and a private balcony with nature views.',
        longDesc: 'Spacious, elegant, and inspired by the gentle giants of Akagera, our Buffalo & Elephant Room offers a calming retreat after a day of adventure. Designed with earthy tones, handcrafted wooden furniture, and thoughtful Rwandan decor, this room blends comfort with local charm. Enjoy a large bed, private bathroom, smart TV, high-speed Wi-Fi, and a private balcony with views of the surrounding nature. Perfect for couples or solo travelers seeking peace, space, and a touch of the wild.',

        per: 'per night',
        guests: 4,
        size: '20 m²',
        view: 'Garden',
        image: roomOne,
        gallery: [roomOne, loo, p10],
        amenities: [
            'Free Wi-Fi',
            'Smart TV',
            'Air Conditioning',
            'Private Balcony',
            'Mini Fridge',
            'Mountain View',
            'Room Service',
            'Breakfast included',
        ],
        featured: true,
    },
    {
        slug: 'double-room',
        name: 'Double Room',
        tagline: 'Courtyard view · Handcrafted comfort',
        desc: 'A 20 m² double room minutes from the park, with handcrafted wooden furnishings, hot shower, work desk, and garden or park views.',
        longDesc: 'Enjoy spacious comfort in our 20 m² Double Room, located just minutes from Akagera National Park. This inviting retreat is thoughtfully furnished with beautifully handcrafted wooden pieces and offers luxurious linens, a private bathroom featuring a refreshing hot shower, complimentary high-speed Wi-Fi, air conditioning and a ceiling fan, a dedicated work desk and a cozy seating area, and expansive windows providing abundant natural light and picturesque views of the garden or park.',

        per: 'per night',
        guests: 8,
        size: '20 m²',
        view: 'Courtyard',
        image: roomTwo,
        gallery: [roomTwo, loo, p9, p8, p1, p3],
        amenities: [
            'Free Wi-Fi',
            'Smart TV',
            'Air Conditioning',
            'Private Balcony',
            'Work Desk',
            'Room Service',
            'Mountain View',
            'Breakfast included',
        ],
        featured: false,
    },
];
export function getSuite(slug) {
    return suites.find((s) => s.slug === slug);
}

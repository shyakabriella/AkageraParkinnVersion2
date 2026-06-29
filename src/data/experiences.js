import p4 from '../Assets/p4.jpg';
import p5 from '../Assets/p5.jpg';
import laundry from '../Assets/laundry.png';
export const experiences = [
    {
        slug: 'restaurant-lounge',
        title: 'Restaurant & Lounge',
        duration: 'Daily',
        when: 'Breakfast, lunch & dinner',
        body: 'African, American, and Argentinian cuisine in a relaxed lounge setting — vegetarian, dairy-free, and halal options available.',
        longDesc: 'Our restaurant and lounge is the heart of Akagera Park Inn. Enjoy a full breakfast included with your room, then return for lunch and dinner featuring African, American, and Argentinian dishes. Dietary preferences are welcome — just let us know when you order.',
        image: p4,
        included: ['Full breakfast with rooms', 'Vegetarian options', 'Halal options', 'Room service', 'Bar service'],
    },
    {
        slug: 'outdoor-pool',
        title: 'Outdoor Pool & Garden',
        duration: 'All day',
        when: 'Year round',
        body: 'Unwind in our outdoor swimming pool with a comfortable poolside sitting area, surrounded by gardens and mountain views.',
        longDesc: 'Take a dip in our outdoor pool or relax in the comfortable poolside sitting area. The garden and terrace offer a calm setting to unwind after a day exploring Akagera National Park.',
        image: p5,
        included: ['Pool access', 'Garden & terrace', 'Poolside seating', 'Free for hotel guests'],
    },
    {
        slug: 'laundry-service',
        title: 'Laundry Service',
        duration: 'Same day',
        when: 'Daily',
        body: 'Fresh clothes when you need them — our laundry service keeps you comfortable throughout your stay.',
        longDesc: 'Travel light and stay fresh. Our laundry and dry-cleaning service is available to all guests and can be booked on its own or alongside a room reservation.',
        image: laundry,
        included: ['Laundry & dry cleaning', 'Room service pickup', 'Book without a room'],
    },
    {
        slug: 'bar-service',
        title: 'Bar & Drinks',
        duration: 'Evenings',
        when: 'Daily',
        body: 'Poolside bar and lounge drinks — unwind with a cold drink after a day in the park.',
        longDesc: 'Our bar serves refreshing drinks in the restaurant, lounge, and poolside areas. Combine with a restaurant booking or stop by on its own — no room reservation required.',
        image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1000',
        included: ['Poolside bar', 'Lounge service', 'Book without a room'],
    },
    {
        slug: 'airport-shuttle',
        title: 'Airport Shuttle',
        duration: '2.5 hrs',
        when: '24-hour service',
        body: 'Paid airport transfer from Kigali International Airport — available around the clock on request.',
        longDesc: 'Arrive stress-free with our 24-hour airport shuttle service from Kigali International Airport (79 km). Contact us when booking to arrange your pickup or drop-off.',
        image: 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=1000',
        included: ['24-hour availability', 'KGL airport transfers', 'Book on request'],
    },
];
export function getExperience(slug) {
    return experiences.find((e) => e.slug === slug);
}

export const site = {
    name: 'Akagera Park Inn',
    tagline: 'Near Akagera National Park • Calm stays • Pool & garden',
    subtitle: '',
    description: 'A peaceful  hotel in Akagera Village, minutes from Akagera National Park. Calm stays with an outdoor pool, garden, restaurant & lounge, and warm Rwandan hospitality.',
    address: '3MGF+4HF Akagera Village, Akagera, Rwanda',
    region: 'Eastern Province · Rwanda',
    phones: ['+250 788 471 880', '+250 793 842 491'],
    email: 'info@akageraparkinn.com',
    checkIn: '11:00',
    checkOut: '11:00',
    reception: '24-hour reception',
    roomCount: 12,
    bookingUrl: 'https://direct-book.com/properties/akageraparkinn',
    apiBase: 'https://api.akageraparkinn.com',
    social: {
        instagram: 'https://www.instagram.com/akageraparkinn?igsh=ZTZsMW1yeTQ0ODNi',
        tiktok: 'https://www.tiktok.com/@akagera.parkinn',
    },
    distances: {
        parkEntrance: '2–3 km to Akagera National Park South Entrance',
        kigaliAirport: '79 km from Kigali International Airport (KGL)',
        driveFromKigali: 'Approx. 2.5 hours from Kigali',
    },
};
export const storageUrl = (path) => `${site.apiBase}/storage/${path.replace(/^\//, '')}`;

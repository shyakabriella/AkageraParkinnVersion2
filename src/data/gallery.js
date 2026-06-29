import roomOne from '../Assets/room one.jpeg';
import roomTwo from '../Assets/room two.jpeg';
import p3 from '../Assets/p3.jpg';
import p4 from '../Assets/p4.jpg';
import p5 from '../Assets/p5.jpg';
import p6 from '../Assets/p6.jpg';
import p8 from '../Assets/p8.jpg';
import p9 from '../Assets/p9.jpg';
import p10 from '../Assets/p10.jpg';
import nightView from '../Assets/night view.avif';
export const galleryImages = [
    {
        src: roomOne,
        alt: 'Twin Room at Akagera Park Inn',
        category: 'Rooms',
        span: 'lg:col-span-2 lg:row-span-2',
    },
    {
        src: roomTwo,
        alt: 'Double Room at Akagera Park Inn',
        category: 'Rooms',
    },
    {
        src: p10,
        alt: 'Twin Room interior',
        category: 'Rooms',
    },
    {
        src: p9,
        alt: 'Double Room interior',
        category: 'Rooms',
    },
    {
        src: p8,
        alt: 'Room with mountain view',
        category: 'Rooms',
    },
    {
        src: p3,
        alt: 'Handcrafted wooden furnishings',
        category: 'Hotel',
    },
    {
        src: p4,
        alt: 'Restaurant and lounge',
        category: 'Dining',
    },
    {
        src: p8,
        alt: 'Dining at Akagera Park Inn',
        category: 'Dining',
        span: 'lg:col-span-2',
    },
    {
        src: nightView,
        alt: 'Private balcony with garden view',
        category: 'Hotel',
    },
    {
        src: p5,
        alt: 'Outdoor pool and garden',
        category: 'Pool',
    },
    {
        src: p6,
        alt: 'Poolside bar and lounge',
        category: 'Pool',
    },
];
export const galleryCategories = ['All', 'Rooms', 'Hotel', 'Pool', 'Dining'];

import exp1 from '../Assets/exp1.jpg';
import exp2 from '../Assets/exp2.jpg';
import exp3 from '../Assets/exp3.jpg';
import exp4 from '../Assets/exp4.jpg';

export const experiences = [
    {
        slug: 'cultural-experiences',
        title: 'Cultural Experiences',
        duration: 'START TIME: 07:00',
        when: 'END TIME: 20:00 • EVERY SUNDAY',
        body: 'Discover local traditions through guided cultural walks, village visits, and storytelling sessions that connect you with the heart of Akagera.',
        longDesc: 'Discover local traditions through guided cultural walks, village visits, and storytelling sessions that connect you with the heart of Akagera.',
        image: exp3,
        included: ['Guided cultural walks', 'Village visits', 'Storytelling sessions'],
    },
    {
        slug: 'evening-bonfire',
        title: 'Evening Bonfire & Stargazing',
        duration: 'START TIME: 18:00',
        when: 'END TIME: 00:00 • EVERY DAY',
        body: 'Relax by the bonfire under clear volcanic skies, enjoy music and good company, and soak in the peaceful night ambience.',
        longDesc: 'Relax by the bonfire under clear volcanic skies, enjoy music and good company, and soak in the peaceful night ambience.',
        image: exp2,
        included: ['Bonfire', 'Stargazing', 'Music'],
    },
    {
        slug: 'nature-trails',
        title: 'Nature Trails & Scenic Walks',
        duration: 'MORNING & AFTERNOON',
        when: 'DAILY',
        body: 'Stroll through lush greenery and scenic viewpoints around the Hotel, with gentle guided walks suitable for all ages.',
        longDesc: 'Stroll through lush greenery and scenic viewpoints around the Hotel, with gentle guided walks suitable for all ages.',
        image: exp1,
        included: ['Guided walks', 'Scenic viewpoints', 'Suitable for all ages'],
    },
    {
        slug: 'family-group',
        title: 'Family & Group Activities',
        duration: 'CUSTOM SCHEDULES',
        when: 'ON REQUEST',
        body: 'From small celebrations to team-building moments, we create tailored activities that bring families and friends together.',
        longDesc: 'From small celebrations to team-building moments, we create tailored activities that bring families and friends together.',
        image: exp4,
        included: ['Custom schedules', 'Team-building', 'Family activities'],
    },
];
export function getExperience(slug) {
    return experiences.find((e) => e.slug === slug);
}

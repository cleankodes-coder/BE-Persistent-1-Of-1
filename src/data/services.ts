import { ServiceDefinition } from '../types/cleaning';

export const BUSINESS_INFO = {
  name: 'Be Persistent 1of1 LTD',
  shortName: 'Be Persistent 1of1',
  website: 'https://www.bepersistent1of1.co.uk/',
  phoneDisplay: '+44 7376 739271',
  whatsappNumber: '447376739271',
  whatsappUrl: 'https://wa.me/447376739271',
  quoteEmail: 'quotes@bepersistent1of1.co.uk',
  generalEmail: 'Bepersistent1of1@gmail.com',
  coverage: 'Croydon & Greater London',
} as const;

export const HERO_IMAGE = '/src/assets/images/hero_cleaning_action_1795085462207.jpg';
export const DETAIL_CRAFT_IMAGE = '/src/assets/images/detail_cleaning_craft_1795085461493.jpg';
export const QUOTE_STUDIO_IMAGE = '/src/assets/images/quote_studio_backdrop_1795085462208.jpg';
export const WHY_CHOOSE_IMAGE = '/src/assets/images/why_choose_editorial_1795083760742.jpg';
export const CTA_BACKDROP_IMAGE = '/src/assets/images/cta_dark_interior_1795083760297.jpg';

export const SERVICES: ServiceDefinition[] = [
  {
    id: 'domestic',
    name: 'Domestic Cleaning',
    shortLabel: 'Domestic',
    description:
      'Consistent, respectful care for flats, townhouses, and family residences across Croydon and Greater London, tailored around your household routine.',
    highlights: [
      'Kitchens, bathrooms, living spaces & bedrooms',
      'One-off visits or regular weekly and fortnightly schedules',
      'Attention to floors, surfaces, fixtures & finishing touches',
    ],
    image: '/src/assets/images/service_domestic_1795083761288.jpg',
    imageAlt: 'Spotless modern London townhouse living and dining room with clean oak floors',
  },
  {
    id: 'deep',
    name: 'Deep Cleaning',
    shortLabel: 'Deep Clean',
    description:
      'A thorough top-to-bottom reset designed for properties that need intensive detailing across kitchens, bathrooms, skirting, and high-touch fittings.',
    highlights: [
      'Detailed degreasing, descaling & interior surface care',
      'Skirting boards, door frames, switches & tile grout focus',
      'Ideal ahead of seasonal refreshes or post-renovation settling',
    ],
    image: '/src/assets/images/service_deep_clean_1795083759489.jpg',
    imageAlt: 'Immaculate dark stone luxury kitchen countertop and brushed copper tapware',
  },
  {
    id: 'tenancy',
    name: 'End of Tenancy Cleaning',
    shortLabel: 'End of Tenancy',
    description:
      'Comprehensive move-out and move-in cleaning prepared to help tenants, landlords, and letting agents present properties cleanly at handover.',
    highlights: [
      'Full-property preparation including inside cupboards & fittings',
      'Oven, hob, extractor & bathroom sanitisation options',
      'Clear checklist alignment with move-out inspection needs',
    ],
    image: '/src/assets/images/service_tenancy_1795083761360.jpg',
    imageAlt: 'Unfurnished London apartment with freshly polished herringbone timber flooring ready for handover',
  },
  {
    id: 'airbnb',
    name: 'Airbnb Cleaning & Linen Change',
    shortLabel: 'Airbnb & Linen',
    description:
      'Reliable short-let turnovers between guest stays, combining methodical room resets with crisp linen presentation and check-in readiness.',
    highlights: [
      'Checkout-to-checkin turnaround coordination',
      'Bed making, towel staging & linen change options',
      'Surface reset, bathroom sanitisation & visual readiness check',
    ],
    image: '/src/assets/images/service_airbnb_1795083761067.jpg',
    imageAlt: 'Boutique London guest bedroom dressed with crisp ivory linen and folded towels',
  },
  {
    id: 'office',
    name: 'Office Cleaning',
    shortLabel: 'Office',
    description:
      'Discreet, dependable upkeep for studios, offices, and commercial workspaces so teams and visiting clients walk into a composed environment.',
    highlights: [
      'Workstations, meeting rooms, glass partitions & washrooms',
      'Kitchenette, breakout areas & waste bin servicing',
      'Flexible scheduling around business operating hours',
    ],
    image: '/src/assets/images/service_office_1795083760703.jpg',
    imageAlt: 'Clean modern London office boardroom with dark timber table and clear glass partitions',
  },
  {
    id: 'maintenance',
    name: 'Light Property Maintenance',
    shortLabel: 'Maintenance',
    description:
      'Practical day-to-day upkeep and minor non-structural property tasks alongside cleaning visits to keep homes and rentals well presented.',
    highlights: [
      'Minor fixture tightening, cabinet alignment & hardware checks',
      'Basic touch-ups, silicone tidy-ups & bulb replacements',
      'Convenient single-visit coordination with cleaning requests',
    ],
    image: '/src/assets/images/service_maintenance_1795083761466.jpg',
    imageAlt: 'Detailed residential joinery and brushed brass cabinetry hardware in a clean London hallway',
  },
];

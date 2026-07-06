export const site = {
  name: "Premier Eye Institute",
  legalName: "Premier Eye Institute, OD, PLLC",
  tagline: "Eye care, refined",
  doctor: "Dr. Nisha P. Mehta, OD",
  founded: 2014,
  phone: "919-734-2273",
  phoneHref: "tel:9197342273",
  phoneDisplay: "(919) 734-2273",
  fax: "919-238-4321",
  address: {
    street: "2531 E Lyon Station Rd, Suite F",
    city: "Creedmoor",
    state: "NC",
    zip: "27522",
  },
  addressLine: "2531 E Lyon Station Rd, Suite F, Creedmoor, NC 27522",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Premier+Eye+Institute+2531+E+Lyon+Station+Rd+Suite+F+Creedmoor+NC+27522",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=2531+E+Lyon+Station+Rd+Suite+F,+Creedmoor,+NC+27522&output=embed",
  portalUrl: "https://crystalpm.com",
  facebook: "https://facebook.com/PEIcareNC",
  twitter: "https://twitter.com/PEIcareNC",
  currentSite: "https://peicare.com",
} as const;

export const hours = [
  { day: "Monday", value: "8:00 am – 5:00 pm" },
  { day: "Tuesday", value: "8:00 am – 5:00 pm" },
  { day: "Wednesday", value: "8:00 am – 5:00 pm" },
  { day: "Thursday", value: "9:00 am – 6:00 pm" },
  { day: "Friday", value: "8:00 am – 3:00 pm" },
  { day: "Saturday", value: "By Appointment Only" },
  { day: "Sunday", value: "Closed" },
] as const;

export const hoursCompact = [
  { label: "Mon – Wed", value: "8:00a – 5:00p" },
  { label: "Thursday", value: "9:00a – 6:00p" },
  { label: "Friday", value: "8:00a – 3:00p" },
  { label: "Saturday", value: "By Appointment Only" },
  { label: "Sunday", value: "Closed" },
] as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  long: string;
  icon:
    | "eye"
    | "contact"
    | "moon"
    | "droplet"
    | "sparkles"
    | "monitor"
    | "activity"
    | "gauge"
    | "glasses"
    | "sun";
};

export const services: Service[] = [
  {
    slug: "eye-exams",
    title: "Eye & Vision Exams",
    short:
      "A full history review, vision and eye-health testing, and time to talk through anything we find.",
    long: "Every exam includes a patient history review, a full series of vision and eye tests, and an evaluation of your eye health — not just a quick read of the chart. If anything needs a closer look, we'll walk you through what additional testing means and why.",
    icon: "eye",
  },
  {
    slug: "contact-lenses",
    title: "Contact Lens Exams & Fittings",
    short:
      "Not sure contacts are for you? We'll walk you through every type and fit you for the one that matches your life.",
    long: "Contact lens options have come a long way: rigid gas-permeable, daily soft, extended-wear, disposable, and planned-replacement lenses all fit differently. We'll talk through them with you and land on the type that actually suits your eyes and your routine.",
    icon: "contact",
  },
  {
    slug: "lasik",
    title: "LASIK Co-Management",
    short:
      "Thinking about LASIK? We handle your pre-surgery evaluation and post-surgery care, close to home.",
    long: "LASIK corrects nearsightedness, farsightedness, and astigmatism as an alternative to glasses or contacts. We work alongside trusted surgeons — determining whether you're a good candidate, preparing you for surgery, and managing your follow-up care right here in Creedmoor.",
    icon: "sparkles",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export const team: TeamMember[] = [
  {
    name: "Dr. Nisha Mehta, OD",
    role: "Optometrist & Owner",
    bio: "Trained at Pennsylvania College of Optometry (2006), with a residency in eye disease at the Baltimore VA. Fellow of the American Academy of Optometry, former clinical assistant professor at UNC Chapel Hill, and holder of an MBA from East Carolina University. Dr. Mehta has also provided eye care on mission work in Guatemala.",
    photo: "/team/dr-mehta.webp",
  },
  {
    name: "Crystal",
    role: "Practice Operations",
    bio: "Runs the daily operations of the practice and keeps every visit running smoothly.",
  },
  {
    name: "Katie",
    role: "Optometric Technician",
    bio: "Handles preliminary testing and contact lens training, so you start every exam prepared.",
    photo: "/team/katie.webp",
  },
  {
    name: "Maddie",
    role: "Optical Specialist",
    bio: "Helps with frame selection, orders, and repairs — your guide through the optical.",
    photo: "/team/maddie.webp",
  },
  {
    name: "Amanda",
    role: "Front Desk & Scheduling",
    bio: "The friendly first face of the practice; keeps appointments and check-ins easy.",
  },
  {
    name: "Wendy",
    role: "Scheduling & Patient Questions",
    bio: "Answers patient questions and helps you find a time that works.",
  },
  {
    name: "Brianne",
    role: "Optical Specialist",
    bio: "Helps patients pick frames that fit their style, face, and prescription.",
  },
];

export const doctorCredentials = [
  "Doctor of Optometry, Pennsylvania College of Optometry (2006)",
  "Residency in ocular disease, Baltimore VA Medical Center",
  "Fellow of the American Academy of Optometry",
  "Former clinical assistant professor, UNC Chapel Hill",
  "MBA, East Carolina University",
  "Eye care mission work in Guatemala",
] as const;

/* Real Google reviews, lightly trimmed for readability where the source
   text was cut off mid-sentence. Only positive reviews are used here —
   the two critical reviews in the source batch were left out. */
export const testimonials = [
  {
    quote:
      "It was a wonderful experience. Dr. Mehta was so knowledgeable and was extremely thorough with helping me with my exam and concerns.",
    name: "Ashley Harrell",
    detail: "New patient, comprehensive exam",
  },
  {
    quote:
      "Love this Eye Dr!! The staff is just as professional and helpful — our whole family was checked and the doctor never rushes through an exam.",
    name: "Denise Green",
    detail: "Family exam",
  },
  {
    quote:
      "I have been seeing Dr. Mehta, Katie Womble and some of the other staff here for quite a few years now and I am always very impressed with the expertise, kindness, and true professionalism.",
    name: "Carolyn Peace",
    detail: "Long-time patient",
  },
  {
    quote:
      "I went in to get a prescription done for my glasses and they had the kindest people there. This one girl helped me pick out from a selection of glasses and it was all a very quick and easy process.",
    name: "Alejandro Casarrubias-Rauda",
    detail: "Prescription glasses",
  },
  {
    quote:
      "I was seen timely and treated like a friend who just stopped by for a visit. I was called by my first name by all the staff, and even the doctor greeted me by saying it was good to see me.",
    name: "Sherri Baker",
    detail: "General visit",
  },
  {
    quote:
      "I was very impressed with how thorough Dr. Mehta was in her exam. The staff were all very friendly and helpful. As I am getting older, I appreciate someone who is concerned with my eye health.",
    name: "Crystal Hart",
    detail: "Comprehensive exam",
  },
  {
    quote:
      "I can't share enough great things about this practice. Dr. Mehta is personable, knowledgeable, and actually listens to her patients. The staff are always friendly and helpful and make your experience top notch.",
    name: "Cathy Lefebvre",
    detail: "General practice",
  },
  {
    quote:
      "Dr. Mehta and her staff always take the time to answer your questions, ensure you understand the answers, and explain test results and eye care instructions. My husband, son, and I trust Premier Eye Care completely.",
    name: "Dale Lawrence",
    detail: "Family care",
  },
  {
    quote:
      "I have been going to PEI for years, I have had nothing but great experiences. Small town vibe, yet high quality patient care. A true diamond in the rough. Dr. Mehta is amazing.",
    name: "Jordan Boice",
    detail: "Long-time patient",
  },
] as const;

export const stats = [
  { value: 5000, suffix: "+", label: "Eyes examined" },
  { value: 10, suffix: "+", label: "Years in Creedmoor" },
  { value: 4.9, decimals: 1, label: "Average star rating" },
  { value: 100, suffix: "%", label: "Independent & local" },
] as const;

export const nav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Eyewear", href: "/eyewear" },
  { label: "Try It On", href: "/try-on" },
  { label: "Reviews", href: "/reviews" },
  { label: "Insurance", href: "/payments-insurance" },
  { label: "Contact", href: "/contact" },
] as const;

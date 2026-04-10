// lib/subjects.js

import { 
    BookOpen, 
    Atom, 
    Calculator, 
    Languages, 
    Code, 
    Music, 
    Palette, 
    Briefcase, 
    Trophy,
    Gamepad2,
    Users,
    Activity,
    Globe,
    GraduationCap
} from "lucide-react";

export const SUBJECT_CATEGORIES = [
    {
        id: "school_k5",
        name: "School (Pre-K to 5)",
        icon: Users,
        description: "Foundational learning and early development",
        subjects: ["All Subjects", "English", "Maths", "EVS", "Science", "Phonics", "Storytelling", "Handwriting", "Hindi", "General Knowledge"]
    },
    {
        id: "school_6_10",
        name: "Middle & High School (6-10)",
        icon: BookOpen,
        description: "Core academic excellence for secondary grades",
        subjects: ["Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Sanskrit", "Social Studies", "History", "Geography", "Civics", "Computers"]
    },
    {
        id: "school_11_12_sci",
        name: "Class 11-12 (Science)",
        icon: Atom,
        description: "Specialized streams for engineering and medical prep",
        subjects: ["Physics", "Chemistry", "Maths", "Biology", "Biotechnology", "Computer Science", "Informatics Practices", "Psychology", "Home Science", "Physical Education"]
    },
    {
        id: "school_11_12_comm",
        name: "Class 11-12 (Commerce)",
        icon: Briefcase,
        description: "Business and financial literacy focus",
        subjects: ["Accountancy", "Economics", "Business Studies", "Entrepreneurship", "Maths (Applied)", "Statistics"]
    },
    {
        id: "school_11_12_hum",
        name: "Class 11-12 (Humanities)",
        icon: Users,
        description: "Arts and social sciences specialization",
        subjects: ["History", "Geography", "Political Science", "Sociology", "Psychology", "Philosophy", "Legal Studies"]
    },
    {
        id: "college_uni",
        name: "College & University",
        icon: GraduationCap,
        description: "Higher education and professional degree modules",
        subjects: ["Engineering Maths", "Engineering Mechanics", "Programming (C/C++)", "Data Structures", "Financial Accounting", "Cost Accounting", "Management Accounting", "Business Law", "B.Sc Physics", "B.Sc Chemistry", "B.Sc Maths"]
    },
    {
        id: "exam_prep",
        name: "Competitive Exams",
        icon: Trophy,
        description: "Dedicated preparation for major Indian entrance tests",
        subjects: ["IIT JEE Mains", "IIT JEE Advanced", "NEET", "CLAT", "CAT", "UPSC (GS/CSAT)", "Banking (IBPS/SBI)", "SSC CGL", "RRB NTPC", "GATE", "CA Foundation", "CS Executive", "NTSE", "Olympiads"]
    },
    {
        id: "study_abroad",
        name: "Study Abroad",
        icon: Globe,
        description: "International aptitude and language tests",
        subjects: ["IELTS", "TOEFL", "PTE Academic", "GRE", "GMAT", "SAT", "Duolingo English Test"]
    },
    {
        id: "languages",
        name: "Languages",
        icon: Globe,
        description: "Native and international language proficiency",
        subjects: ["Spoken English", "French", "German", "Spanish", "Japanese", "Sanskrit", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Arabic"]
    },
    {
        id: "it_coding",
        name: "IT & Programming",
        icon: Code,
        description: "21st-century digital skills",
        subjects: ["Coding for Kids", "Python", "Java", "C++", "Web Development", "App Development", "Data Science", "Machine Learning", "Artificial Intelligence", "Digital Marketing", "Cyber Security"]
    },
    {
        id: "hobbies_arts",
        name: "Hobbies & Creative Arts",
        icon: Palette,
        description: "Unleash creativity beyond academics",
        subjects: ["Vocal Music (Hindustani)", "Vocal Music (Carnatic)", "Guitar", "Piano", "Keyboard", "Violin", "Flute", "Drawing", "Painting", "Classical Dance", "Western Dance", "Photography", "Chess", "Yoga", "Personal Training"]
    }
];

export const ALL_SUBJECTS = Array.from(new Set(
    SUBJECT_CATEGORIES.flatMap(cat => cat.subjects)
)).sort();

export const POPULAR_SUBJECTS = [
    { title: "Maths", icon: Calculator, category: "school_6_10" },
    { title: "Science", icon: Atom, category: "school_6_10" },
    { title: "English", icon: Globe, category: "school_6_10" },
    { title: "Physics", icon: Atom, category: "school_11_12_sci" },
    { title: "Chemistry", icon: Atom, category: "school_11_12_sci" },
    { title: "IIT JEE", icon: Trophy, category: "exam_prep" },
    { title: "NEET", icon: Activity, category: "exam_prep" },
    { title: "Coding", icon: Code, category: "it_coding" },
    { title: "Music", icon: Music, category: "hobbies_arts" }
];

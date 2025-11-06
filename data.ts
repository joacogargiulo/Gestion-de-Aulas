



import { Role, User, Classroom, Booking, ClassroomRequest, RequestStatus, Faculty } from './types';
// FIX: Import 'set' from submodule to resolve module export error.
import { addDays } from 'date-fns';
import set from 'date-fns/set';

const now = new Date();

export const MOCK_USERS: User[] = [
  { id: 1, email: 'docente@facultad.com', name: 'Dr. Juan Pérez', role: Role.DOCENTE, password: 'password123' },
  { id: 2, email: 'secretaria@facultad.com', name: 'Lic. Ana Gómez', role: Role.SECRETARIA, password: 'password123' },
  { id: 3, email: 'otrodocente@facultad.com', name: 'Ing. Maria Rodriguez', role: Role.DOCENTE, password: 'password123' },
];

export const MOCK_CLASSROOMS: Classroom[] = [
  // Block A - Engineering
  { id: 1, name: 'A1', capacity: 30, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 2, name: 'A2', capacity: 25, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  // FIX: Corrected typo from studentComputERS to studentComputers
  { id: 3, name: 'A3', capacity: 35, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 4, name: 'A4', capacity: 40, hasProjector: true, studentComputers: 1, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 5, name: 'A5', capacity: 30, hasProjector: false, studentComputers: 0, hasAirConditioning: false, faculty: Faculty.ENGINEERING },
  { id: 6, name: 'A6', capacity: 20, hasProjector: false, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 7, name: 'A7', capacity: 30, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 8, name: 'A8', capacity: 25, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 9, name: 'A9', capacity: 35, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 10, name: 'A10', capacity: 40, hasProjector: true, studentComputers: 1, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  // FIX: Corrected typo from ahasAirConditioning to hasAirConditioning
  { id: 11, name: 'A11', capacity: 30, hasProjector: false, studentComputers: 0, hasAirConditioning: false, faculty: Faculty.ENGINEERING },
  { id: 12, name: 'A12', capacity: 20, hasProjector: false, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  // Block B - Health Sciences
  { id: 13, name: 'B1', capacity: 50, hasProjector: true, studentComputers: 25, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 14, name: 'B2', capacity: 50, hasProjector: true, studentComputers: 25, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 15, name: 'B3', capacity: 20, hasProjector: false, studentComputers: 0, hasAirConditioning: false, faculty: Faculty.HEALTH_SCIENCES },
  { id: 16, name: 'B4', capacity: 30, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 17, name: 'B5', capacity: 30, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 18, name: 'B6', capacity: 25, hasProjector: false, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 19, name: 'B7', capacity: 50, hasProjector: true, studentComputers: 25, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 20, name: 'B8', capacity: 50, hasProjector: true, studentComputers: 25, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 21, name: 'B9', capacity: 20, hasProjector: false, studentComputers: 0, hasAirConditioning: false, faculty: Faculty.HEALTH_SCIENCES },
  { id: 22, name: 'B10', capacity: 30, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 23, name: 'B11', capacity: 30, hasProjector: true, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  { id: 24, name: 'B12', capacity: 25, hasProjector: false, studentComputers: 0, hasAirConditioning: true, faculty: Faculty.HEALTH_SCIENCES },
  // Laboratorios y aulas especiales de Ingeniería
  { id: 25, name: 'Auditorio', capacity: 100, hasProjector: true, studentComputers: 1, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 26, name: 'Lab. Informática 1', capacity: 30, hasProjector: true, studentComputers: 30, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 27, name: 'Lab. Informática 2', capacity: 30, hasProjector: true, studentComputers: 30, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 28, name: 'Lab. Informática 3', capacity: 30, hasProjector: true, studentComputers: 30, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 29, name: 'Lab. Informática 4', capacity: 30, hasProjector: true, studentComputers: 30, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 30, name: 'Lab. Física 1', capacity: 25, hasProjector: true, studentComputers: 1, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 31, name: 'Lab. Física 2', capacity: 25, hasProjector: true, studentComputers: 1, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
  { id: 32, name: 'Lab. Bioingeniería', capacity: 20, hasProjector: true, studentComputers: 1, hasAirConditioning: true, faculty: Faculty.ENGINEERING },
];

// Centralized time slots
export const TIME_SLOTS = [
    { label: '14:00 - 15:00', start: { h: 14, m: 0 }, end: { h: 15, m: 0 } },
    { label: '15:00 - 15:45', start: { h: 15, m: 0 }, end: { h: 15, m: 45 } },
    { label: '16:40 - 17:25', start: { h: 16, m: 40 }, end: { h: 17, m: 25 } },
    { label: '17:30 - 18:15', start: { h: 17, m: 30 }, end: { h: 18, m: 15 } },
    { label: '18:20 - 19:05', start: { h: 18, m: 20 }, end: { h: 19, m: 5 } },
    { label: '19:10 - 19:55', start: { h: 19, m: 10 }, end: { h: 19, m: 55 } },
    { label: '20:00 - 20:45', start: { h: 20, m: 0 }, end: { h: 20, m: 45 } },
    { label: '20:50 - 21:35', start: { h: 20, m: 50 }, end: { h: 21, m: 35 } },
];


const today = new Date();
// FIX: Replaced setHours and setMinutes with set
const todayAt1730 = set(today, { hours: 17, minutes: 30 });
const todayAt1815 = set(today, { hours: 18, minutes: 15 });

// Create bookings for today at 17:30 to match the user's image
// Available: A4 (id:4), A8 (id:8), B4 (id:16), B10 (id:22)
const availableClassroomIds = [4, 8, 16, 22];
const bookingsForDemo: Booking[] = [];
for (let i = 1; i <= 24; i++) {
    if (!availableClassroomIds.includes(i)) {
        bookingsForDemo.push({
            id: 100 + i, // unique ids
            classroomId: i,
            userId: (i % 2) === 0 ? 1 : 3, // assign to user 1 or 3
            subject: `Clase Ficticia ${i}`,
            career: i % 3 === 0 ? 'Ingeniería en Informática' : 'Medicina',
            startTime: todayAt1730,
            endTime: todayAt1815,
        });
    }
}

export const MOCK_BOOKINGS: Booking[] = [
  ...bookingsForDemo,
  // Add other random bookings to populate the schedule
  // FIX: Replaced setHours and setMinutes with set
  { id: 1, classroomId: 1, userId: 1, subject: 'Cálculo I', career: 'Ingeniería en Informática', startTime: set(now, { hours: 9, minutes: 0 }), endTime: set(now, { hours: 11, minutes: 0 }) },
  { id: 2, classroomId: 2, userId: 3, subject: 'Algoritmos', career: 'Ingeniería en Informática', startTime: set(now, { hours: 10, minutes: 0 }), endTime: set(now, { hours: 12, minutes: 0 }) },
  { id: 3, classroomId: 3, userId: 1, subject: 'Física I', career: 'Ingeniería Industrial', startTime: set(addDays(now, 1), { hours: 14, minutes: 0 }), endTime: set(addDays(now, 1), { hours: 16, minutes: 0 }) },
  { id: 4, classroomId: 5, userId: 3, subject: 'Programación Web', career: 'Ingeniería en Informática', startTime: set(addDays(now, -1), { hours: 16, minutes: 0 }), endTime: set(addDays(now, -1), { hours: 18, minutes: 0 }) },
];

export const MOCK_REQUESTS: ClassroomRequest[] = [
  // FIX: Replaced setHours and setMinutes with set
  { id: 1, userId: 1, subject: 'Matemática I', career: 'Ingeniería en Informática', startTime: set(addDays(now, 3), { hours: 18, minutes: 0 }), endTime: set(addDays(now, 3), { hours: 19, minutes: 0 }), reason: 'Preparación para parcial.', status: RequestStatus.PENDIENTE, requestedClassroomId: 4 },
  { id: 2, userId: 3, subject: 'Seminario de Tesis', career: 'Medicina', startTime: set(addDays(now, 4), { hours: 11, minutes: 0 }), endTime: set(addDays(now, 4), { hours: 13, minutes: 0 }), reason: 'Presentación de avances.', status: RequestStatus.PENDIENTE, requestedClassroomId: 16 },
  { id: 3, userId: 1, subject: 'Taller de Oratoria', career: 'Licenciatura en Diseño Gráfico', startTime: set(addDays(now, -2), { hours: 15, minutes: 0 }), endTime: set(addDays(now, -2), { hours: 17, minutes: 0 }), reason: 'Práctica grupal.', status: RequestStatus.APROBADA, assignedClassroomId: 4 },
  { id: 4, userId: 3, subject: 'Reunión de Cátedra', career: 'Medicina', startTime: set(addDays(now, -5), { hours: 9, minutes: 0 }), endTime: set(addDays(now, -5), { hours: 10, minutes: 0 }), reason: 'Planificación semestral.', status: RequestStatus.RECHAZADA },
];

export const MOCK_FACULTIES_CAREERS: { [key in Faculty]: string[] } = {
  [Faculty.HEALTH_SCIENCES]: [
    'Medicina',
    'Licenciatura en Nutrición',
    'Licenciatura en Gastronomía',
    'Licenciatura en Kinesiología y Fisiatría',
    'Licenciatura en Psicología',
    'Licenciatura en Terapia Ocupacional',
    'Licenciatura en Diagnóstico por Imágenes',
  ],
  [Faculty.ENGINEERING]: [
    'Bioingeniería',
    'Ingeniería Ambiental',
    'Ingeniería Industrial',
    'Ingeniería en Informática',
    'Ingeniería en Inteligencia Artificial',
    'Tecnicatura Universitaria en Automatización y Robótica',
    'Tecnicatura universitaria en Informática',
    'Tecnicatura universitaria en Desarrollo y Calidad de Software',
    'Licenciatura en Diseño de Interiores',
    'Licenciatura en Diseño Gráfico',
    'Licenciatura en Diseño Multimedial',
  ]
};

export const getFacultyByCareer = (careerName: string): Faculty | undefined => {
    for (const faculty in MOCK_FACULTIES_CAREERS) {
        if (MOCK_FACULTIES_CAREERS[faculty as Faculty].includes(careerName)) {
            return faculty as Faculty;
        }
    }
    return undefined;
};

export const MOCK_CAREERS: string[] = Object.values(MOCK_FACULTIES_CAREERS).flat();

export const MOCK_CAREER_SUBJECTS: { [key: string]: string[] } = {
  // === Ciencias de la Salud ===
  'Medicina': ['Introducción a la medicina', 'Aparato cardiovascular', 'Aparato respiratorio', 'Aparato digestivo', 'Aparato locomotor y piel', 'Sangre, sistema linfático e inmunología', 'Aparato urinario y medio interno', 'Reproducción y genética', 'Sistema endocrino, metabolismo y nutrición', 'Sistema nervioso y órganos de los sentidos', 'Optativas I', 'Enfermedades infecciosas y parasitarias', 'Diagnóstico por imágenes', 'Salud pública y medicina preventiva I', 'Farmacología I', 'Patología', 'Semiología', 'Optativas II', 'Medicina I (Clínica Médica)', 'Cirugía I', 'Tocoginecología', 'Pediatría', 'Salud pública y medicina preventiva II', 'Farmacología II', 'Optativas III', 'Medicina II (Clínica Médica)', 'Cirugía II', 'Salud mental', 'Medicina legal y toxicología', 'Bioética', 'Optativas IV', 'Clínica médica (Internado)', 'Cirugía (Internado)', 'Tocoginecología (Internado)', 'Pediatría (Internado)', 'Atención primaria de la salud (Internado)', 'Emergentología (Internado)'],
  'Licenciatura en Nutrición': ['Fundamentos de la Nutrición', 'Introducción a la Química', 'Fisiología', 'Anatomía', 'Bioestadística', 'Educación Nutricional', 'Formación Humanística I', 'Química Biológica', 'Técnica Dietética', 'Evaluación Nutricional', 'Microbiología y Bromatología', 'Formación Humanística II', 'Epidemiología Nutricional', 'Psicología de la Nutrición', 'Fisiopatología y Dietoterapia del Adulto', 'Nutrición Materno Infantil', 'Tecnología de los Alimentos', 'Salud Pública', 'Formación Humanística III', 'Seminario de Inglés I', 'Seminario de Informática', 'Fisiopatología y Dietoterapia del Niño', 'Administración de Servicios de Alimentación', 'Formulación y Evaluación de Proyectos', 'Formación Humanística IV', 'Seminario de Inglés II', 'Metodología de la Investigación', 'Marketing de Alimentos', 'Nutrición en el Deporte', 'Soporte Nutricional', 'Práctica Profesional Supervisada', 'Seminario Humanístico I', 'Seminario Humanístico II', 'Seminario de Nutrición I', 'Seminario de Nutrición II', 'Proyecto Final Integrador'],
  'Licenciatura en Gastronomía': ['Técnicas Culinarias I', 'Panadería y Pastelería', 'Enología', 'Gestión Gastronómica', 'Seguridad e Higiene Alimentaria'],
  'Licenciatura en Kinesiología y Fisiatría': ['Anatomía', 'Fisiología', 'Histología y Embriología', 'Biofísica', 'Biología Celular y Molecular', 'Química Biológica', 'Formación Humanística I', 'Biomecánica', 'Fisiología del Ejercicio', 'Semiopatología Médica', 'Semiopatología Quirúrgica', 'Técnicas Kinésicas I', 'Agentes Físicos I', 'Formación Humanística II', 'Farmacología', 'Diagnóstico por Imágenes', 'Kinefilaxia', 'Técnicas Kinésicas II', 'Agentes Físicos II', 'Evaluación y Tratamiento Kinésico en Ortopedia y Traumatología', 'Práctica Clínica I', 'Formación Humanística III', 'Evaluación y Tratamiento Kinésico en Neurología', 'Evaluación y Tratamiento Kinésico en Cardiología y Neumonología', 'Evaluación y Tratamiento Kinésico en Pediatría', 'Evaluación y Tratamiento Kinésico en Geriatría', 'Kinesiología Deportiva', 'Práctica Clínica II', 'Formación Humanística IV', 'Kinesiología Legal y Deontología', 'Salud Pública', 'Metodología de la Investigación', 'Psicomotricidad y Neurodesarrollo', 'Práctica Profesional Supervisada', 'Seminario Humanístico I', 'Seminario Humanístico II', 'Seminario de Kinesiología I', 'Seminario de Kinesiología II', 'Proyecto Final Integrador'],
  'Licenciatura en Psicología': ['Introducción a la Psicología', 'Neurofisiología', 'Psicología General', 'Filosofía', 'Antropología', 'Psicoestadística', 'Formación Humanística I', 'Psicología de la Personalidad', 'Psicología Evolutiva I', 'Psicología Social', 'Psicopatología I', 'Teoría Psicoanalítica', 'Formación Humanística II', 'Psicología Evolutiva II', 'Psicopatología II', 'Teoría Cognitiva', 'Teoría Sistémica', 'Técnicas de Exploración Psicológica I', 'Formación Humanística III', 'Psicología Clínica', 'Psicología Educacional', 'Psicología Laboral', 'Psicología Jurídica', 'Técnicas de Exploración Psicológica II', 'Práctica Pre-Profesional I', 'Formación Humanística IV', 'Psicodiagnóstico', 'Psicoterapia', 'Orientación Vocacional', 'Metodología de la Investigación', 'Ética y Deontología Profesional', 'Práctica Profesional Supervisada', 'Seminario Humanístico I', 'Seminario Humanístico II', 'Seminario de Psicología I', 'Seminario de Psicología II', 'Proyecto Final Integrador'],
  'Licenciatura en Terapia Ocupacional': ['Anatomía', 'Fisiología', 'Psicología General', 'Psicología Evolutiva I', 'Medios Terapéuticos I', 'Medios Terapéuticos II', 'Teoría de Terapia Ocupacional I', 'Sociología', 'Formación Humanística I', 'Optativa I', 'Biomecánica', 'Neurofisiología', 'Psicología Evolutiva II', 'Psicopatología I', 'Teoría de Terapia Ocupacional II', 'Técnicas de Evaluación en Terapia Ocupacional', 'Ortesis y Ayudas Técnicas', 'Formación Humanística II', 'Optativa II', 'Clínica Médica', 'Clínica Quirúrgica', 'Psicopatología II', 'Neurología', 'Terapia Ocupacional en Disfunciones Físicas I', 'Terapia Ocupacional en Salud Mental I', 'Práctica Clínica I', 'Formación Humanística III', 'Optativa III', 'Pediatría', 'Geriatría', 'Terapia Ocupacional en Disfunciones Físicas II', 'Terapia Ocupacional en Salud Mental II', 'Terapia Ocupacional Comunitaria', 'Práctica Clínica II', 'Formación Humanística IV', 'Optativa IV', 'Administración en Salud', 'Metodología de la Investigación', 'Ética y Deontología Profesional', 'Práctica Profesional Supervisada', 'Seminario Humanístico I', 'Seminario Humanístico II', 'Seminario de Terapia Ocupacional I', 'Seminario de Terapia Ocupacional II', 'Proyecto Final Integrador'],
  'Licenciatura en Diagnóstico por Imágenes': ['Técnicas Radiológicas', 'Tomografía Computada', 'Resonancia Magnética', 'Medicina Nuclear', 'Protección Radiológica'],

  // === Ingeniería ===
  'Bioingeniería': ['Formación Humanística I', 'Taller de Bioingeniería I', 'Matemática I', 'Química I (general e inorgánica)', 'Álgebra Lineal', 'Informática General', 'Matemática II', 'Química II (orgánica y biológica)', 'Física I', 'Sistemas de Representación', 'Idioma Inglés A1', 'Formación Humanística II', 'Taller de Bioingeniería II', 'Matemática III', 'Física II', 'Estructura de Datos y Programación', 'Biología Molecular y Celular', 'Matemática IV', 'Física III', 'Probabilidades y Estadística', 'Histología y Anatomía', 'Formación Humanística III', 'Taller de Bioingeniería III', 'Matemática V', 'Física IV', 'Métodos Numéricos', 'Electrotecnia', 'Fisiología', 'Señales y Sistemas', 'Biomateriales', 'Electrónica Analógica y Digital', 'Biomecánica', 'Fisiología Cuantitativa', 'Seminario de Electrónica Digital I', 'Bioinformática', 'Formación Humanística IV', 'Bioinstrumentación I', 'Biomedicina Estructural y Computacional', 'Análisis y Procesamiento de Señales', 'Sistemas de Control', 'Bioingeniería de Alimentos', 'Bioinstrumentación II', 'Procesamiento de Imágenes', 'Biosensores', 'Bioingeniería Industrial', 'Economía para Ingenieros', 'PPS-Práctica Profesional Supervisada', 'Bioprocesos', 'Proyecto Final Integrador', 'Ingeniería Clínica, Hospitalaria y de Rehabilitación', 'Ingeniería de Tejidos y Órgganos artificiales', 'Gestión Medioambiental', 'Seminario Humanístico I', 'Seminario Bioingeniería I', 'Legislación para Ingenieros', 'Organización Industrial', 'Higiene y Seguridad laboral', 'Seminario Humanístico II', 'Seminario Bioingeniería II'],
  'Ingeniería Ambiental': ['Matemática I', 'Física I', 'Química I', 'Álgebra I', 'Ecología I', 'Geología I', 'Química II', 'Álgebra II', 'Ecología II', 'Geología II', 'Formación Humanística I', 'Idioma Inglés A 1', 'Matemática II', 'Física II', 'Biología Aplicada', 'Edafología y Manejo de suelos', 'Ingeniería de Residuos Atmosféricos', 'Normativas Ambientales I', 'Sistemas de representación', 'Informática General', 'Formación Humanística II', 'Ingeniería de Residuos Sólidos', 'Probabilidad y Estadística', 'Mecánica de los Fluidos', 'Economía Ambiental', 'Higiene y Seguridad Laboral', 'Química Analítica Medioambiental', 'Normativas Ambientales II', 'Termodinámica', 'Formación Humanística III', 'Taller de Ingeniería Ambiental I', 'Ingeniería de Residuos Líquidos', 'Ecotoxicología y Epidemiología Ambiental', 'Impacto y Riesgo Ambiental', 'Ordenamiento Territorial', 'Procesos Industriales', 'Formulación y Evaluación de Proyectos', 'Organización Industrial y Empresarial', 'Métodos Instrumentales', 'Seminario Ambiental I', 'Formación Humanística IV', 'Hidrología', 'Gestión de Recursos Forestales', 'Sistemas Climáticos y Meteorología', 'Energía y Medio Ambiente', 'Seminario Humanístico I', 'Gestión Urbanística Medioambiental', 'Sistema de Georeferenciación y Teledetección Ambiental', 'Seminario Ambiental II', 'Seminario Humanístico II', 'Proyecto Final Integrador', 'Práctica Profesional Supervisada', 'Sistema de Georeferenciación'],
  'Ingeniería Industrial': ['Física I', 'Informática General', 'Máquinas y Equipos Industriales', 'Taller Integrador I', 'Matemática I', 'Álgebra I', 'Formación Humanística I-1', 'Matemática II', 'Álgebra II', 'Formación Humanística I-2', 'Seminario de Inglés', 'Física II', 'Estudio de los Materiales', 'Empresa y Contabilidad para Ingenieros', 'Sistemas de Representación', 'Gestión del Capital Humano', 'Química para Ingenieros', 'Taller Integrador II', 'Matemática III', 'Formación Humanística II-1', 'Matemática IV', 'Formación Humanística II-2', 'Seminario de Inglés II', 'Electrónica Industrial', 'Termodinámica', 'Mecánica de los Fluidos', 'Matemática Superior y Aplicada', 'Probabilidad y Estadística', 'Economía para Ingenieros', 'Investigación Operativa', 'Taller Integrador III', 'Formación Humanística III-1', 'Seminario de Análisis Numérico', 'Formación Humanística III-2', 'Edificios e Instalaciones Industriales', 'Producción Industrial', 'Costos Industriales', 'Procesos Industriales', 'Taller Integrador IV', 'Análisis de Datos para la Toma de Decisiones', 'Legislación Empresarial', 'Formación Humanística IV-1', 'Marketing e Investigación de Mercado', 'Seminario de Emprendedurismo', 'Finanzas y Evaluación de Proyectos', 'Seminario de Oratoria', 'Formación Humanística IV-2', 'PPS (Práctica Profesional Supervisada)', 'Procesos Industriales II', 'Proyecto Final', 'Formulación de Proyectos Industriales', 'Seminario Humanístico I', 'Seminario Medioambiental y de Higiene y Seguridad Laboral', 'Seminario de Nuevas Tecnologías', 'Seminario Humanístico II', 'Seminario de Logística'],
  'Ingeniería en Informática': ['Matemática I', 'Física I', 'Formación Humanística I', 'Álgebra I', 'Introducción a la Informática', 'Taller I', 'Idioma Extranjero I', 'Álgebra II', 'Programación I', 'Matemática II', 'Física II', 'Programación II', 'Formación Humanística II', 'Álgebra Discreta', 'Idioma Extranjero II', 'Estructura de Datos I', 'Taller II', 'Electrónica Básica', 'Estructuras de Datos II', 'Arquitectura de Computadores I', 'Formación Humanística III', 'Métodos Numéricos', 'Bases de Datos', 'Informática Teórica', 'Teoría de Sistemas y Modelos', 'Probabilidad y Estadística', 'Investigación Operativa', 'Programación III', 'Comunicación de Datos', 'Formación Humanística IV', 'Arquitectura de Computadores II', 'Sistemas de Información I', 'Ingeniería de Software I', 'Teleinformática I', 'Economía', 'Inteligencia Artificial', 'Sistemas Operativos', 'Compiladores y Trasladores', 'Teleinformática II', 'Evaluación y Formulación de Proyectos', 'Organización Empresarial e Industrial', 'Trabajo de Campo', 'Seminario Humanístico I', 'Gestión Ambiental', 'Evaluación y Selección de Equipos de Hardware', 'Sistemas de Información II', 'Ingeniería de Software II', 'Auditoría de Sistemas', 'Legislación', 'Seguridad de Sistemas', 'Seminario Humanístico II', 'Seminario de Informática I', 'Seminario de Informática II', 'Gestión de RRHH', 'Proyecto Final Integrador'],
  'Ingeniería en Inteligencia Artificial': ['Matemática I', 'Álgebra Lineal', 'Estructura de datos y programación 1', 'Formación Humanística I-1', 'Matemática II', 'Fundamentos de Inteligencia Artificial', 'Física I', 'Formación Humanística I-2', 'Sistemas de Representación', 'Estructura de datos y programación 2', 'Taller I', 'Matemática III', 'Física II', 'Sistemas Digitales', 'Formación Humanística II-1', 'Matemática IV', 'Física III', 'Probabilidades y Estadística', 'Formación Humanística II-2', 'Química General', 'Taller II', 'Arquitectura de computadores', 'Bases de datos', 'Métodos Numéricos', 'Formación Humanística III-1', 'Ingeniería de software 1', 'Fundamentos de Ciencia de Datos (Data Science)', 'Gestión de grandes datos (Big Data)', 'Ingeniería de software 2', 'Formación Humanística III-2', 'Taller III', 'Visión computacional', 'Redes Neuronales', 'Procesamiento del lenguaje natural', 'Formación Humanística IV-1', 'Bioinformática 1', 'Aprendizaje de máquina (Machine learning)', 'Aprendizaje por refuerzo', 'Ingeniería de características', 'Formación Humanística IV-2', 'Bioinformática 2', 'Taller IV', 'Fundamentos de economía y finanzas', 'Ciberseguridad', 'Seminario: Medioambiente, Higiene y Seguridad Laboral', 'Seminario Humanístico I', 'Seminario de Inteligencia Artificial I', 'Legislación', 'Organización empresarial', 'Seminario Humanístico II', 'Seminario de Inteligencia Artificial II', 'Proyecto Final Integrador', 'PPS (Práctica Profesional Supervisada)'],
  'Tecnicatura Universitaria en Automatización y Robótica': ['Control Automático', 'Robótica Industrial', 'Sistemas Embebidos', 'Neumática e Hidráulica', 'PLC'],
  'Tecnicatura universitaria en Informática': ['Introducción a la Programación', 'Arquitectura de Computadoras', 'Sistemas de Información', 'Taller de Programación', 'Redes Básicas'],
  'Tecnicatura universitaria en Desarrollo y Calidad de Software': ['Testing de Software', 'Metodologías Ágiles', 'Patrones de Diseño', 'Calidad de Software', 'Bases de Datos Aplicadas'],
  'Licenciatura en Diseño de Interiores': ['Diseño de Espacios Interiores', 'Historia del Mueble', 'Materiales y Tecnología', 'Iluminación', 'Dibujo Técnico Asistido'],
  'Licenciatura en Diseño Gráfico': ['Diseño Gráfico I', 'Tipografía', 'Diseño Editorial', 'Identidad Corporativa', 'Diseño Web y Mobile'],
  'Licenciatura en Diseño Multimedial': ['Diseño Web', 'Animación 2D y 3D', 'Edición de Video', 'Diseño de Experiencia de Usuario (UX)', 'Programación para Diseñadores'],
};
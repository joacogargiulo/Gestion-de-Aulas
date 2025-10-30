export enum Faculty {
  HEALTH_SCIENCES = 'Ciencias de la Salud',
  ENGINEERING = 'Ingeniería',
}

export enum Role {
  DOCENTE = 'docente',
  SECRETARIA = 'secretaria',
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  password: string;
}

export interface Classroom {
  id: number;
  name: string;
  capacity: number;
  hasProjector: boolean;
  studentComputers: number;
  hasAirConditioning: boolean;
  faculty: Faculty;
}

export enum RequestStatus {
  PENDIENTE = 'Pendiente',
  APROBADA = 'Aprobada',
  RECHAZADA = 'Rechazada',
}

export interface Booking {
  id: number;
  classroomId: number;
  userId: number; // The teacher's ID
  subject: string;
  career: string;
  startTime: Date;
  endTime: Date;
}

export interface ClassroomRequest {
  id: number;
  userId: number; // The teacher who requested it
  subject: string;
  career: string;
  startTime: Date;
  endTime: Date;
  reason: string;
  status: RequestStatus;
  requestedClassroomId?: number;
  assignedClassroomId?: number;
}
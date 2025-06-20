export interface MedicalDocument {
  id: string;
  title: string;
  type: 'lab_result' | 'prescription' | 'visit_summary' | 'imaging' | 'discharge_summary';
  date: string;
  doctor: string;
  department: string;
  status: 'normal' | 'abnormal' | 'pending' | 'critical';
  summary: string;
  content: string; // Full document content for RAG
  keyFindings?: string[];
  recommendations?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    documentId: string;
    documentTitle: string;
    relevantSection: string;
  }[];
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location: string;
  notes?: string;
}
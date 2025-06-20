import { ChatMessage, MedicalDocument } from '../types/medical';

// Mock AI service - in production, this would connect to OpenAI API with RAG
class AIService {
  private documents: MedicalDocument[] = [];

  setPatientDocuments(documents: MedicalDocument[]) {
    this.documents = documents;
  }

  async processQuery(query: string, conversationHistory: ChatMessage[]): Promise<{
    response: string;
    sources: { documentId: string; documentTitle: string; relevantSection: string; }[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock RAG implementation - in production, use vector embeddings and similarity search
    const relevantDocs = this.findRelevantDocuments(query);
    const response = this.generateResponse(query, relevantDocs, conversationHistory);

    return {
      response,
      sources: relevantDocs.map(doc => ({
        documentId: doc.id,
        documentTitle: doc.title,
        relevantSection: this.extractRelevantSection(doc, query)
      }))
    };
  }

  private findRelevantDocuments(query: string): MedicalDocument[] {
    const queryLower = query.toLowerCase();
    
    // Simple keyword matching - in production, use vector similarity
    return this.documents.filter(doc => {
      const searchText = `${doc.title} ${doc.content} ${doc.keyFindings?.join(' ')} ${doc.recommendations?.join(' ')}`.toLowerCase();
      
      // Check for common medical terms and document types
      if (queryLower.includes('lab') && doc.type === 'lab_result') return true;
      if (queryLower.includes('prescription') && doc.type === 'prescription') return true;
      if (queryLower.includes('visit') && doc.type === 'visit_summary') return true;
      if (queryLower.includes('vitamin d') && searchText.includes('vitamin d')) return true;
      if (queryLower.includes('blood pressure') && searchText.includes('blood pressure')) return true;
      if (queryLower.includes('cholesterol') && searchText.includes('cholesterol')) return true;
      if (queryLower.includes('recommendation') && doc.recommendations?.length) return true;
      
      return false;
    }).slice(0, 3); // Limit to top 3 relevant documents
  }

  private generateResponse(query: string, relevantDocs: MedicalDocument[], history: ChatMessage[]): string {
    if (relevantDocs.length === 0) {
      return "I don't have specific information about that in your medical records. Please consult with your healthcare provider for detailed medical advice.";
    }

    const queryLower = query.toLowerCase();

    // Generate contextual responses based on query type
    if (queryLower.includes('vitamin d')) {
      const labDoc = relevantDocs.find(doc => doc.type === 'lab_result');
      if (labDoc) {
        return `Based on your recent lab results from ${labDoc.date}, your vitamin D level was 28 ng/mL. Your doctor noted that this is in the insufficient range (normal is 30-100 ng/mL) and recommended vitamin D3 supplementation of 2000 IU daily. They also suggested increasing sun exposure and consuming vitamin D-rich foods.`;
      }
    }

    if (queryLower.includes('last visit') || queryLower.includes('recommendation')) {
      const visitDoc = relevantDocs.find(doc => doc.type === 'visit_summary');
      if (visitDoc) {
        return `From your last visit on ${visitDoc.date} with ${visitDoc.doctor}, the main recommendations were: ${visitDoc.recommendations?.join(', ')}. The visit summary noted: ${visitDoc.summary}`;
      }
    }

    if (queryLower.includes('blood pressure')) {
      return `Your recent blood pressure readings show an average of 142/88 mmHg, which is in the Stage 1 hypertension range. Your doctor recommended lifestyle modifications including reducing sodium intake to less than 2300mg daily, regular exercise (30 minutes, 5 days per week), and weight management. A follow-up appointment was scheduled to monitor your progress.`;
    }

    if (queryLower.includes('prescription') || queryLower.includes('medication')) {
      const prescDoc = relevantDocs.find(doc => doc.type === 'prescription');
      if (prescDoc) {
        return `Your current prescriptions include the medications listed in your ${prescDoc.date} prescription. Please take all medications as directed and contact your pharmacy or doctor if you have any questions about dosage or side effects.`;
      }
    }

    // Generic response with document context
    const docInfo = relevantDocs.map(doc => `${doc.title} (${doc.date})`).join(', ');
    return `Based on your medical records including ${docInfo}, I found relevant information. However, for specific medical advice and interpretation, please consult directly with your healthcare provider.`;
  }

  private extractRelevantSection(doc: MedicalDocument, query: string): string {
    // Extract the most relevant section from the document
    if (doc.keyFindings?.length) {
      return doc.keyFindings[0];
    }
    return doc.summary.substring(0, 100) + '...';
  }
}

export const aiService = new AIService();
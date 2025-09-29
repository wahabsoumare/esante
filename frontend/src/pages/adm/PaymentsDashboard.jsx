// PaymentsDashboard.jsx
import React, { useState, useEffect } from 'react';
import PaymentStats from '../../components/PaymentsStats';
import PendingPaymentsTable from '../../components/PendingPaymentsTable';
import ValidationHistory from '../../components/ValidationHistory';
import ValidationModal from '../../components/ValidationModal';

const PaymentsDashboard = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [validationHistory, setValidationHistory] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    pending: 12,
    validatedToday: 47,
    rejectedToday: 3,
    successRate: 98.5
  });

  // Données mockées (à remplacer par votre API)
  useEffect(() => {
    const mockPendingPayments = [
      {
        id: 'TX-2024-45871',
        patient: {
          name: 'Marie Koné',
          phone: '+225 07 45 32 18 76',
          avatar: 'MK'
        },
        doctor: {
          name: 'Dr. Aminata Diallo',
          specialty: 'Cardiologue'
        },
        amount: 15000,
        paymentMethod: 'orange',
        date: '20/11/2024 14:30',
        status: 'pending',
        proof: 'receipt_om_45871.pdf'
      },
      {
        id: 'TX-2024-48871',
        patient: {
          name: 'Astou Diouf',
          phone: '+221 77 231 22 11',
          avatar: 'AD'
        },
        doctor: {
          name: 'Dr. Francois Diouf',
          specialty: 'generaliste'
        },
        amount: 11000,
        paymentMethod: 'wave',
        date: '20/11/2024 14:30',
        status: 'pending',
        proof: 'receipt_om_45861.pdf'
      },
      {
        id: 'TX-2024-45872',
        patient: {
          name: 'Jean Traoré',
          phone: '+225 05 43 21 87 65',
          avatar: 'JT'
        },
        doctor: {
          name: 'Dr. Kouamé Daniel',
          specialty: 'Généraliste'
        },
        amount: 12000,
        paymentMethod: 'mtn',
        date: '20/11/2024 13:15',
        status: 'needs_verification',
        proof: 'receipt_mtn_45872.pdf'
      }
    ];

    const mockHistory = [
      {
        id: 'TX-2024-45870',
        patient: 'Amadou Sylla',
        amount: 18000,
        validatedBy: 'Admin National',
        date: '20/11/2024 15:22',
        status: 'validated',
        comment: 'Paiement confirmé via Wave'
      }
    ];

    setPendingPayments(mockPendingPayments);
    setValidationHistory(mockHistory);
  }, []);

  const handleValidatePayment = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleConfirmValidation = (comment = '') => {
    // API call to validate payment
    console.log('Validating payment:', selectedPayment.id, 'Comment:', comment);
    
    // Update local state
    setPendingPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
    setStats(prev => ({
      ...prev,
      pending: prev.pending - 1,
      validatedToday: prev.validatedToday + 1
    }));
    
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleRejectPayment = (comment = '') => {
    // API call to reject payment
    console.log('Rejecting payment:', selectedPayment.id, 'Reason:', comment);
    
    // Update local state
    setPendingPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
    setStats(prev => ({
      ...prev,
      pending: prev.pending - 1,
      rejectedToday: prev.rejectedToday + 1
    }));
    
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleValidateMultiple = (paymentIds) => {
    // API call to validate multiple payments
    console.log('Validating multiple payments:', paymentIds);
    
    setPendingPayments(prev => prev.filter(p => !paymentIds.includes(p.id)));
    setStats(prev => ({
      ...prev,
      pending: prev.pending - paymentIds.length,
      validatedToday: prev.validatedToday + paymentIds.length
    }));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <i className="fas fa-check-circle text-blue-600"></i>
          Validation des Paiements Patients
        </h1>
        <p className="text-gray-600">
          Supervision et validation manuelle des transactions - Plateforme Nationale eSanté
        </p>
      </div>

      {/* Statistics */}
      <PaymentStats stats={stats} />

      {/* Pending Payments Table */}
      <PendingPaymentsTable
        payments={pendingPayments}
        onValidatePayment={handleValidatePayment}
        onValidateMultiple={handleValidateMultiple}
      />

      {/* Validation History */}
      <ValidationHistory history={validationHistory} />

      {/* Validation Modal */}
      <ValidationModal
        isOpen={isModalOpen}
        payment={selectedPayment}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmValidation}
        onReject={handleRejectPayment}
      />
    </div>
  );
};

export default PaymentsDashboard;
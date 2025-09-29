// ValidationModal.jsx
import React, { useState } from 'react';

const ValidationModal = ({ isOpen, payment, onClose, onConfirm, onReject }) => {
  const [comment, setComment] = useState('');

  if (!isOpen || !payment) return null;

  const handleConfirm = () => {
    onConfirm(comment);
    setComment('');
  };

  const handleReject = () => {
    if (comment.trim() === '') {
      alert('Veuillez ajouter un commentaire pour expliquer le rejet.');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir rejeter ce paiement ?')) {
      onReject(comment);
      setComment('');
    }
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      orange: 'Orange Money',
      mtn: 'MTN Mobile Money',
      wave: 'Wave',
      card: 'Carte bancaire'
    };
    return methods[method] || 'Mobile Money';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Validation du paiement {payment.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Patient:</label>
              <p className="text-gray-900">{payment.patient.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Médecin:</label>
              <p className="text-gray-900">{payment.doctor.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Montant:</label>
              <p className="text-gray-900 font-bold">{payment.amount.toLocaleString()} FCFA</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Moyen de paiement:</label>
              <p className="text-gray-900">{getPaymentMethodLabel(payment.paymentMethod)}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Preuve de paiement:</label>
            <div className="mt-1">
              <button
                onClick={() => console.log('View proof:', payment.proof)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                <i className="fas fa-eye"></i>
                Voir le reçu de paiement
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire (optionnel) :
            </label>
            <textarea
              id="comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire sur cette validation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleReject}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center gap-2"
          >
            <i className="fas fa-times"></i>
            Rejeter le paiement
          </button>
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
          >
            <i className="fas fa-check"></i>
            Confirmer la validation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
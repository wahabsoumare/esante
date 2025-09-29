// PendingPaymentsTable.jsx
import React, { useState } from 'react';

const PendingPaymentsTable = ({ payments, onValidatePayment, onValidateMultiple }) => {
  const [selectedPayments, setSelectedPayments] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPayments(payments.map(p => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId, isSelected) => {
    if (isSelected) {
      setSelectedPayments(prev => [...prev, paymentId]);
    } else {
      setSelectedPayments(prev => prev.filter(id => id !== paymentId));
    }
  };

  const handleValidateSelected = () => {
    if (selectedPayments.length === 0) {
      alert('Veuillez sélectionner au moins un paiement à valider.');
      return;
    }
    
    if (confirm(`Valider ${selectedPayments.length} paiement(s) sélectionné(s) ?`)) {
      onValidateMultiple(selectedPayments);
      setSelectedPayments([]);
    }
  };

  const getPaymentMethodBadge = (method) => {
    const methods = {
      orange: { label: 'Orange Money', class: 'bg-orange-500 text-white' },
      mtn: { label: 'YAS', class: 'bg-yellow-300 text-blue-700 font-bold' },
      wave: { label: 'Wave', class: 'bg-blue-500 text-white' },
      card: { label: 'Carte bancaire', class: 'bg-gray-500 text-white' }
    };
    
    const methodInfo = methods[method] || methods.orange;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${methodInfo.class}`}>
        <i className="fas fa-mobile-alt mr-1"></i>
        {methodInfo.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800', icon: 'fa-clock' },
      needs_verification: { label: 'À vérifier', class: 'bg-orange-100 text-orange-800', icon: 'fa-exclamation-circle' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        <i className={`fas ${config.icon} mr-1`}></i>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <i className="fas fa-list-alt text-blue-600"></i>
          Paiements en attente de validation
        </h3>
        <div className="flex gap-3">
          <button
            onClick={handleValidateSelected}
            disabled={selectedPayments.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i className="fas fa-check-double"></i>
            Valider les sélectionnés ({selectedPayments.length})
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2">
            <i className="fas fa-sync-alt"></i>
            Actualiser
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedPayments.length === payments.length && payments.length > 0}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médecin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Moyen de paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preuve de paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr 
                key={payment.id}
                className={payment.status === 'needs_verification' ? 'bg-orange-50' : 'hover:bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={(e) => handleSelectPayment(payment.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {payment.patient.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.patient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.patient.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.doctor.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.doctor.specialty}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {payment.amount.toLocaleString()} FCFA
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPaymentMethodBadge(payment.paymentMethod)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => console.log('View proof:', payment.proof)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <i className="fas fa-receipt"></i>
                    Voir le reçu
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onValidatePayment(payment)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                    >
                      <i className="fas fa-check"></i>
                      Valider
                    </button>
                    <button
                      onClick={() => console.log('Contact patient:', payment.patient.phone)}
                      className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                    >
                      <i className="fas fa-phone"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-check-circle text-3xl text-green-500 mb-2"></i>
          <p>Aucun paiement en attente de validation</p>
        </div>
      )}
    </div>
  );
};

export default PendingPaymentsTable;
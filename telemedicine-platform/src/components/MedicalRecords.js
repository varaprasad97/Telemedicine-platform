import React, { useState } from 'react';
import { FaFileMedical, FaDownload, FaUpload, FaHistory, FaPrescriptionBottle, FaNotesMedical } from 'react-icons/fa';

const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState('history');

  // Mock medical records data
  const medicalRecords = {
    history: [
      {
        id: 1,
        date: '2024-03-15',
        doctor: 'Dr. Sarah Johnson',
        diagnosis: 'Common Cold',
        notes: 'Patient presented with symptoms of common cold. Prescribed rest and over-the-counter medication.',
        attachments: ['prescription.pdf', 'lab-results.pdf']
      },
      {
        id: 2,
        date: '2024-02-28',
        doctor: 'Dr. Michael Chen',
        diagnosis: 'Annual Check-up',
        notes: 'Regular health check-up. All vitals normal.',
        attachments: ['checkup-report.pdf']
      }
    ],
    prescriptions: [
      {
        id: 1,
        date: '2024-03-15',
        doctor: 'Dr. Sarah Johnson',
        medications: [
          {
            name: 'Acetaminophen',
            dosage: '500mg',
            frequency: 'Every 6 hours',
            duration: '5 days'
          },
          {
            name: 'Vitamin C',
            dosage: '1000mg',
            frequency: 'Once daily',
            duration: '7 days'
          }
        ]
      }
    ],
    labResults: [
      {
        id: 1,
        date: '2024-02-28',
        testName: 'Complete Blood Count',
        status: 'Normal',
        results: 'All parameters within normal range',
        attachments: ['cbc-report.pdf']
      },
      {
        id: 2,
        date: '2024-02-28',
        testName: 'Lipid Profile',
        status: 'Normal',
        results: 'Cholesterol levels within healthy range',
        attachments: ['lipid-report.pdf']
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Medical Records</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <FaHistory className="inline-block mr-2" />
              Medical History
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'prescriptions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('prescriptions')}
            >
              <FaPrescriptionBottle className="inline-block mr-2" />
              Prescriptions
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'labResults'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('labResults')}
            >
              <FaNotesMedical className="inline-block mr-2" />
              Lab Results
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'history' && (
            medicalRecords.history.map(record => (
              <div key={record.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{record.diagnosis}</h2>
                    <p className="text-gray-600">{record.doctor}</p>
                  </div>
                  <span className="text-gray-500">{record.date}</span>
                </div>
                <p className="text-gray-700 mb-4">{record.notes}</p>
                {record.attachments && (
                  <div className="flex space-x-2">
                    {record.attachments.map((file, index) => (
                      <button
                        key={index}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FaFileMedical className="mr-1" />
                        {file}
                        <FaDownload className="ml-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {activeTab === 'prescriptions' && (
            medicalRecords.prescriptions.map(prescription => (
              <div key={prescription.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Prescription</h2>
                    <p className="text-gray-600">{prescription.doctor}</p>
                  </div>
                  <span className="text-gray-500">{prescription.date}</span>
                </div>
                <div className="space-y-4">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800">{med.name}</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dosage:</span> {med.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span> {med.frequency}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {med.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {activeTab === 'labResults' && (
            medicalRecords.labResults.map(result => (
              <div key={result.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{result.testName}</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      result.status === 'Normal'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <span className="text-gray-500">{result.date}</span>
                </div>
                <p className="text-gray-700 mb-4">{result.results}</p>
                {result.attachments && (
                  <div className="flex space-x-2">
                    {result.attachments.map((file, index) => (
                      <button
                        key={index}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FaFileMedical className="mr-1" />
                        {file}
                        <FaDownload className="ml-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-6 text-center">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto hover:bg-blue-600 transition-colors">
            <FaUpload className="mr-2" />
            Upload Medical Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords; 
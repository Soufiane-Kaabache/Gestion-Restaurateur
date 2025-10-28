'use client';

import { toast, alert } from '@/lib/sweetalert';

export default function TestAlertsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Test SweetAlert2</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Toasts (Notifications)</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toast.success('Opération réussie !')}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Toast Success
          </button>
          <button
            onClick={() => toast.error('Erreur survenue')}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Toast Error
          </button>
          <button
            onClick={() => toast.info('Information importante')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Toast Info
          </button>
          <button
            onClick={() => toast.warning('Attention !')}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Toast Warning
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Alertes (Modales)</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => alert.success('Bravo !', 'Action effectuée avec succès')}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Alert Success
          </button>
          <button
            onClick={() => alert.error('Erreur', 'Impossible de traiter la requête')}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Alert Error
          </button>
          <button
            onClick={async () => {
              const result = await alert.confirm(
                'Êtes-vous sûr ?',
                'Cette action nécessite confirmation',
              );
              if (result.isConfirmed) toast.success('Confirmé !');
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={async () => {
              const result = await alert.confirmDelete('Menu Pizza');
              if (result.isConfirmed) toast.success('Supprimé !');
            }}
            className="px-4 py-2 bg-red-700 text-white rounded"
          >
            Confirm Delete
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Formulaires</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              const result = await alert.form({
                title: 'Ajouter un menu',
                inputs: [
                  { id: 'name', label: 'Nom du menu', required: true },
                  { id: 'price', label: 'Prix (€)', type: 'number', required: true },
                  { id: 'description', label: 'Description', type: 'textarea' },
                ],
              });
              if (result.isConfirmed) {
                console.log('Données formulaire:', result.value);
                toast.success('Menu ajouté !');
              }
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Formulaire
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Loading</h2>
        <button
          onClick={async () => {
            alert.loading('Chargement en cours...');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            alert.close();
            toast.success('Terminé !');
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Test Loading
        </button>
      </section>
    </div>
  );
}

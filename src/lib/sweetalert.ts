import Swal from 'sweetalert2';

const defaultOptions = {
  confirmButtonColor: '#FF6B35',
  cancelButtonColor: '#2C3E50',
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster',
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster',
  },
  backdrop: 'rgba(0, 0, 0, 0.4)',
  customClass: {
    popup: 'rounded-2xl shadow-2xl',
    title: 'text-2xl font-bold',
    htmlContainer: 'text-gray-600',
    confirmButton: 'px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform',
    cancelButton: 'px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform',
  },
};

export const toast = {
  success: (message: string) => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'bg-green-50 border-l-4 border-green-500',
      },
    });
  },

  error: (message: string) => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      customClass: {
        popup: 'bg-red-50 border-l-4 border-red-500',
      },
    });
  },

  info: (message: string) => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'bg-blue-50 border-l-4 border-blue-500',
      },
    });
  },

  warning: (message: string) => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: message,
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      customClass: {
        popup: 'bg-yellow-50 border-l-4 border-yellow-500',
      },
    });
  },
};

export const alert = {
  success: (title: string, message?: string) => {
    return Swal.fire({
      ...defaultOptions,
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'OK',
    });
  },

  error: (title: string, message?: string) => {
    return Swal.fire({
      ...defaultOptions,
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'OK',
    });
  },

  info: (title: string, message?: string) => {
    return Swal.fire({
      ...defaultOptions,
      icon: 'info',
      title,
      text: message,
      confirmButtonText: 'OK',
    });
  },

  warning: (title: string, message?: string) => {
    return Swal.fire({
      ...defaultOptions,
      icon: 'warning',
      title,
      text: message,
      confirmButtonText: 'OK',
    });
  },

  confirmDelete: async (itemName: string) => {
    return Swal.fire({
      ...defaultOptions,
      icon: 'warning',
      title: 'Confirmer la suppression',
      html: `Voulez-vous vraiment supprimer <strong>${itemName}</strong> ?<br><span class="text-sm text-gray-500">Cette action est irréversible.</span>`,
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#EF4444',
    });
  },

  confirm: async (title: string, message?: string) => {
    return Swal.fire({
      ...defaultOptions,
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    });
  },

  loading: (message: string = 'Chargement...') => {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  close: () => {
    Swal.close();
  },

  form: async (config: {
    title: string;
    inputs: Array<{
      id: string;
      label: string;
      type?: 'text' | 'email' | 'number' | 'textarea';
      placeholder?: string;
      required?: boolean;
      value?: string;
    }>;
  }) => {
    const htmlContent = config.inputs
      .map(
        (input) => `
      <div class="mb-4 text-left">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ${input.label}${input.required ? ' <span class="text-red-500">*</span>' : ''}
        </label>
        ${
          input.type === 'textarea'
            ? `<textarea id="swal-input-${input.id}" class="swal2-input w-full" placeholder="${input.placeholder || ''}" ${input.required ? 'required' : ''}>${input.value || ''}</textarea>`
            : `<input type="${input.type || 'text'}" id="swal-input-${input.id}" class="swal2-input w-full" placeholder="${input.placeholder || ''}" value="${input.value || ''}" ${input.required ? 'required' : ''}>`
        }
      </div>
    `,
      )
      .join('');

    return Swal.fire({
      ...defaultOptions,
      title: config.title,
      html: htmlContent,
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
      focusConfirm: false,
      preConfirm: () => {
        const values: any = {};
        config.inputs.forEach((input) => {
          const element = document.getElementById(`swal-input-${input.id}`) as HTMLInputElement;
          if (input.required && !element.value) {
            Swal.showValidationMessage(`Le champ "${input.label}" est requis`);
            return false;
          }
          values[input.id] = element.value;
        });
        return values;
      },
    });
  },
};

export default Swal;

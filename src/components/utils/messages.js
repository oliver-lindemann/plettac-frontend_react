import Swal from "sweetalert2"

const DEFAULT_TIMER_DURATION = 1500;

export const showSuccessToast = (message) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCloseButton: true,
        timer: DEFAULT_TIMER_DURATION,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: message
    })
}

export const showNotification = (message) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCloseButton: true,
    })

    Toast.fire({
        icon: 'info',
        title: message
    })
}

export const openNumberInputDialog = (message, part) => {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: message,
            allowEnterKey: true,
            showCancelButton: true,
            cancelButtonText: 'Abbrechen',
            html: `<input type="number" min="1" step="1"
                class="swal2-input" id="swalInput">`,
            didOpen: () => {
                Swal.getHtmlContainer().querySelector('#swalInput').focus();
                Swal.getHtmlContainer().addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                })
            }
        }).then(result => {

            if (result.isConfirmed) {
                // Vom Benutzer eingegebene Zahl lesen und, sofern > 0, als benötigte Anzahl 
                // für das ausgewählte Bauteil verwenden.
                let inputValue = Math.round(Swal.getHtmlContainer().querySelector('#swalInput').value);
                return resolve(inputValue);
            }
            else {
                return resolve(0);
            }
        }).catch(err => reject(err));
    });
}
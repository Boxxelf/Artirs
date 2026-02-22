import { useState, useCallback } from 'react';
import Alert from '../components/Modal/Alert';

export function useAlert() {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    details: null,
    onConfirm: null,
  });

  const showAlert = useCallback(({ type = 'info', title, message, details, onConfirm }) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message,
      details,
      onConfirm,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const AlertComponent = () => (
    <Alert
      isOpen={alertState.isOpen}
      onClose={closeAlert}
      type={alertState.type}
      title={alertState.title}
      message={alertState.message}
      details={alertState.details}
      onConfirm={alertState.onConfirm}
    />
  );

  return { showAlert, AlertComponent };
}

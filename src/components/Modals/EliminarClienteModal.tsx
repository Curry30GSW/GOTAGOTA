import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { TrashBinIcon } from '../../icons';
import { Cliente } from '../../types/cliente';

interface EliminarClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedCliente: Cliente | null;
}

export default function EliminarClienteModal({
    isOpen,
    onClose,
    onConfirm,
    selectedCliente
}: EliminarClienteModalProps) {
    if (!selectedCliente) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20">
                    <TrashBinIcon className="w-8 h-8" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                    Confirmar Eliminación
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    ¿Estás seguro de que deseas eliminar al cliente{' '}
                    <span className="font-medium text-gray-800 dark:text-white/90">
                        {selectedCliente.nombre} {selectedCliente.apellidos}
                    </span>
                    ?
                </p>
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    Esta acción no se puede deshacer y eliminará todos sus créditos asociados.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Eliminar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
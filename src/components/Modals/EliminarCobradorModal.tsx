import { Modal } from '../../components/ui/modal';
import Button from '../../components/ui/button/Button';
import { TrashBinIcon } from '../../icons';
import { Cobrador } from '../../types/cobrador';

interface EliminarCobradorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedCobrador: Cobrador | null;
}

export default function EliminarCobradorModal({
    isOpen,
    onClose,
    onConfirm,
    selectedCobrador
}: EliminarCobradorModalProps) {
    if (!selectedCobrador) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20">
                    <TrashBinIcon className="w-8 h-8" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                    Confirmar Desactivación
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    ¿Estás seguro de que deseas desactivar al cobrador{' '}
                    <span className="font-medium text-gray-800 dark:text-white/90">
                        {selectedCobrador.nombre} {selectedCobrador.apellidos}
                    </span>
                    ?
                </p>
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    Una vez desactivado, el cobrador no podrá ser asignado a nuevos deudores, pero los deudores existentes seguirán asociados a él.
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
                        Desactivar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
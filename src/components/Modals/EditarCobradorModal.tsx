import { Modal } from '../../components/ui/modal';
import Button from '../../components/ui/button/Button';
import { InputGroup } from '../../components/form/group-input';
import { Cobrador, CobradorFormData } from '../../types/cobrador';

interface EditarCobradorModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: CobradorFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    selectedCobrador: Cobrador | null;
    formErrors?: Partial<CobradorFormData>;
}

export default function EditarCobradorModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSubmit,
    selectedCobrador,
    formErrors = {}
}: EditarCobradorModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                Editar Cobrador: {selectedCobrador?.nombre} {selectedCobrador?.apellidos}
            </h2>
            <form onSubmit={onSubmit}>
                <div className="space-y-4">
                    <InputGroup
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={onChange}
                        required
                        placeholder="Ingrese el nombre"
                        error={formErrors.nombre}
                    />
                    <InputGroup
                        label="Apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={onChange}
                        required
                        placeholder="Ingrese los apellidos"
                        error={formErrors.apellidos}
                    />
                    <InputGroup
                        label="Cédula"
                        name="cedula"
                        value={formData.cedula}
                        onChange={onChange}
                        required
                        placeholder="Ingrese la cédula (solo números)"
                        error={formErrors.cedula}
                    />
                    <InputGroup
                        label="Celular"
                        name="celular"
                        value={formData.celular}
                        onChange={onChange}
                        required
                        type="tel"
                        placeholder="Ingrese el celular (solo números)"
                        error={formErrors.celular}
                    />
                    <InputGroup
                        label="Dirección"
                        name="direccion"
                        value={formData.direccion}
                        onChange={onChange}
                        placeholder="Ingrese la dirección (opcional)"
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Actualizar Cobrador
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
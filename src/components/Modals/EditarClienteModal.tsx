import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { InputGroup } from '../form/group-input';
import { Cliente, ClienteFormData } from '../../types/cliente';
import { UserIcon } from '../../icons';

interface EditarClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: ClienteFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    selectedCliente: Cliente | null;
    formErrors?: Partial<ClienteFormData>;
    cobradores: { id_cobrador: number; nombre: string; apellidos: string }[];
}

export default function EditarClienteModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSelectChange,
    onSubmit,
    selectedCliente,
    formErrors = {},
    cobradores
}: EditarClienteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                Editar Cliente: {selectedCliente?.nombre} {selectedCliente?.apellidos}
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
                        icon={<UserIcon className="w-5 h-5" />}
                    />
                    <InputGroup
                        label="Apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={onChange}
                        required
                        placeholder="Ingrese los apellidos"
                        error={formErrors.apellidos}
                        icon={<UserIcon className="w-5 h-5" />}
                    />
                    <InputGroup
                        label="Cédula"
                        name="cedula"
                        value={formData.cedula}
                        onChange={onChange}
                        required
                        type="text"
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

                    {/* Selector de Cobrador */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Cobrador Asignado <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800">
                            </span>
                            <select
                                name="id_cobrador"
                                value={formData.id_cobrador}
                                onChange={onSelectChange}
                                required
                                className="w-full rounded-lg border border-gray-300 bg-transparent pl-[62px] pr-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                            >
                                <option value="">Seleccione un cobrador</option>
                                {cobradores.map(c => (
                                    <option key={c.id_cobrador} value={c.id_cobrador}>
                                        {c.nombre} {c.apellidos}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {formErrors.id_cobrador && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.id_cobrador}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Actualizar Cliente
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
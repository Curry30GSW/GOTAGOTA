import { ChevronLeftIcon, ArrowRightIcon } from '../../icons';

interface PaginacionProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function Paginacion({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}: PaginacionProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generar números de página para mostrar
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push(-1); // Separador
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push(-1);
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push(-1);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push(-1);
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando <span className="font-medium text-gray-700 dark:text-gray-300">{startItem}</span> -{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">{endItem}</span>{' '}
                de <span className="font-medium text-gray-700 dark:text-gray-300">{totalItems}</span> resultados
            </div>

            <div className="flex items-center gap-2">
                {/* Botón anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium ${currentPage === 1
                            ? 'cursor-not-allowed opacity-50'
                            : 'text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
                        }`}
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                        page === -1 ? (
                            <span key={`separator-${index}`} className="px-2 text-gray-400">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`min-w-[36px] rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${currentPage === page
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                {/* Botón siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium ${currentPage === totalPages
                            ? 'cursor-not-allowed opacity-50'
                            : 'text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
                        }`}
                >
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
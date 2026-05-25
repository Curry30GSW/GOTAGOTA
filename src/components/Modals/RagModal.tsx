import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { apiFetch } from '../utils/api';

interface RagModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type StatusType = 'idle' | 'success' | 'error' | 'info';

interface KnowledgeItem {
    document_name?: string;
    source?: string;
    chunk_index?: number;
    content?: string;
}

interface QueryResponse {
    answer?: string;
    sources?: KnowledgeItem[];
    chunks?: KnowledgeItem[];
    rows?: KnowledgeItem[];
    message?: string;
    error?: string;
}

export default function RagModal({ isOpen, onClose }: RagModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentName, setDocumentName] = useState('');
    const [source, setSource] = useState('');
    const [question, setQuestion] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loadingDefault, setLoadingDefault] = useState(false);
    const [querying, setQuerying] = useState(false);
    const [status, setStatus] = useState<{ type: StatusType; message: string }>({
        type: 'idle',
        message: ''
    });
    const [queryResult, setQueryResult] = useState<QueryResponse | null>(null);

    const resetForm = () => {
        setSelectedFile(null);
        setDocumentName('');
        setSource('');
        setQuestion('');
        setStatus({ type: 'idle', message: '' });
        setQueryResult(null);
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const statusClasses = useMemo(() => {
        switch (status.type) {
            case 'success':
                return 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-300';
            case 'error':
                return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300';
            case 'info':
                return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-300';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300';
        }
    }, [status]);

    const parseResponse = async (response: Response) => {
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data?.message || data?.error || 'Ocurrió un error al procesar la solicitud');
        }

        return data as QueryResponse;
    };

    const handleUploadDocument = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFile) {
            setStatus({ type: 'error', message: 'Selecciona un archivo PDF, TXT o DOCX para continuar.' });
            return;
        }

        setUploading(true);
        setStatus({ type: 'info', message: 'Subiendo el documento al índice de conocimiento...' });

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('documentName', documentName || selectedFile.name);
            formData.append('source', source || 'manual');

            const response = await apiFetch('/knowledge/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await parseResponse(response);

            setStatus({
                type: 'success',
                message: `Documento cargado correctamente. ${data?.message || `Se indexaron ${selectedFile.name}.`}`
            });
            setSelectedFile(null);
            setDocumentName('');
            setSource('');
        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'No se pudo subir el documento.'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleLoadDefault = async () => {
        setLoadingDefault(true);
        setStatus({ type: 'info', message: 'Cargando el documento base de conocimiento...' });

        try {
            const response = await apiFetch('/knowledge/load-default', {
                method: 'POST'
            });

            const data = await parseResponse(response);

            setStatus({
                type: 'success',
                message: data?.message || 'Documento base cargado correctamente.'
            });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'No se pudo cargar el documento base.'
            });
        } finally {
            setLoadingDefault(false);
        }
    };

    const handleQuery = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!question.trim()) {
            setStatus({ type: 'error', message: 'Escribe una pregunta para consultar el RAG.' });
            return;
        }

        setQuerying(true);
        setStatus({ type: 'info', message: 'Consultando la base de conocimiento...' });
        setQueryResult(null);

        try {
            const response = await apiFetch('/knowledge/query', {
                method: 'POST',
                body: JSON.stringify({ question })
            });

            const data = await parseResponse(response);
            setQueryResult(data);

            const answer = data.answer || data?.message;
            const sources = data.sources || data.chunks || data.rows || [];

            if (answer) {
                setStatus({
                    type: 'success',
                    message: 'Respuesta obtenida correctamente.'
                });
            } else if (sources.length > 0) {
                setStatus({
                    type: 'success',
                    message: 'Se recuperaron los mejores fragmentos relevantes.'
                });
            } else {
                setStatus({
                    type: 'info',
                    message: 'La consulta no devolvió contenido útil. Revisa la pregunta o agrega más documentos.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'No se pudo consultar el RAG.'
            });
        } finally {
            setQuerying(false);
        }
    };

    const answer = queryResult?.answer || queryResult?.message;
    const sources = queryResult?.sources || queryResult?.chunks || queryResult?.rows || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
                            RAG
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                            Gestión de conocimiento
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Sube documentos, recarga el contenido base y consulta la IA con la información indexada en tu sede.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        aria-label="Cerrar modal"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {status.message && (
                    <div className={`rounded-lg border px-4 py-3 text-sm ${statusClasses}`}>
                        {status.message}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Subir documento
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Selecciona un archivo y lo indexará para consultas posteriores.
                        </p>

                        <form onSubmit={handleUploadDocument} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Archivo
                                </label>
                                <input
                                    type="file"
                                    onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                                    className="block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 file:dark:bg-brand-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nombre del documento
                                </label>
                                <input
                                    type="text"
                                    value={documentName}
                                    onChange={(event) => setDocumentName(event.target.value)}
                                    placeholder="Ej: política de pagos"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fuente
                                </label>
                                <input
                                    type="text"
                                    value={source}
                                    onChange={(event) => setSource(event.target.value)}
                                    placeholder="Ej: manual de cobranza"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full justify-center"
                                disabled={uploading}
                            >
                                {uploading ? 'Subiendo...' : 'Subir documento'}
                            </Button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Cargar documento base
                            </h4>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Inserta el archivo local de conocimiento predeterminado para esta sede.
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4 w-full justify-center"
                                onClick={handleLoadDefault}
                                disabled={loadingDefault}
                            >
                                {loadingDefault ? 'Cargando...' : 'Cargar documento base'}
                            </Button>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Consultar RAG
                            </h4>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Haz preguntas sobre la información que has subido a la base de conocimiento.
                            </p>

                            <form onSubmit={handleQuery} className="mt-4 space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Pregunta
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={question}
                                        onChange={(event) => setQuestion(event.target.value)}
                                        placeholder="¿Qué debo hacer si un cliente no paga a tiempo?"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full justify-center"
                                    disabled={querying}
                                >
                                    {querying ? 'Consultando...' : 'Consultar'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Resultado de la consulta
                            </h4>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Aquí verás la respuesta generada y las fuentes recuperadas.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        {answer ? (
                            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-100">
                                {answer}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                La respuesta aparecerá aquí una vez realices una consulta.
                            </div>
                        )}

                        {sources.length > 0 ? (
                            <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Fuentes recuperadas</h5>
                                {sources.map((item, index) => (
                                    <div
                                        key={`${item.document_name || 'doc'}-${item.chunk_index ?? index}`}
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200"
                                    >
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold text-gray-700 dark:text-gray-200">
                                                {item.document_name || 'Documento'}
                                            </span>
                                            {item.source ? <span>• {item.source}</span> : null}
                                            {typeof item.chunk_index === 'number' ? <span>• chunk {item.chunk_index + 1}</span> : null}
                                        </div>
                                        {item.content ? (
                                            <p className="mt-2 whitespace-pre-wrap leading-6">
                                                {item.content}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

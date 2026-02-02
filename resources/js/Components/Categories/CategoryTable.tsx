import { Category } from '@/types';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

export default function CategoryTable({
    categories,
    onEdit,
    onDelete,
}: CategoryTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Nombre</th>
                        <th className="px-4 py-3 font-semibold">Descripción</th>
                        <th className="px-4 py-3 font-semibold">Color</th>
                        <th className="px-4 py-3 font-semibold">Estado</th>
                        <th className="px-4 py-3 font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-3 text-center text-gray-500"
                            >
                                No hay categorías registradas
                            </td>
                        </tr>
                    ) : (
                        categories.map((category) => (
                            <tr
                                key={category.id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {category.name}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {category.description || '-'}
                                </td>
                                <td className="px-4 py-3">
                                    {category.color ? (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded border border-gray-300"
                                                style={{
                                                    backgroundColor:
                                                        category.color,
                                                }}
                                            />
                                            <span className="text-xs">
                                                {category.color}
                                            </span>
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
                                            category.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {category.active
                                            ? 'Activa'
                                            : 'Inactiva'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <SecondaryButton
                                            onClick={() =>
                                                onEdit(category)
                                            }
                                        >
                                            Editar
                                        </SecondaryButton>
                                        <DangerButton
                                            onClick={() =>
                                                onDelete(category.id)
                                            }
                                        >
                                            Eliminar
                                        </DangerButton>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

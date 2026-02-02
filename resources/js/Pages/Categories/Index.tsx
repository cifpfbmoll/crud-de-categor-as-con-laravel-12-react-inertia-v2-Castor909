import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Category, PageProps, CategoriesPageProps } from '@/types';
import CategoryTable from '@/Components/Categories/CategoryTable';
import CategoryModal from '@/Components/Categories/CategoryModal';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({
    auth,
    categories,
}: PageProps<CategoriesPageProps>) {
    const [data, setData] = useState<Category[]>(categories);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );

    useEffect(() => {
        setData(categories);
    }, [categories]);

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            router.delete(`/categories/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setData((prev) => prev.filter((c) => c.id !== id));
                },
            });
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Gestión de Categorías
                    </h2>
                    <PrimaryButton
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        + Nueva Categoría
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Categorías" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <CategoryTable
                            categories={data}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>

            <CategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(category) =>
                    setData((prev) => [category, ...prev])
                }
                mode="create"
            />

            <CategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={(updated) =>
                    setData((prev) =>
                        prev.map((c) =>
                            c.id === updated.id ? updated : c
                        )
                    )
                }
                mode="edit"
                category={selectedCategory}
            />
        </AuthenticatedLayout>
    );
}

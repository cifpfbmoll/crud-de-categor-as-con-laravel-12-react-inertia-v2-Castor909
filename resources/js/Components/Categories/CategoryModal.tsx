import { useState, useEffect, FormEventHandler } from 'react';
import { Category } from '@/types';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (category: Category) => void;
    mode: 'create' | 'edit';
    category?: Category | null;
}

interface FormData {
    name: string;
    description: string;
    color: string;
    active: boolean;
}

interface FormErrors {
    name?: string;
    description?: string;
    color?: string;
    active?: string;
}

export default function CategoryModal({
    isOpen,
    onClose,
    onSuccess,
    mode,
    category,
}: CategoryModalProps) {
    const initialFormData: FormData = {
        name: '',
        description: '',
        color: '',
        active: true,
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                color: category.color || '',
                active: category.active,
            });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [mode, category, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }

        if (
            formData.color &&
            !/^#[0-9A-F]{6}$/i.test(formData.color)
        ) {
            newErrors.color =
                'El color debe estar en formato hexadecimal (#RRGGBB)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setProcessing(true);

        try {
            const url =
                mode === 'create'
                    ? '/categories'
                    : `/categories/${category?.id}`;

            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>(
                        'meta[name="csrf-token"]'
                    )?.content || '',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.errors) {
                    setErrors(data.errors);
                }
                return;
            }

            const data = await response.json();
            onSuccess(data.category);
            setFormData(initialFormData);
            onClose();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-4">
                    {mode === 'create'
                        ? 'Nueva Categoría'
                        : 'Editar Categoría'}
                </h3>

                {/* Nombre */}
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />
                    <TextInput
                        id="name"
                        type="text"
                        className="mt-1 block w-full"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            })
                        }
                        placeholder="Ej: Electrónica"
                    />
                    <InputError
                        message={errors.name}
                        className="mt-2"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <InputLabel
                        htmlFor="description"
                        value="Descripción"
                    />
                    <textarea
                        id="description"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        placeholder="Descripción opcional"
                        rows={3}
                    />
                    <InputError
                        message={errors.description}
                        className="mt-2"
                    />
                </div>

                {/* Color */}
                <div>
                    <InputLabel htmlFor="color" value="Color (Hex)" />
                    <div className="flex gap-2 mt-1">
                        <TextInput
                            id="color"
                            type="text"
                            className="block flex-1"
                            value={formData.color}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    color: e.target.value,
                                })
                            }
                            placeholder="#FF5733"
                        />
                        {formData.color && /^#[0-9A-F]{6}$/i.test(formData.color) && (
                            <div
                                className="w-12 h-12 rounded border-2 border-gray-300"
                                style={{
                                    backgroundColor: formData.color,
                                }}
                            />
                        )}
                    </div>
                    <InputError
                        message={errors.color}
                        className="mt-2"
                    />
                </div>

                {/* Estado */}
                <div>
                    <InputLabel htmlFor="active" value="Estado" />
                    <select
                        id="active"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={formData.active ? '1' : '0'}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                active: e.target.value === '1',
                            })
                        }
                    >
                        <option value="1">Activa</option>
                        <option value="0">Inactiva</option>
                    </select>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2 mt-6">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {mode === 'create' ? 'Crear' : 'Actualizar'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

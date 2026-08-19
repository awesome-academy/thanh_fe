'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tour } from '@/types';
import { tourFormSchema, TourFormValues, TourFormInput } from '@/lib/tour-schema';
import { useCreateTour, useUpdateTour, AdminTourError } from '@/hooks/use-admin-tours';
import { useDestinations } from '@/hooks/use-destinations';
import { useCategories } from '@/hooks/use-categories';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { applyServerFieldErrors } from '@/components/admin/tour-form-field';
import TourFormFields from '@/components/admin/tour-form-fields';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface TourFormModalProps {
  /** null → create mode; a tour → edit mode. */
  tour: Tour | null;
  onClose: () => void;
}

export default function TourFormModal({ tour, onClose }: TourFormModalProps) {
  const isEdit = Boolean(tour);
  const modalRef = useFocusTrap<HTMLDivElement>();
  const { data: destinations } = useDestinations();
  const { data: categories } = useCategories();

  const createTour = useCreateTour();
  const updateTour = useUpdateTour();
  const mutation = isEdit ? updateTour : createTour;
  const isPending = mutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<TourFormInput, unknown, TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      name: tour?.name ?? '',
      description: tour?.description ?? '',
      dest: tour?.dest ?? '',
      type: tour?.type ?? '',
      days: tour?.days ?? 1,
      price: tour?.price ?? 100000,
      kidPrice: tour?.kidPrice ?? 0,
      // One blank row on create so the field is visible without clicking "add".
      images: tour?.images ?? [''],
      highlights: tour?.highlights ?? [],
      included: tour?.included ?? [],
      excludes: tour?.excludes ?? [],
    },
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, isPending]);

  const onSubmit = (values: TourFormValues) => {
    const onError = (err: AdminTourError) =>
      applyServerFieldErrors<TourFormInput>(setError, err.fields);

    if (isEdit && tour) {
      updateTour.mutate({ id: tour.id, values }, { onSuccess: onClose, onError });
    } else {
      createTour.mutate(values, { onSuccess: onClose, onError });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-form-title"
        className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-borderSubtle sticky top-0 bg-surface-card">
          <h2 id="tour-form-title" className="text-base font-bold text-textStrong">
            {isEdit ? 'Sửa tour' : 'Thêm tour mới'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-textSubtle hover:text-textStrong hover:bg-borderSubtle transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-5 space-y-4">
          {/* Field-level 422s are shown inline by setError; only surface
              non-field failures in the banner so nothing reports twice. */}
          {mutation.isError && !mutation.error?.fields && (
            <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{mutation.error?.message}</span>
            </div>
          )}

          <TourFormFields
            register={register}
            control={control}
            errors={errors}
            destinations={destinations}
            categories={categories}
            disabled={isPending}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-textSubtle hover:text-textStrong border border-borderSubtle rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-cacao-600 hover:bg-cacao-700 rounded-xl transition-colors disabled:opacity-70 cursor-pointer"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isPending ? 'Đang lưu...' : 'Lưu tour'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

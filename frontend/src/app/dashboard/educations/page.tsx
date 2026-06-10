'use client';

import { useEducations, EducationData } from '@/features/educations/hooks/use-educations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  GraduationCap, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  Loader2, 
  BookOpen 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { apiClient } from '@/lib/api-client';

const educationSchema = zod.object({
  institution: zod.string().min(1, 'A instituição ou emissor é obrigatória.').max(255),
  course: zod.string().min(1, 'O curso, certificação ou graduação é obrigatório.').max(255),
  start_date: zod.string().min(1, 'Data de início é obrigatória.'),
  end_date: zod.string().nullable().optional(),
  is_current: zod.boolean(),
  technologies: zod.array(zod.string()),
});

type EducationFormValues = zod.infer<typeof educationSchema>;

export default function EducationsPage() {
  const { educations, isLoading, createEducation, updateEducation, deleteEducation } = useEducations();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationData | null>(null);

  // Catálogo de tecnologias e busca interna do formulário
  const [allTechnologies, setAllTechnologies] = useState<any[]>([]);
  const [techQuery, setTechQuery] = useState('');

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      course: '',
      start_date: '',
      end_date: '',
      is_current: false,
      technologies: [],
    }
  });

  const isCurrentValue = watch('is_current');
  const selectedTechIds = watch('technologies') || [];

  // Carrega catálogo de tecnologias no mount
  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const response = await apiClient.get('/technologies');
        setAllTechnologies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Erro ao carregar catálogo de tecnologias:', err);
      }
    };
    loadTechnologies();
  }, []);

  const openAddDialog = () => {
    setEditingEducation(null);
    setTechQuery('');
    reset({
      institution: '',
      course: '',
      start_date: '',
      end_date: '',
      is_current: false,
      technologies: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (edu: EducationData) => {
    setEditingEducation(edu);
    setTechQuery('');
    reset({
      institution: edu.institution,
      course: edu.course,
      start_date: edu.start_date ? new Date(edu.start_date).toISOString().split('T')[0] : '',
      end_date: edu.end_date ? new Date(edu.end_date).toISOString().split('T')[0] : '',
      is_current: edu.is_current,
      technologies: edu.technologies ? edu.technologies.map((t: any) => t.id) : [],
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: EducationFormValues) => {
    try {
      const payload = {
        ...values,
        end_date: values.is_current ? null : (values.end_date || null),
      } as any;

      if (editingEducation) {
        await updateEducation({ id: editingEducation.id, data: payload });
        toast.success('Formação/curso atualizado com sucesso!');
      } else {
        await createEducation(payload);
        toast.success('Formação/curso adicionado com sucesso!');
      }
      setDialogOpen(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar formação/curso.';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza de que deseja remover esta formação/curso?')) {
      try {
        await deleteEducation(id);
        toast.success('Removido com sucesso!');
      } catch (error: any) {
        toast.error('Erro ao remover.');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-850">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Formações, Cursos & Certificações</h1>
          <p className="text-sm text-neutral-500">Gerencie suas graduações, cursos técnicos, bootcamps e certificações obtidas.</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Formação / Curso
        </Button>
      </div>

      {educations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/10 text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-300">Nenhuma formação ou curso cadastrado</h3>
          <p className="text-sm text-neutral-500 max-w-sm">Adicione suas graduações acadêmicas, bootcamps ou certificações relevantes.</p>
          <Button
            onClick={openAddDialog}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer py-2 px-4 rounded-lg text-xs"
          >
            Adicionar Formação / Curso
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <Card key={edu.id} className="bg-white dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850 hover:border-violet-500/15 dark:hover:border-violet-500/10 transition-all duration-300 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 flex-shrink-0 text-violet-600 dark:text-violet-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{edu.course}</CardTitle>
                    <CardDescription className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                       {edu.institution}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-750">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(edu.start_date)} - {edu.is_current ? 'Em andamento' : formatDate(edu.end_date || '')}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditDialog(edu)}
                      className="p-1.5 text-neutral-500 hover:text-violet-650 dark:hover:text-violet-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                      title="Editar Formação"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(edu.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-650 dark:hover:text-red-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                      title="Remover Formação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              
              {edu.technologies && edu.technologies.length > 0 && (
                <CardContent className="pt-0 border-t border-neutral-100 dark:border-neutral-850/50 mt-3 py-4 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {edu.technologies.map((tech: any) => (
                      <span key={tech.id} className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-450 text-[10px] font-mono border border-neutral-250 dark:border-neutral-800">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 text-neutral-850 dark:text-neutral-200 max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">{editingEducation ? 'Editar Formação / Curso' : 'Adicionar Formação / Curso'}</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-455">Insira os dados do seu curso, graduação ou certificação e tecnologias associadas.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Curso */}
              <div className="space-y-1.5">
                <Label htmlFor="course" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Curso / Graduação / Certificação</Label>
                <Input
                  id="course"
                  {...register('course')}
                  placeholder="Ex: Ciência da Computação, Bootcamp React, AWS Architect..."
                  className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                />
                {errors.course && (
                  <p className="text-xs text-red-500 mt-1">{errors.course.message}</p>
                )}
              </div>

              {/* Instituição */}
              <div className="space-y-1.5">
                <Label htmlFor="institution" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Instituição de Ensino / Emissor</Label>
                <Input
                  id="institution"
                  {...register('institution')}
                  placeholder="Ex: USP, Udemy, Coursera, Rocketseat..."
                  className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                />
                {errors.institution && (
                  <p className="text-xs text-red-500 mt-1">{errors.institution.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Data Início */}
              <div className="space-y-1.5">
                <Label htmlFor="start_date" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Data de Início</Label>
                <Input
                  type="date"
                  id="start_date"
                  {...register('start_date')}
                  className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                />
                {errors.start_date && (
                  <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>
                )}
              </div>

              {/* Data Fim */}
              <div className="space-y-1.5">
                <Label htmlFor="end_date" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Data de Término</Label>
                <Input
                  type="date"
                  id="end_date"
                  {...register('end_date')}
                  disabled={isCurrentValue}
                  className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200 disabled:opacity-40"
                />
                {errors.end_date && (
                  <p className="text-xs text-red-500 mt-1">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            {/* Switch Em andamento */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-850">
              <div className="space-y-0.5">
                <Label htmlFor="is_current" className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">Cursando / Em Andamento</Label>
                <p className="text-[10px] text-neutral-500">Marque se você ainda está realizando esta formação/curso.</p>
              </div>
              <Switch
                id="is_current"
                checked={watch('is_current')}
                onCheckedChange={(val) => {
                  setValue('is_current', val);
                  if (val) {
                    setValue('end_date', '');
                  }
                }}
              />
            </div>

            {/* Seleção de Tecnologias */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Tecnologias Focadas neste Curso (Opcional)</Label>
              
              {/* Selected tech tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedTechIds.map((id: string) => {
                  const tech = allTechnologies.find(t => t.id === id);
                  if (!tech) return null;
                  return (
                    <span 
                      key={id} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-650 border border-violet-500/20 dark:text-violet-400 dark:bg-violet-500/10"
                    >
                      {tech.name}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = selectedTechIds.filter((tId: string) => tId !== id);
                          setValue('technologies', updated);
                        }}
                        className="hover:text-red-500 focus:outline-none ml-1 font-bold text-[10px] cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
                {selectedTechIds.length === 0 && (
                  <p className="text-[11px] text-neutral-500 italic mt-0.5 leading-tight">
                    Nenhuma tecnologia selecionada.
                  </p>
                )}
              </div>

              {/* Input de Busca */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pesquise tecnologias para adicionar (ex: Java, AWS, TypeScript)..."
                  value={techQuery}
                  onChange={(e) => setTechQuery(e.target.value)}
                  className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                />
              </div>

              {/* Lista filtrada de correspondências */}
              {techQuery.trim().length > 0 && (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg max-h-36 overflow-y-auto bg-white dark:bg-neutral-950 p-1 divide-y divide-neutral-100 dark:divide-neutral-850 shadow-sm relative z-50">
                  {Array.isArray(allTechnologies) && allTechnologies
                    .filter(t => t.name.toLowerCase().includes(techQuery.toLowerCase()) && !selectedTechIds.includes(t.id))
                    .slice(0, 10)
                    .map((tech) => (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => {
                          setValue('technologies', [...selectedTechIds, tech.id]);
                          setTechQuery('');
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-violet-500/5 hover:text-violet-500 dark:hover:bg-violet-500/10 dark:hover:text-violet-400 font-semibold transition-colors cursor-pointer"
                      >
                        + {tech.name} <span className="text-[10px] text-neutral-450 ml-1 font-medium">({tech.category?.name})</span>
                      </button>
                    ))}
                  {(!Array.isArray(allTechnologies) || allTechnologies.filter(t => t.name.toLowerCase().includes(techQuery.toLowerCase()) && !selectedTechIds.includes(t.id)).length === 0) && (
                    <p className="text-[10px] text-neutral-500 italic p-2 text-center">Nenhuma tecnologia encontrada.</p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-850 gap-2">
              <Button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-750 dark:text-neutral-300 py-2.5 px-4 rounded-lg cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 px-6 rounded-lg cursor-pointer"
              >
                Salvar Formação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useProjects, ProjectData } from '@/features/projects/hooks/use-projects';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { 
  FolderGit2, 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Star, 
  Loader2, 
  UploadCloud 
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

const projectSchema = zod.object({
  title: zod.string().min(1, 'O título é obrigatório.').max(255),
  description: zod.string().min(1, 'A descrição é obrigatória.').max(2000),
  cover_image_url: zod.string().url('URL inválida.').or(zod.literal('')).nullable(),
  repository_url: zod.string().url('URL do repositório inválida.').or(zod.literal('')).nullable(),
  demo_url: zod.string().url('URL da demonstração inválida.').or(zod.literal('')).nullable(),
  is_featured: zod.boolean(),
  order_weight: zod.number().int(),
  technologies: zod.array(zod.string()),
});

type ProjectFormValues = zod.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('idle');
  
  // Catálogo de tecnologias e busca interna do formulário
  const [allTechnologies, setAllTechnologies] = useState<any[]>([]);
  const [techQuery, setTechQuery] = useState('');

  const queryClient = useQueryClient();

  const checkSyncStatus = async (count = 0) => {
    try {
      const response = await apiClient.get('/github/sync/status');
      const status = response.data.status;
      setSyncStatus(status);

      if (status === 'pending' || status === 'processing') {
        if (status === 'pending' && count > 10) { // 30 seconds limit for starting job
          setIsSyncing(false);
          toast.warning('A sincronização está na fila, mas o processador de tarefas (queue worker) do Laravel não respondeu. Execute "php artisan queue:work" na pasta backend.');
          return;
        }
        setIsSyncing(true);
        setTimeout(() => checkSyncStatus(count + 1), 3000);
      } else {
        setIsSyncing(false);
        if (status === 'completed') {
          toast.success('Projetos sincronizados do GitHub com sucesso!');
          queryClient.invalidateQueries({ queryKey: ['projects'] });
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        } else if (status === 'failed') {
          const errorMessage = response.data.error || 'Erro desconhecido.';
          toast.error(`Falha na sincronização: ${errorMessage}`);
        }
      }
    } catch (error) {
      setIsSyncing(false);
      setSyncStatus('failed');
      toast.error('Erro ao verificar status de sincronização.');
    }
  };

  const handleGithubSync = async () => {
    setIsSyncing(true);
    setSyncStatus('pending');
    try {
      await apiClient.post('/github/sync');
      toast.info('Sincronização iniciada. Mapeando seus repositórios...');
      checkSyncStatus(0);
    } catch (error: any) {
      setIsSyncing(false);
      setSyncStatus('failed');
      const message = error.response?.data?.message || 'Erro ao iniciar sincronização.';
      toast.error(message);
    }
  };

  // Carrega catálogo de tecnologias no mount
  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const response = await apiClient.get('/technologies?cb=' + Date.now());
        setAllTechnologies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Erro ao carregar catálogo de tecnologias:', err);
      }
    };
    loadTechnologies();
  }, []);

  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const response = await apiClient.get('/github/sync/status');
        const status = response.data.status;
        setSyncStatus(status);
        if (status === 'pending' || status === 'processing') {
          setIsSyncing(true);
          setTimeout(() => checkSyncStatus(0), 1500);
        }
      } catch (e) {
        // Ignora
      }
    };
    checkInitialStatus();
  }, []);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      cover_image_url: '',
      repository_url: '',
      demo_url: '',
      is_featured: false,
      order_weight: 0,
      technologies: [],
    }
  });

  const selectedTechIds = watch('technologies') || [];

  const openAddDialog = () => {
    setEditingProject(null);
    setCoverPreview(null);
    setTechQuery('');
    reset({
      title: '',
      description: '',
      cover_image_url: '',
      repository_url: '',
      demo_url: '',
      is_featured: false,
      order_weight: 0,
      technologies: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (project: ProjectData) => {
    setEditingProject(project);
    setCoverPreview(project.cover_image_url);
    setTechQuery('');
    reset({
      title: project.title,
      description: project.description,
      cover_image_url: project.cover_image_url || '',
      repository_url: project.repository_url || '',
      demo_url: project.demo_url || '',
      is_featured: project.is_featured,
      order_weight: project.order_weight,
      technologies: project.technologies ? project.technologies.map((t: any) => t.id) : [],
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'projects');

    setIsUploading(true);
    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = response.data.url;
      setValue('cover_image_url', url, { shouldValidate: true });
      setCoverPreview(url);
      toast.success('Imagem carregada com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao enviar imagem.';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      const payload = {
        ...values,
        cover_image_url: values.cover_image_url === '' ? null : values.cover_image_url,
        repository_url: values.repository_url === '' ? null : values.repository_url,
        demo_url: values.demo_url === '' ? null : values.demo_url,
      } as any;

      if (editingProject) {
        await updateProject({ id: editingProject.id, data: payload });
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await createProject(payload);
        toast.success('Projeto criado com sucesso!');
      }
      setDialogOpen(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar projeto.';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza de que deseja remover este projeto?')) {
      try {
        await deleteProject(id);
        toast.success('Projeto removido com sucesso!');
      } catch (error: any) {
        toast.error('Erro ao remover o projeto.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-850">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Projetos</h1>
          <p className="text-sm text-neutral-550">Adicione e organize seus projetos no portfólio e defina as tecnologias usadas.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGithubSync}
            disabled={isSyncing}
            variant="outline"
            className="border-neutral-250 dark:border-neutral-855 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-semibold cursor-pointer py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
            ) : (
              <GithubIcon className="w-4 h-4" />
            )}
            {isSyncing 
              ? (syncStatus === 'pending' ? 'Conectando...' : 'Sincronizando...') 
              : 'Sincronizar GitHub'}
          </Button>

          <Button
            onClick={openAddDialog}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/10 text-center space-y-3">
          <FolderGit2 className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-300">Nenhum projeto cadastrado</h3>
          <p className="text-sm text-neutral-500 max-w-sm">Adicione seus primeiros projetos para começar a exibir em seu portfólio.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={handleGithubSync}
              disabled={isSyncing}
              variant="outline"
              className="border-neutral-250 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-semibold cursor-pointer py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
              ) : (
                <GithubIcon className="w-4 h-4" />
              )}
              {isSyncing 
                ? (syncStatus === 'pending' ? 'Conectando...' : 'Sincronizando...') 
                : 'Sincronizar GitHub'}
            </Button>
            <Button
              onClick={openAddDialog}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold cursor-pointer py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Manualmente
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-white dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850 overflow-hidden hover:border-violet-500/15 dark:hover:border-violet-500/20 transition-all duration-300 flex flex-col justify-between shadow-sm">
              <div>
                {/* Project Image Header */}
                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-855 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                  {project.cover_image_url ? (
                    <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <FolderGit2 className="w-10 h-10 text-neutral-450 dark:text-neutral-600" />
                  )}
                  {project.is_featured && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 py-1 px-2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-current" />
                      Destaque
                    </span>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">{project.title}</CardTitle>
                  <CardDescription className="text-sm text-neutral-650 dark:text-neutral-400 line-clamp-2 min-h-[40px]">{project.description}</CardDescription>
                </CardHeader>

                {project.technologies && project.technologies.length > 0 && (
                  <CardContent className="pt-0 pb-1 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech: any) => (
                      <span key={tech.id} className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-450 text-[10px] font-mono border border-neutral-250 dark:border-neutral-800">
                        {tech.name}
                      </span>
                    ))}
                  </CardContent>
                )}
              </div>

              <CardFooter className="pt-0 flex items-center justify-between gap-2 border-t border-neutral-100 dark:border-neutral-850/50 mt-4 py-3">
                <div className="flex gap-1.5">
                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 dark:bg-neutral-855 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg transition-colors"
                      title="Repositório no GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 dark:bg-neutral-855 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-lg transition-colors"
                      title="Demonstração"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEditDialog(project)}
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-violet-650 dark:bg-neutral-855 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-violet-400 rounded-lg transition-colors cursor-pointer"
                    title="Editar Projeto"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-red-655 dark:bg-neutral-855 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Remover Projeto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 text-neutral-850 dark:text-neutral-200 max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">{editingProject ? 'Editar Projeto' : 'Adicionar Novo Projeto'}</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-455">Preencha os campos abaixo. Campos vazios serão removidos do portfólio.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Título do Projeto</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Ex: E-commerce Premium API"
                className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Descrição</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Explique o objetivo, tecnologias e seu papel no projeto..."
                className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200 min-h-[90px]"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Imagem de Capa</Label>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-850">
                <div className="relative w-28 aspect-video rounded overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center flex-shrink-0">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Capa" className="w-full h-full object-cover" />
                  ) : (
                    <FolderGit2 className="w-8 h-8 text-neutral-400 dark:text-neutral-700" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <Label htmlFor="cover-file" className="flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-neutral-300 dark:border-neutral-800 hover:border-violet-500/50 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 text-center">
                    <UploadCloud className="w-4 h-4" />
                    Carregar Capa
                  </Label>
                  <input
                    type="file"
                    id="cover-file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <p className="text-[10px] text-neutral-500 mt-1.5 text-center sm:text-left">Formatos suportados: WebP, JPG, PNG (Max. 5MB).</p>
                </div>
              </div>
            </div>

            {/* Seleção de Tecnologias */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Tecnologias Utilizadas (Opcional)</Label>
              
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
                  placeholder="Pesquise tecnologias para adicionar (ex: React, Tailwind, PostgreSQL)..."
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

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="repository_url" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Repositório GitHub (URL)</Label>
                <Input
                  id="repository_url"
                  {...register('repository_url')}
                  placeholder="https://github.com/..."
                  className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                />
                {errors.repository_url && (
                  <p className="text-xs text-red-500 mt-1">{errors.repository_url.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="demo_url" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Demonstração URL (Live Site)</Label>
                <Input
                  id="demo_url"
                  {...register('demo_url')}
                  placeholder="https://meuprojeto.com"
                  className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                />
                {errors.demo_url && (
                  <p className="text-xs text-red-500 mt-1">{errors.demo_url.message}</p>
                )}
              </div>
            </div>

            {/* Switch Featured */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-850">
              <div className="space-y-0.5">
                <Label htmlFor="is_featured" className="text-xs font-semibold text-neutral-800 dark:text-neutral-350">Destacar no Portfólio</Label>
                <p className="text-[10px] text-neutral-500">Exibir em destaque no topo do portfólio (máx. 3).</p>
              </div>
              <Switch
                id="is_featured"
                checked={watch('is_featured')}
                onCheckedChange={(val) => setValue('is_featured', val)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="order_weight" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Peso de Ordenação (Menor valor aparece primeiro)</Label>
              <Input
                type="number"
                id="order_weight"
                {...register('order_weight', { valueAsNumber: true })}
                className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
              />
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
                disabled={isUploading}
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 px-6 rounded-lg cursor-pointer"
              >
                Salvar Projeto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

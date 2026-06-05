'use client';

import { useProfile, ProfileData } from '@/features/profile/hooks/use-profile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Globe, 
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

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const profileSchema = zod.object({
  name: zod.string().min(1, 'O nome é obrigatório.').max(255),
  username: zod.string().min(3, 'Mínimo de 3 caracteres.').max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Nome de usuário inválido (letras, números, - e _ apenas).'),
  avatar_url: zod.string().url('URL inválida.').or(zod.literal('')).nullable(),
  bio: zod.string().max(1000).nullable(),
  role: zod.string().max(100).nullable(),
  location: zod.string().max(150).nullable(),
  linkedin_url: zod.string().url('URL do LinkedIn inválida.').or(zod.literal('')).nullable(),
  github_url: zod.string().url('URL do GitHub inválida.').or(zod.literal('')).nullable(),
  website_url: zod.string().url('URL do Website inválida.').or(zod.literal('')).nullable(),
  theme_name: zod.string().min(1, 'Selecione um tema.'),
  skills: zod.array(zod.string()),
});

type ProfileFormValues = zod.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      username: '',
      avatar_url: '',
      bio: '',
      role: '',
      location: '',
      linkedin_url: '',
      github_url: '',
      website_url: '',
      theme_name: 'minimalist',
      skills: [],
    }
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        username: profile.username,
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        role: profile.role || '',
        location: profile.location || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        website_url: profile.website_url || '',
        theme_name: profile.theme_name || 'minimalist',
        skills: profile.skills ? profile.skills.map((s: any) => s.name) : [],
      });
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'avatars');

    setIsUploading(true);
    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = response.data.url;
      setValue('avatar_url', url, { shouldValidate: true });
      setAvatarPreview(url);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao enviar a imagem.';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = newSkill.trim();
      if (!trimmed) return;
      
      const currentSkills = watch('skills') || [];
      if (currentSkills.includes(trimmed)) {
        toast.error('Esta competência já foi adicionada.');
        return;
      }
      
      setValue('skills', [...currentSkills, trimmed], { shouldValidate: true });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = watch('skills') || [];
    setValue('skills', currentSkills.filter(s => s !== skillToRemove), { shouldValidate: true });
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, val]) => [key, val === '' ? null : val])
      ) as Partial<ProfileData>;

      await updateProfile(payload);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil.';
      toast.error(message);
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
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-850">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Editar Perfil</h1>
          <p className="text-sm text-neutral-500">Configure suas informações pessoais e tema de portfólio.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Foto e Tema */}
        <div className="space-y-6 md:col-span-1">
          {/* Card Avatar */}
          <Card className="bg-white dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">Foto de Perfil</CardTitle>
              <CardDescription className="text-xs text-neutral-500">Carregue sua foto de exibição.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-neutral-450 dark:text-neutral-500" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                  </div>
                )}
              </div>
              
              <div className="w-full">
                <Label htmlFor="avatar-file" className="flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-neutral-300 dark:border-neutral-800 hover:border-violet-500/50 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 w-full text-center">
                  <UploadCloud className="w-4 h-4" />
                  Upload Foto
                </Label>
                <input
                  type="file"
                  id="avatar-file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card Tema */}
          <Card className="bg-white dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">Tema do Portfólio</CardTitle>
              <CardDescription className="text-xs text-neutral-500">Escolha o visual do seu site público.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="theme-select" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Tema Ativo</Label>
                <Select
                  value={watch('theme_name')}
                  onValueChange={(val) => {
                    if (val) setValue('theme_name', val, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger id="theme-select" className="bg-white border-neutral-250 text-sm text-neutral-800 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-350">
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 text-neutral-800 dark:text-neutral-300">
                    <SelectItem value="minimalist">Minimalista</SelectItem>
                    <SelectItem value="modern">Moderno (Gradients)</SelectItem>
                    <SelectItem value="dark">Dark Mode Extremo</SelectItem>
                    <SelectItem value="light">Claro Elegante</SelectItem>
                  </SelectContent>
                </Select>
                {errors.theme_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.theme_name.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card Competências */}
          <Card className="bg-white dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">Competências</CardTitle>
              <CardDescription className="text-xs text-neutral-500">Adicione habilidades técnicas ao seu portfólio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skill-input" className="text-xs font-semibold text-neutral-550 dark:text-neutral-400">Adicionar Habilidade</Label>
                <div className="flex gap-2">
                  <Input
                    id="skill-input"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Ex: React, Laravel, Docker..."
                    className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const trimmed = newSkill.trim();
                      if (!trimmed) return;
                      const currentSkills = watch('skills') || [];
                      if (currentSkills.includes(trimmed)) {
                        toast.error('Esta competência já foi adicionada.');
                        return;
                      }
                      setValue('skills', [...currentSkills, trimmed], { shouldValidate: true });
                      setNewSkill('');
                    }}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-3 rounded-lg cursor-pointer"
                  >
                    Adicionar
                  </Button>
                </div>
                <p className="text-[10px] text-neutral-500">Pressione Enter ou clique em Adicionar para cadastrar.</p>
              </div>

              {/* List of skills as badges with clear buttons */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Habilidades Adicionadas</Label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-850 min-h-[60px]">
                  {(watch('skills') || []).length === 0 ? (
                    <span className="text-xs text-neutral-400 dark:text-neutral-600 italic">Nenhuma habilidade adicionada ainda.</span>
                  ) : (
                    (watch('skills') || []).map((skillName) => (
                      <span
                        key={skillName}
                        className="inline-flex items-center gap-1 py-0.5 pl-2.5 pr-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-750 dark:bg-violet-500/10 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20"
                      >
                        {skillName}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skillName)}
                          className="p-0.5 rounded-full hover:bg-violet-250 dark:hover:bg-violet-500/20 text-violet-750 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Informações Gerais e Sociais */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">Dados Pessoais</CardTitle>
              <CardDescription className="text-xs text-neutral-500">Essas informações aparecerão no topo do seu portfólio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Nome Completo</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Davi Silva"
                    className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Username slug */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Nome de Usuário (Slug URL)</Label>
                  <Input
                    id="username"
                    {...register('username')}
                    placeholder="davisilva"
                    className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200"
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cargo */}
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs font-semibold text-neutral-550 dark:text-neutral-400">Cargo / Profissão</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                    <Input
                      id="role"
                      {...register('role')}
                      placeholder="Desenvolvedor Full Stack"
                      className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200 pl-10"
                    />
                  </div>
                  {errors.role && (
                    <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
                  )}
                </div>

                {/* Localização */}
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Localização</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                    <Input
                      id="location"
                      {...register('location')}
                      placeholder="São Paulo, Brasil"
                      className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200 pl-10"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Biografia (Sobre Mim)</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Escreva sobre suas paixões, tecnologias favoritas e histórico..."
                  className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200 min-h-[120px]"
                />
                {errors.bio && (
                  <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Links Sociais */}
          <Card className="bg-white dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-850 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">Links Sociais</CardTitle>
              <CardDescription className="text-xs text-neutral-500">Conecte seus perfis profissionais externos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* LinkedIn */}
                <div className="space-y-1.5">
                  <Label htmlFor="linkedin" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">LinkedIn URL</Label>
                  <div className="relative">
                    <LinkedinIcon className="absolute left-3 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                    <Input
                      id="linkedin"
                      {...register('linkedin_url')}
                      placeholder="https://linkedin.com/in/username"
                      className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200 pl-10"
                    />
                  </div>
                  {errors.linkedin_url && (
                    <p className="text-xs text-red-500 mt-1">{errors.linkedin_url.message}</p>
                  )}
                </div>

                {/* GitHub */}
                <div className="space-y-1.5">
                  <Label htmlFor="github" className="text-xs font-semibold text-neutral-550 dark:text-neutral-400">GitHub URL</Label>
                  <div className="relative">
                    <GithubIcon className="absolute left-3 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                    <Input
                      id="github"
                      {...register('github_url')}
                      placeholder="https://github.com/username"
                      className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200 pl-10"
                    />
                  </div>
                  {errors.github_url && (
                    <p className="text-xs text-red-500 mt-1">{errors.github_url.message}</p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Website Pessoal</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                    <Input
                      id="website"
                      {...register('website_url')}
                      placeholder="https://meusite.com"
                      className="bg-white border-neutral-250 text-sm text-neutral-900 focus:border-violet-500 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-200 pl-10"
                    />
                  </div>
                  {errors.website_url && (
                    <p className="text-xs text-red-500 mt-1">{errors.website_url.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Enviar */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

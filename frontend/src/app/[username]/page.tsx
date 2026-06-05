import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import axios from 'axios';
import { 
  MapPin, 
  Briefcase, 
  Globe, 
  Calendar, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import React from 'react';

interface Skill {
  id: string;
  name: string;
  category: string;
  pivot: {
    proficiency_level: number;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  repository_url: string | null;
  demo_url: string | null;
  is_featured: boolean;
  order_weight: number;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

interface Education {
  id: string;
  institution: string;
  course: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

interface Profile {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  theme_name: string;
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
}

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

async function getPortfolio(username: string): Promise<Profile | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const response = await axios.get(`${apiUrl}/portfolios/${username}`);
    return response.data.profile;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = await getPortfolio(resolvedParams.username);
  if (!profile) {
    return { title: 'Portfólio Não Encontrado' };
  }
  return {
    title: `${profile.name} | DevFolio`,
    description: profile.bio || `Portfólio de ${profile.name}`,
  };
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const profile = await getPortfolio(resolvedParams.username);

  if (!profile) {
    notFound();
  }

  const theme = profile.theme_name || 'minimalist';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  };

  // Google Fonts dynamic links injector depending on theme to offer premium typography.
  const fontsLink = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Lexend:wght@400;500;600;700;800;900&family=Syne:wght@500;700;800&display=swap";

  // Renders the appropriate premium layout according to the theme
  if (theme === 'minimalist') {
    // ----------------------------------------------------
    // EDITORIAL MINIMALIST THEME (Ivory & Slate Clean Serif)
    // ----------------------------------------------------
    return (
      <>
        <link href={fontsLink} rel="stylesheet" />
        <div className="bg-[#fafaf7] text-[#1c1c1c] dark:bg-[#0c0c0c] dark:text-[#f3f3f3] min-h-screen transition-colors duration-300 font-['Inter',sans-serif]">
          <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Left Column - Sticky Profile info */}
              <aside className="lg:col-span-4 lg:sticky lg:top-20 lg:h-fit space-y-8">
                <div className="space-y-6">
                  {profile.avatar_url ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-neutral-250 dark:border-neutral-800">
                      <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center border border-neutral-300 dark:border-neutral-700">
                      <span className="text-3xl font-light text-neutral-500 uppercase">{profile.name[0]}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-normal tracking-tight font-['Playfair_Display',serif]">{profile.name}</h1>
                    {profile.role && <p className="text-[#656562] dark:text-[#a1a19e] font-medium text-sm tracking-wide uppercase">{profile.role}</p>}
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-sm text-[#484845] dark:text-[#c4c4c0] leading-relaxed font-light">{profile.bio}</p>
                )}

                <div className="space-y-4 pt-4 border-t border-[#e2e2de] dark:border-[#272725]">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-xs text-[#656562] dark:text-[#a1a19e]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-[#656562] hover:text-[#1c1c1c] dark:text-[#a1a19e] dark:hover:text-[#f3f3f3] transition-colors" title="GitHub">
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#656562] hover:text-[#1c1c1c] dark:text-[#a1a19e] dark:hover:text-[#f3f3f3] transition-colors" title="LinkedIn">
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    )}
                    {profile.website_url && (
                      <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-[#656562] hover:text-[#1c1c1c] dark:text-[#a1a19e] dark:hover:text-[#f3f3f3] transition-colors" title="Website">
                        <Globe className="w-4.5 h-4.5" />
                      </a>
                    )}
                  </div>
                </div>
              </aside>

              {/* Right Column - Scrolling details */}
              <main className="lg:col-span-8 space-y-16">
                
                {/* Habilidades */}
                {profile.skills && profile.skills.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-semibold text-[#656562] dark:text-[#a1a19e] uppercase tracking-widest border-b border-[#e2e2de] dark:border-[#272725] pb-2">Habilidades</h2>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {profile.skills.map((skill) => (
                        <span key={skill.id} className="text-xs bg-[#e2e2de]/40 text-[#484845] dark:bg-[#272725]/50 dark:text-[#c4c4c0] px-3 py-1 rounded-none border border-[#e2e2de] dark:border-[#272725] transition-all hover:bg-transparent">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projetos */}
                {profile.projects && profile.projects.length > 0 && (
                  <section className="space-y-6">
                    <h2 className="text-xs font-semibold text-[#656562] dark:text-[#a1a19e] uppercase tracking-widest border-b border-[#e2e2de] dark:border-[#272725] pb-2">Projetos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                      {profile.projects.map((project) => (
                        <div key={project.id} className="group space-y-4">
                          {project.cover_image_url && (
                            <div className="aspect-video w-full overflow-hidden bg-[#e2e2de]/20 dark:bg-[#272725]/20 border border-[#e2e2de]/60 dark:border-[#272725]/60">
                              <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
                            </div>
                          )}
                          <div className="space-y-2">
                            <h3 className="text-md font-semibold font-['Playfair_Display',serif] group-hover:underline underline-offset-4 decoration-neutral-400">{project.title}</h3>
                            <p className="text-xs text-[#585855] dark:text-[#b4b4b0] leading-relaxed line-clamp-3 font-light">{project.description}</p>
                            <div className="flex items-center gap-3 pt-1">
                              {project.repository_url && (
                                <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-[#656562] hover:text-[#1c1c1c] dark:text-[#a1a19e] dark:hover:text-[#f3f3f3] transition-colors">
                                  <span>Repository</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {project.demo_url && (
                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-[#656562] hover:text-[#1c1c1c] dark:text-[#a1a19e] dark:hover:text-[#f3f3f3] transition-colors">
                                  <span>Live Demo</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Experiências */}
                {profile.experiences && profile.experiences.length > 0 && (
                  <section className="space-y-6">
                    <h2 className="text-xs font-semibold text-[#656562] dark:text-[#a1a19e] uppercase tracking-widest border-b border-[#e2e2de] dark:border-[#272725] pb-2">Experiência</h2>
                    <div className="space-y-8 pt-2">
                      {profile.experiences.map((exp) => (
                        <div key={exp.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
                          <div className="md:col-span-4 text-xs text-[#656562] dark:text-[#a1a19e] font-light">
                            {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                          </div>
                          <div className="md:col-span-8 space-y-2">
                            <h3 className="text-sm font-semibold">{exp.role} <span className="font-light text-[#656562] dark:text-[#a1a19e]">at</span> {exp.company}</h3>
                            {exp.description && (
                              <p className="text-xs text-[#585855] dark:text-[#b4b4b0] leading-relaxed font-light whitespace-pre-wrap">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Formação */}
                {profile.educations && profile.educations.length > 0 && (
                  <section className="space-y-6">
                    <h2 className="text-xs font-semibold text-[#656562] dark:text-[#a1a19e] uppercase tracking-widest border-b border-[#e2e2de] dark:border-[#272725] pb-2">Formação</h2>
                    <div className="space-y-8 pt-2">
                      {profile.educations.map((edu) => (
                        <div key={edu.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
                          <div className="md:col-span-4 text-xs text-[#656562] dark:text-[#a1a19e] font-light">
                            {formatDate(edu.start_date)} — {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                          </div>
                          <div className="md:col-span-8 space-y-1">
                            <h3 className="text-sm font-semibold">{edu.course}</h3>
                            <p className="text-xs text-[#656562] dark:text-[#a1a19e] font-light">{edu.institution}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </main>
            </div>
          </div>
        </div>
      </>
    );
  } else if (theme === 'modern') {
    // ----------------------------------------------------
    // MODERN GLASSMORPHISM THEME (Deep Dark Blue/Indigo + Glowing Blobs)
    // ----------------------------------------------------
    return (
      <>
        <link href={fontsLink} rel="stylesheet" />
        <div className="bg-[#030616] text-[#f1f5f9] min-h-screen relative overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif] pb-20">
          
          {/* Ambient Lighting / Glowing blobs */}
          <div className="absolute top-[-100px] left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-violet-600/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
          <div className="absolute top-[400px] right-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-indigo-500/8 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[200px] left-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 pt-20 sm:pt-28 space-y-16 relative z-10">
            
            {/* Centered Header */}
            <header className="flex flex-col items-center text-center space-y-6">
              {profile.avatar_url ? (
                <div className="w-28 h-28 rounded-full overflow-hidden p-[3px] bg-gradient-to-tr from-violet-500 via-indigo-500 to-cyan-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#030616]">
                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                  <span className="text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent uppercase">{profile.name[0]}</span>
                </div>
              )}

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-[#a5b4fc] bg-clip-text text-transparent">{profile.name}</h1>
                {profile.role && (
                  <p className="text-base sm:text-lg text-violet-400 font-semibold tracking-wide flex items-center justify-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    {profile.role}
                  </p>
                )}
                {profile.location && (
                  <p className="text-xs text-[#94a3b8] flex items-center justify-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    {profile.location}
                  </p>
                )}
              </div>

              {/* Social networks */}
              <div className="flex items-center gap-4 pt-2">
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/30 text-[#94a3b8] hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/30 text-[#94a3b8] hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/30 text-[#94a3b8] hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </header>

            {/* About Section */}
            {profile.bio && (
              <section className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-white/12 transition-colors">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#cbd5e1]">Sobre Mim</h2>
                </div>
                <p className="text-[#94a3b8] leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-light">{profile.bio}</p>
              </section>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-violet-500/50" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#cbd5e1]">Competências</h2>
                  <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-violet-500/50" />
                </div>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {profile.skills.map((skill) => (
                    <span key={skill.id} className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white/4 border border-white/8 text-[#e2e8f0] backdrop-blur-sm hover:border-violet-500/30 hover:bg-violet-500/5 transition-all">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {profile.projects && profile.projects.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-400" />
                  <h2 className="text-lg font-bold tracking-tight text-white">Projetos em Destaque</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="bg-white/4 border border-white/8 backdrop-blur-md rounded-2xl overflow-hidden hover:border-violet-500/30 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] hover:scale-[1.01] transition-all duration-500 flex flex-col justify-between">
                      <div>
                        {project.cover_image_url && (
                          <div className="aspect-video w-full overflow-hidden bg-neutral-900 border-b border-white/5 relative">
                            <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                          </div>
                        )}
                        <div className="p-6 space-y-3">
                          <h3 className="text-lg font-bold tracking-tight text-white">{project.title}</h3>
                          <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-3 font-light">{project.description}</p>
                        </div>
                      </div>
                      <div className="px-6 pb-6 pt-2 flex items-center gap-4">
                        {project.repository_url && (
                          <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 group">
                            <span>Repository</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        )}
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group">
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experiences & Education Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              
              {/* Experiências */}
              {profile.experiences && profile.experiences.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Briefcase className="w-4 h-4 text-violet-400" />
                    <h2 className="text-md font-bold text-white">Trajetória Profissional</h2>
                  </div>
                  <div className="space-y-6">
                    {profile.experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-6 border-l border-white/10 space-y-1">
                        <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />
                        <span className="text-[10px] font-semibold text-[#64748b]">
                          {formatDate(exp.start_date)} — {exp.is_current ? 'Atualmente' : formatDate(exp.end_date || '')}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-tight">{exp.role}</h3>
                        <p className="text-xs text-violet-400/90 font-medium">{exp.company}</p>
                        {exp.description && (
                          <p className="text-xs text-[#94a3b8] leading-relaxed pt-1 font-light line-clamp-4">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Formações */}
              {profile.educations && profile.educations.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-md font-bold text-white">Formação Acadêmica</h2>
                  </div>
                  <div className="space-y-6">
                    {profile.educations.map((edu) => (
                      <div key={edu.id} className="relative pl-6 border-l border-white/10 space-y-1">
                        <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                        <span className="text-[10px] font-semibold text-[#64748b]">
                          {formatDate(edu.start_date)} — {edu.is_current ? 'Em Andamento' : formatDate(edu.end_date || '')}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-tight">{edu.course}</h3>
                        <p className="text-xs text-cyan-400/90 font-medium">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

          </div>
        </div>
      </>
    );
  } else if (theme === 'dark') {
    // ----------------------------------------------------
    // NEON CYBERPUNK THEME (Tech Grid, Pure Black, Glowing Cyan & Pink Details)
    // ----------------------------------------------------
    return (
      <>
        <link href={fontsLink} rel="stylesheet" />
        <div className="bg-[#050508] text-[#cbd5e1] min-h-screen relative overflow-x-hidden font-['Space_Grotesk',sans-serif] pb-20">
          
          {/* Cyberpunk Grid Background Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d405_1px,transparent_1px),linear-gradient(to_bottom,#06b6d405_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none" />

          {/* Accent Glow lights */}
          <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 py-16 space-y-14 relative z-10">
            
            {/* Header section with brackets */}
            <header className="flex flex-col sm:flex-row items-center gap-8 border border-neutral-850 bg-[#090a12]/80 backdrop-blur-md p-8 relative">
              {/* Cyberpunk corners decor */}
              <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
              <div className="absolute top-[-1px] right-[-1px] w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
              <div className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-b-2 border-l-2 border-pink-500" />
              <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-b-2 border-r-2 border-pink-500" />

              <div className="w-24 h-24 rounded-none bg-neutral-900 border border-neutral-800 flex-shrink-0 flex items-center justify-center p-1.5 relative">
                <div className="absolute inset-0 border border-cyan-500/40 animate-pulse" />
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-neutral-400 uppercase">{profile.name[0]}</span>
                )}
              </div>

              <div className="space-y-4 flex-1 text-center sm:text-left">
                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">{profile.name}</h1>
                  {profile.role && <p className="text-sm font-semibold font-mono text-cyan-400 tracking-wider uppercase">// {profile.role}</p>}
                </div>
                
                {profile.location && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-neutral-450 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-pink-500" />
                    <span>LOC::{profile.location.toUpperCase()}</span>
                  </div>
                )}

                {/* Social media Links with Cyberpunk outline buttons */}
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2 border border-neutral-800 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 border border-neutral-800 text-neutral-400 hover:text-pink-500 hover:border-pink-500/40 transition-all">
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="p-2 border border-neutral-800 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </header>

            {/* About Box */}
            {profile.bio && (
              <section className="border border-neutral-850 bg-black/40 p-6 relative">
                <div className="absolute top-[-1px] left-4 bg-[#050508] px-3 text-xs font-mono text-pink-500">// BIO_DATA</div>
                <p className="text-neutral-400 leading-relaxed text-sm sm:text-base font-light pt-2 whitespace-pre-wrap">{profile.bio}</p>
              </section>
            )}

            {/* Skills with Neon Cyberpunk tags */}
            {profile.skills && profile.skills.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold font-mono tracking-widest text-cyan-400 uppercase">// SYS_SKILLS</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill.id} className="px-3 py-1.5 text-xs font-mono border border-cyan-500/20 text-cyan-400 bg-cyan-950/10 hover:border-cyan-500/50 transition-all">
                      {skill.name.toUpperCase()}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Projects with Glowing neon hover border */}
            {profile.projects && profile.projects.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-xs font-bold font-mono tracking-widest text-pink-500 uppercase">// ACTIVE_PROJECTS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="border border-neutral-850 bg-[#090a12]/60 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 relative group flex flex-col justify-between">
                      {/* Corner tag on project */}
                      {project.is_featured && (
                        <span className="absolute top-0 right-0 inline-flex items-center gap-1 py-1 px-2.5 text-[9px] font-bold font-mono bg-pink-500/20 text-pink-400 border-l border-b border-pink-500/30">
                          FEATURED
                        </span>
                      )}
                      
                      <div>
                        {project.cover_image_url && (
                          <div className="aspect-video w-full overflow-hidden bg-neutral-900 border-b border-neutral-850 relative">
                            <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          </div>
                        )}
                        <div className="p-6 space-y-3">
                          <h3 className="text-base font-bold text-white font-mono tracking-tight">{project.title.toUpperCase()}</h3>
                          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 font-light">{project.description}</p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2 flex items-center gap-4">
                        {project.repository_url && (
                          <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                            <span>REPO_SRC</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-pink-400 hover:text-pink-300 flex items-center gap-1">
                            <span>SYS_LIVE</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Timeline for Professional & Academic history */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              
              {/* Experiências */}
              {profile.experiences && profile.experiences.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-xs font-bold font-mono tracking-widest text-cyan-400 uppercase border-b border-neutral-850 pb-2">// WORK_LOGS</h2>
                  <div className="space-y-6">
                    {profile.experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-6 border-l border-cyan-500/20 space-y-1">
                        <div className="absolute left-[-3.5px] top-1.5 w-1.5 h-1.5 rounded-none bg-cyan-500 shadow-[0_0_6px_#06b6d4]" />
                        <span className="text-[10px] font-mono text-neutral-500">
                          {formatDate(exp.start_date).toUpperCase()} - {exp.is_current ? 'PRESENT' : formatDate(exp.end_date || '').toUpperCase()}
                        </span>
                        <h3 className="text-sm font-bold text-white font-mono leading-tight">{exp.role.toUpperCase()}</h3>
                        <p className="text-xs text-neutral-400 font-mono">{exp.company.toUpperCase()}</p>
                        {exp.description && (
                          <p className="text-xs text-neutral-500 leading-relaxed pt-1 font-light line-clamp-3">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Formações */}
              {profile.educations && profile.educations.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-xs font-bold font-mono tracking-widest text-pink-500 uppercase border-b border-neutral-850 pb-2">// EDU_LOGS</h2>
                  <div className="space-y-6">
                    {profile.educations.map((edu) => (
                      <div key={edu.id} className="relative pl-6 border-l border-pink-500/20 space-y-1">
                        <div className="absolute left-[-3.5px] top-1.5 w-1.5 h-1.5 rounded-none bg-pink-500 shadow-[0_0_6px_#ec4899]" />
                        <span className="text-[10px] font-mono text-neutral-500">
                          {formatDate(edu.start_date).toUpperCase()} - {edu.is_current ? 'IN_PROGRESS' : formatDate(edu.end_date || '').toUpperCase()}
                        </span>
                        <h3 className="text-sm font-bold text-white font-mono leading-tight">{edu.course.toUpperCase()}</h3>
                        <p className="text-xs text-neutral-400 font-mono">{edu.institution.toUpperCase()}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

          </div>
        </div>
      </>
    );
  } else if (theme === 'light') {
    // ----------------------------------------------------
    // PLAYFUL NEOBRUTALIST THEME (High Contrast, Bold Borders & Offset Drop Shadows)
    // ----------------------------------------------------
    return (
      <>
        <link href={fontsLink} rel="stylesheet" />
        <div className="bg-[#fffdf5] text-neutral-900 min-h-screen font-['Lexend',sans-serif] pb-24">
          <div className="max-w-4xl mx-auto px-6 pt-16 sm:pt-24 space-y-16">
            
            {/* Header Neobrutalist Banner Card */}
            <header className="bg-[#bbf7d0] border-[3px] border-neutral-950 p-6 sm:p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center gap-6">
              {profile.avatar_url ? (
                <div className="w-24 h-24 rounded-xl overflow-hidden border-[3px] border-neutral-950 bg-white flex-shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-white border-[3px] border-neutral-950 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-4xl font-black text-neutral-900 uppercase">{profile.name[0]}</span>
                </div>
              )}

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-none">{profile.name}</h1>
                  {profile.role && <p className="text-sm font-bold bg-[#fef08a] border border-neutral-950 inline-block px-2 py-0.5 mt-2 rounded">{profile.role}</p>}
                </div>
                
                {profile.location && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-neutral-700">
                    <MapPin className="w-3.5 h-3.5 text-neutral-900" />
                    <span>{profile.location}</span>
                  </div>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white hover:bg-neutral-100 border-2 border-neutral-950 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <GithubIcon className="w-4 h-4 text-neutral-900" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white hover:bg-neutral-100 border-2 border-neutral-950 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <LinkedinIcon className="w-4 h-4 text-neutral-900" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white hover:bg-neutral-100 border-2 border-neutral-950 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <Globe className="w-4 h-4 text-neutral-900" />
                    </a>
                  )}
                </div>
              </div>
            </header>

            {/* About Box (Offset Shadow) */}
            {profile.bio && (
              <section className="bg-white border-[3px] border-neutral-950 p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wider bg-[#ffd7aa] border border-neutral-950 inline-block px-2.5 py-0.5 rounded">SOBRE</h2>
                <p className="text-neutral-800 leading-relaxed text-sm sm:text-base font-medium whitespace-pre-wrap">{profile.bio}</p>
              </section>
            )}

            {/* Skills as Block Badges */}
            {profile.skills && profile.skills.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-md font-extrabold text-neutral-900 uppercase">Habilidades</h2>
                <div className="flex flex-wrap gap-2.5">
                  {profile.skills.map((skill) => (
                    <span key={skill.id} className="px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 border-neutral-950 bg-[#c084fc] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-neutral-900">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Neobrutalist Grid */}
            {profile.projects && profile.projects.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-md font-extrabold text-neutral-900 uppercase">Projetos Realizados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="bg-white border-[3px] border-neutral-950 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between">
                      <div>
                        {project.cover_image_url && (
                          <div className="aspect-video w-full overflow-hidden bg-neutral-950 border-b-2 border-neutral-950">
                            <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-6 space-y-3">
                          <h3 className="text-lg font-black text-neutral-900 tracking-tight leading-tight">{project.title}</h3>
                          <p className="text-xs text-neutral-700 leading-relaxed line-clamp-3 font-semibold">{project.description}</p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2 flex items-center gap-4">
                        {project.repository_url && (
                          <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold underline decoration-2 hover:text-[#9333ea] flex items-center gap-1">
                            <span>Ver Código</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold underline decoration-2 hover:text-[#059669] flex items-center gap-1">
                            <span>Demonstração</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience / Education Block timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              
              {/* Experiências */}
              {profile.experiences && profile.experiences.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-md font-extrabold text-neutral-900 uppercase">Experiência Profissional</h2>
                  <div className="space-y-6">
                    {profile.experiences.map((exp) => (
                      <div key={exp.id} className="bg-white border-[3px] border-neutral-950 p-5 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase text-neutral-500">
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Hoje' : formatDate(exp.end_date || '')}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-neutral-900">{exp.role}</h3>
                        <p className="text-xs font-bold text-neutral-650 bg-[#e9d5ff] border border-neutral-950 inline-block px-2 py-0.5 rounded">{exp.company}</p>
                        {exp.description && (
                          <p className="text-xs text-neutral-700 font-medium leading-relaxed pt-1 whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Formações */}
              {profile.educations && profile.educations.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-md font-extrabold text-neutral-900 uppercase">Educação / Cursos</h2>
                  <div className="space-y-6">
                    {profile.educations.map((edu) => (
                      <div key={edu.id} className="bg-white border-[3px] border-neutral-950 p-5 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
                        <span className="text-[10px] font-black uppercase text-neutral-500">
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Cursando' : formatDate(edu.end_date || '')}
                        </span>
                        <h3 className="text-sm font-extrabold text-neutral-900">{edu.course}</h3>
                        <p className="text-xs font-bold text-neutral-650 bg-[#fed7aa] border border-neutral-950 inline-block px-2 py-0.5 rounded">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

          </div>
        </div>
      </>
    );
  }

  // Fallback to basic layout just in case
  return (
    <div className="p-8">
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
    </div>
  );
}


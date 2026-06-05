import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import axios from 'axios';
import { PortfolioClientView } from './portfolio-client-view';

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
  
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const description = profile.bio 
    ? (profile.bio.length > 160 ? profile.bio.substring(0, 157) + '...' : profile.bio) 
    : `Confira o portfólio profissional de ${profile.name} no DevFolio.`;
  const avatarUrl = profile.avatar_url || '';

  return {
    title: `${profile.name} | ${profile.role || 'Desenvolvedor'} | DevFolio`,
    description: description,
    openGraph: {
      title: `${profile.name} | ${profile.role || 'Desenvolvedor'}`,
      description: description,
      url: `${siteUrl}/${profile.username}`,
      siteName: 'DevFolio SaaS',
      type: 'profile',
      username: profile.username,
      images: avatarUrl ? [
        {
          url: avatarUrl,
          width: 800,
          height: 800,
          alt: `Foto de perfil de ${profile.name}`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.name} | ${profile.role || 'Desenvolvedor'}`,
      description: description,
      images: avatarUrl ? [avatarUrl] : [],
    },
  };
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const profile = await getPortfolio(resolvedParams.username);

  if (!profile) {
    notFound();
  }

  return <PortfolioClientView profile={profile} />;
}

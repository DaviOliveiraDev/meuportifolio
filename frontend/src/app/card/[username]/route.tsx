import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

type BadgeType = {
  id: string;
  name: string;
  description: string;
  icon_path: string;
};

type ProfileType = {
  id: string;
  name: string;
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
  role?: string | null;
  location?: string | null;
  ovr?: number;
  xp?: number;
  level?: number;
  profile_completeness?: number;
  badges?: BadgeType[];
};

function getRaritySatori(ovr: number) {
  if (ovr >= 95) {
    return {
      name: 'LEGENDARY',
      border: '#ec4899',
      bg: '#0a0a0a',
      glow: '0px 0px 30px rgba(236,72,153,0.6)',
      textGradient: 'linear-gradient(to bottom right, #a855f7, #ec4899, #f59e0b)',
      textColor: '#fcd34d',
    };
  }
  if (ovr >= 85) {
    return {
      name: 'DIAMOND',
      border: '#6366f1',
      bg: '#0f172a',
      glow: '0px 0px 25px rgba(99,102,241,0.5)',
      textGradient: 'linear-gradient(to bottom right, #22d3ee, #6366f1, #a855f7)',
      textColor: '#67e8f9',
    };
  }
  if (ovr >= 75) {
    return {
      name: 'GOLD',
      border: '#f59e0b',
      bg: '#171717',
      glow: '0px 0px 20px rgba(245,158,11,0.4)',
      textGradient: 'linear-gradient(to bottom right, #fbbf24, #f59e0b, #d97706)',
      textColor: '#fbbf24',
    };
  }
  if (ovr >= 65) {
    return {
      name: 'SILVER',
      border: '#94a3b8',
      bg: '#18181b',
      glow: '0px 0px 15px rgba(148,163,184,0.3)',
      textGradient: 'linear-gradient(to bottom right, #cbd5e1, #94a3b8, #64748b)',
      textColor: '#cbd5e1',
    };
  }
  return {
    name: 'BRONZE',
    border: '#9a3412',
    bg: '#1c1917',
    glow: 'none',
    textGradient: 'linear-gradient(to bottom right, #b45309, #9a3412, #78350f)',
    textColor: '#fdba74',
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const username = (await params).username;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api/v1';
    const profileRes = await fetch(`${backendUrl}/portfolios/${username}`, {
      next: { revalidate: 30 },
    });

    if (!profileRes.ok) {
      return new Response('Profile not found', { status: 404 });
    }

    const { profile }: { profile: ProfileType } = await profileRes.json();

    const ovr = profile.ovr || 1;
    const level = profile.level || 1;
    const badgesCount = profile.badges?.length || 0;
    const completeness = profile.profile_completeness || 0;

    const tier = getRaritySatori(ovr);

    const fontBold = await fetch(
      'https://github.com/google/fonts/raw/main/ofl/inter/static/Inter-Bold.ttf'
    ).then((res) => res.arrayBuffer());

    const fontRegular = await fetch(
      'https://github.com/google/fonts/raw/main/ofl/inter/static/Inter-Regular.ttf'
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            width: '800px',
            height: '600px',
            background: '#030712',
            backgroundImage: 'radial-gradient(circle at 10% 20%, #1e1b4b 0%, #030712 60%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '50px 60px',
            fontFamily: 'Inter',
          }}
        >
          <div
            style={{
              width: '320px',
              height: '480px',
              borderRadius: '28px',
              padding: '4px',
              background: tier.textColor,
              backgroundImage: tier.textGradient,
              boxShadow: tier.glow,
              display: 'flex',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '24px',
                background: tier.bg,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '100%',
                  background: tier.textColor,
                  opacity: 0.15,
                  filter: 'blur(30px)',
                  display: 'flex',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1.5px', color: tier.textColor }}>
                    {tier.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginTop: '2px' }}>
                    LVL {level}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold', color: tier.textColor, lineHeight: 1 }}>
                    {ovr}
                  </span>
                  <span style={{ fontSize: '8px', letterSpacing: '1px', color: '#9ca3af', fontWeight: 'bold' }}>
                    OVR
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px', flexGrow: 1 }}>
                <div
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '100%',
                    padding: '3px',
                    backgroundImage: tier.textGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '100%',
                        objectFit: 'cover',
                        background: '#090909',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '100%',
                        background: '#090909',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      {profile.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginTop: '16px', textAlign: 'center' }}>
                  {profile.name}
                </span>

                <span style={{ fontSize: '11px', color: tier.textColor, fontWeight: 'bold', letterSpacing: '1px', marginTop: '4px', textTransform: 'uppercase' }}>
                  {profile.role || 'Developer'}
                </span>

                <span style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: '16px', fontStyle: 'italic', padding: '0 8px' }}>
                  "{profile.bio ? (profile.bio.length > 80 ? profile.bio.substring(0, 77) + '...' : profile.bio) : 'DevFolio profile ready.'}"
                </span>
              </div>

              <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', color: tier.textColor, fontWeight: 'bold', letterSpacing: '1px' }}>
                  {badgesCount} {badgesCount === 1 ? 'ACHIEVEMENT' : 'ACHIEVEMENTS'} UNLOCKED
                </span>
              </div>
            </div>
          </div>

          <div style={{ width: '360px', display: 'flex', flexDirection: 'column', height: '480px', justifyContent: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '3px', color: '#818cf8', textTransform: 'uppercase' }}>
              Developer Profile
            </span>
            <span style={{ fontSize: '38px', fontWeight: 'bold', color: 'white', marginTop: '6px', lineHeight: 1.1 }}>
              {profile.name}
            </span>
            <span style={{ fontSize: '14px', color: '#9ca3af', marginTop: '6px' }}>
              @{profile.username}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' }}>
                  <span>OVERALL RATING (OVR)</span>
                  <span style={{ color: tier.textColor }}>{ovr} / 99</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: '#1f2937', borderRadius: '3px', display: 'flex' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(ovr / 99) * 100}%`,
                      backgroundImage: tier.textGradient,
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' }}>
                  <span>LEVEL {level} PROGRESS</span>
                  <span style={{ color: 'white' }}>{profile.xp} XP Total</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: '#1f2937', borderRadius: '3px', display: 'flex' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (level / 20) * 100)}%`,
                      backgroundImage: 'linear-gradient(to right, #818cf8, #6366f1)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' }}>
                  <span>PROFILE COMPLETENESS</span>
                  <span style={{ color: '#a78bfa' }}>{completeness}%</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: '#1f2937', borderRadius: '3px', display: 'flex' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${completeness}%`,
                      backgroundImage: 'linear-gradient(to right, #a78bfa, #8b5cf6)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '100%', background: '#22c55e' }} />
              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold', letterSpacing: '1px' }}>
                DEVFOLIO.NET
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 600,
        fonts: [
          {
            name: 'Inter',
            data: fontBold,
            weight: 700,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: fontRegular,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );

  } catch (error: any) {
    console.error('Error rendering OG Card image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

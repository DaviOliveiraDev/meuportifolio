<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Currículo - {{ $profile->name }}</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #1a1a1a;
            line-height: 1.5;
            margin: 0;
            padding: 40px;
            font-size: 13px;
            background-color: #ffffff;
        }
        
        /* Header section */
        .header {
            text-align: center;
            border-bottom: 2px solid #333333;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        
        .name {
            font-size: 26px;
            font-weight: bold;
            color: #111111;
            margin: 0 0 5px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .role {
            font-size: 16px;
            font-weight: 600;
            color: #555555;
            margin: 0 0 10px 0;
        }
        
        .contact-info {
            font-size: 11px;
            color: #444444;
            margin: 0;
        }
        
        .contact-info span {
            margin: 0 8px;
        }
        
        /* Typography */
        h2 {
            font-size: 14px;
            font-weight: bold;
            color: #222222;
            text-transform: uppercase;
            border-bottom: 1px solid #cccccc;
            padding-bottom: 4px;
            margin-top: 25px;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
        }
        
        .section-content {
            margin-bottom: 20px;
        }
        
        .bio {
            text-align: justify;
            margin: 0;
        }
        
        /* Grid and generic item listing */
        .item {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            color: #111111;
            margin-bottom: 3px;
        }
        
        .item-subheader {
            display: flex;
            justify-content: space-between;
            font-style: italic;
            color: #555555;
            font-size: 12px;
            margin-bottom: 6px;
        }
        
        .item-description {
            margin: 0;
            text-align: justify;
            color: #333333;
        }
        
        /* Skills block */
        .skills-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        
        .skills-list li {
            display: inline-block;
            background-color: #f3f4f6;
            color: #374151;
            padding: 4px 10px;
            border-radius: 4px;
            margin-right: 6px;
            margin-bottom: 6px;
            font-size: 11px;
            font-weight: 500;
        }

        /* Project specific link styling */
        .project-links {
            font-size: 11px;
            margin-top: 4px;
            color: #2563eb;
        }
        
        .project-links a {
            color: #2563eb;
            text-decoration: none;
            margin-right: 12px;
        }

        .project-links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <!-- Cabeçalho de Contato -->
    <div class="header">
        <h1 class="name">{{ $profile->name }}</h1>
        @if($profile->role)
            <div class="role">{{ $profile->role }}</div>
        @endif
        
        <p class="contact-info">
            @if($profile->location)
                <span>{{ $profile->location }}</span> |
            @endif
            <span>{{ $profile->user->email }}</span>
            @if($profile->linkedin_url)
                | <span>LinkedIn: {{ parse_url($profile->linkedin_url, PHP_URL_PATH) }}</span>
            @endif
            @if($profile->github_url)
                | <span>GitHub: {{ parse_url($profile->github_url, PHP_URL_PATH) }}</span>
            @endif
            @if($profile->website_url)
                | <span>Website: {{ parse_url($profile->website_url, PHP_URL_HOST) ?? $profile->website_url }}</span>
            @endif
        </p>
    </div>

    <!-- Perfil Resumo -->
    @if($profile->bio)
        <h2>Resumo Profissional</h2>
        <div class="section-content">
            <p class="bio">{{ $profile->bio }}</p>
        </div>
    @endif

    <!-- Competências -->
    @if(count($profile->skills) > 0)
        <h2>Competências e Tecnologias</h2>
        <div class="section-content">
            <ul class="skills-list">
                @foreach($profile->skills as $skill)
                    <li>{{ $skill->name }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <!-- Experiência Profissional -->
    @if(count($profile->experiences) > 0)
        <h2>Experiência Profissional</h2>
        <div class="section-content">
            @foreach($profile->experiences as $exp)
                <div class="item">
                    <div class="item-header">
                        <span>{{ $exp->role }}</span>
                        <span>
                            {{ \Carbon\Carbon::parse($exp->start_date)->translatedFormat('M/Y') }} – 
                            {{ $exp->is_current ? 'Presente' : \Carbon\Carbon::parse($exp->end_date)->translatedFormat('M/Y') }}
                        </span>
                    </div>
                    <div class="item-subheader">
                        <span>{{ $exp->company }}</span>
                        @if($exp->location)
                            <span>{{ $exp->location }}</span>
                        @endif
                    </div>
                    @if($exp->description)
                        <p class="item-description">{{ $exp->description }}</p>
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Formação Acadêmica -->
    @if(count($profile->educations) > 0)
        <h2>Formação Acadêmica</h2>
        <div class="section-content">
            @foreach($profile->educations as $edu)
                <div class="item">
                    <div class="item-header">
                        <span>{{ $edu->degree }} em {{ $edu->field_of_study }}</span>
                        <span>
                            {{ \Carbon\Carbon::parse($edu->start_date)->translatedFormat('M/Y') }} – 
                            {{ $edu->end_date ? \Carbon\Carbon::parse($edu->end_date)->translatedFormat('M/Y') : 'Presente' }}
                        </span>
                    </div>
                    <div class="item-subheader">
                        <span>{{ $edu->institution }}</span>
                    </div>
                    @if($edu->description)
                        <p class="item-description">{{ $edu->description }}</p>
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Projetos de Maior Destaque -->
    @if(count($profile->projects) > 0)
        <h2>Projetos em Destaque</h2>
        <div class="section-content">
            @foreach($profile->projects->take(5) as $project)
                <div class="item">
                    <div class="item-header">
                        <span>{{ $project->title }}</span>
                    </div>
                    <p class="item-description">{{ $project->description }}</p>
                    @if($project->repository_url || $project->demo_url)
                        <div class="project-links">
                            @if($project->repository_url)
                                <a href="{{ $project->repository_url }}" target="_blank">Código Fonte (GitHub)</a>
                            @endif
                            @if($project->demo_url)
                                <a href="{{ $project->demo_url }}" target="_blank">Demonstração Online</a>
                            @endif
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    @endif

</body>
</html>

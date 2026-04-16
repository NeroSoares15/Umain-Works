# Configuração de Permissões e Acessos - RiskRadar

Este documento detalha os diferentes perfis de utilizador, os seus privilégios de edição e restrições de visibilidade (RGPD e Proteção de Dados) dentro da plataforma RiskRadar.

## 1. Tipos de Perfis (Roles)

O sistema opera atualmente com três (3) perfis fundamentais de acesso:

1. **Diretor de Curso (`diretor`)**
2. **Técnicos dos Serviços de Ação Social (`sas`)**
3. **Observatório Institucional (`obs`)**

---

## 2. Matriz de Privilégios por Página

### 2.1. Dashboard (Visão Global)

*   **Todos os Perfis**: Têm acesso à visão geral de risco, distribuição demográfica e lista de estudantes sinalizados.
*   **Observatório (`obs`)**: Por motivos de privacidade analítica, **todos os nomes de utilizadores e números mecanográficos são ocultados** (ex: *Estudante Anónimo #X*).

### 2.2. Student Profile (Visão de Detalhe)

A página de perfil do estudante possui diferentes camadas de segurança dependendo da natureza dos indicadores.

| Secção | Diretor de Curso | SAS | Observatório |
| :--- | :--- | :--- | :--- |
| **Identificação** | Visível | Visível | **Oculto** (Anonimizado) |
| **Indicadores Académicos** | Visível | Visível | Visível |
| **Atividade Moodle** | Visível | Visível | Visível |
| **Indicadores Financeiros** | ❌ **Restrito** | Visível | Visível |
| **Contexto Socioeconómico** | ❌ **Restrito** | Visível | Visível |

**Nota sobre Conformidade:** O perfil do Diretor de Curso não pode aceder aos dados sensíveis de cariz socioeconómico (Bolsas, Propinas, Necessidades Especiais), sendo estes da exclusiva competência dos Serviços de Ação Social. O preenchimento da narrativa de IA (Risk Narrative) adapta o discurso removendo inputs financeiros no ecrã do Diretor.

### 2.3. Settings (Configuração do Motor de Risco)

*   **Serviços de Ação Social (`sas`)**: **Privilégio Total de Leitura e Escrita**. Podem interagir quer com o modo de visualização, quer com o "Edit Mode" (Ícone Lápis) para calibrar Tolerâncias de Risco, Multiplicadores de Perfil e Assiduidade.
*   **Diretor de Curso (`diretor`)**: **Privilégio Exclusivo de Leitura**. Podem visualizar a matriz de regras usada no motor, mas os botões de edição/ação estão bloqueados ou ocultos.
*   **Observatório (`obs`)**: **Sem Acesso / Leitura Opcional**.

---

## 3. Gestão e Autenticação (A Desenvolver)

Atualmente, as sessões de perfil (Profile Switcher) na demo funcionam como uma *Impersonation* local (`AppContext.tsx`). No sistema de produção, o login será feito com SSO Institucional, mapeando dinamicamente estes grupos do `Azure AD` / `LDAP` para as `ActiveProfileId` (`diretor`, `sas`, `obs`).
